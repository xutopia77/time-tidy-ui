// Business facade coupled to the app store: all store-touching helpers and
// backend API wrappers moved here from the former utils.ts god module.
// The module-level `appStore` variable is assigned once via appstore_set()
// (called by Utils.appstore_set during app bootstrap), keeping the original
// behavior unchanged.

import type { AppStore } from '@/stores/AppStore'
import { initApiClient } from '@/utils/apiClient';
import { ApiService } from '@/utils/apiService';
import { message_notify as toast_notify } from '@/common/toast';
import { logger } from '@/common/logger';
import { get_next_tag_color } from '@/common/format';
import { buildFilesGetReq } from '@/common/search';
import { checkedFileIds, clearChecked } from '@/common/selection';
import * as DatTypes from '@/utils/dataTypedef'

let appStore: AppStore
let isLoadingTags = false;

export function appstore_set(store: AppStore) {
    appStore = store;
    initApiClient(store);
}

function get_dir_trees() {
    const allDirs = appStore.curAllDirs;
    const dirTree: DatTypes.DirTreeItem[] = [];
    appStore.DirTrees = []
    // traverse all directory items
    for (const dir of allDirs) {
        if( dir.dir.type != DatTypes.DirType.Normal ) {
            logger.info(`Unknown dir type: ${dir.dir.type}, skipping dir ${dir.path}`);
            continue;
        }
        // split path and filter out empty strings
        const pathParts = dir.path.split('/').filter(part => part);
        let currentLevel = dirTree;
        for (const part of pathParts) {
            // look for an existing node at the current level
            let foundNode = currentLevel.find(node => node.name === part);

            if (!foundNode) {
                // create a new node when not found
                foundNode = {
                    expanded: true,
                    name: part,
                    count: 0,
                    dirInfo: dir,
                    children: []
                };
                currentLevel.push(foundNode);
            }
            // move to the next level
            currentLevel = foundNode.children || [];
        }
    }
    appStore.DirTrees = dirTree;
}

function convert_to_file_item(_srcStr: string, convType: string = ""): DatTypes.Resp {

    const update_after_get_files = () => {
        if (appStore.curFiles.length == 0) {
            appStore.curSltFile = null;
        }
        else {
            for (const item of appStore.curFiles) {
                if (item.id == appStore.curSltFile?.id) {
                    appStore.curSltFile = item;
                    break;
                }
            }
        }
    }

    const convert_json_str_to_file = (jRecordStr: string): DatTypes.File | null => {
        const fileItem = new DatTypes.File();
        const jRecord = JSON.parse(jRecordStr);
        const fileType = DatTypes.stringToFileType(jRecord.type);
        if (fileType == null) {
            logger.warn(`Unknown file type: ${jRecord.type}, skipping file ${jRecord.name}`);
            return null;
        }

		fileItem.id = jRecord.id;
		fileItem.rootPathId = jRecord.root_path_id;
		fileItem.name = jRecord.name;
		fileItem.path = jRecord.path;
		fileItem.fullpath = jRecord.full_path;
		fileItem.size = jRecord.size;
		fileItem.time = jRecord.create_time
		fileItem.type = fileType;
		fileItem.uniqueHash = jRecord.unique_hash;
		fileItem.extension = jRecord.extension || '';
		fileItem.origin = jRecord.origin || '';
		fileItem.description = jRecord.description || '';

		// Media metadata fields
		fileItem.duration = jRecord.duration || 0;
		fileItem.width = jRecord.width || 0;
		fileItem.height = jRecord.height || 0;

		// GPS location fields
		fileItem.latitude = jRecord.latitude || 0;
		fileItem.longitude = jRecord.longitude || 0;
		fileItem.altitude = jRecord.altitude || 0;

		if (fileItem.type == DatTypes.FileType.audio) {
            fileItem.icon = `data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 44H38C39.1046 44 40 43.1046 40 42V14H30V4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 4L40 14" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 31V28C26.2091 28 28 25.9853 28 23.5C28 21.0147 26.2091 19 24 19C21.7909 19 20 21.0147 20 23.5" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 39C25.3807 39 26.5 37.8807 26.5 36.5C26.5 35.1193 24 34 24 34C22.6193 34 21.5 35.1193 21.5 36.5C21.5 37.8807 22.6193 39 24 39Z" fill="%23333"/></svg>`;
        }
        else if (fileItem.type == DatTypes.FileType.other) {
            fileItem.icon = `data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 44H38C39.1046 44 40 43.1046 40 42V14H30V4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 4L40 14" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 31V28C26.2091 28 28 25.9853 28 23.5C28 21.0147 26.2091 19 24 19C21.7909 19 20 21.0147 20 23.5" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 39C25.3807 39 26.5 37.8807 26.5 36.5C26.5 35.1193 24 34 24 34C22.6193 34 21.5 35.1193 21.5 36.5C21.5 37.8807 22.6193 39 24 39Z" fill="%23333"/></svg>`;
        }
        else {
            fileItem.icon = appStore.srvPrefix + "/static_thumb/" + fileItem.id + "_thumbnail.jpg";
        }

        if (jRecord.tags != null) {
            for (const x of jRecord.tags) {
                const tag = new DatTypes.FileItemTag();
                tag.id = x.id || 0;
                tag.name = x.name || '';
                tag.color = x.color || tag.color;
                tag.type = x.type || tag.type;
                tag.description = x.description || tag.description;
                tag.source = x.source || 'manual';
                tag.confidence = x.confidence || 1.0;
                tag.createdAt = x.createdAt || x.created_at || '';
                tag.updatedAt = x.updatedAt || x.updated_at || '';
                if (tag.name == '') {
                    continue;
                }
                fileItem.tags.push(tag)
            }
        }
        return fileItem;
    }

    if (convType == "") {
        const resp = new DatTypes.Resp()
        const jData = JSON.parse(_srcStr);
        if (jData.code != 0) {
            resp.code = jData.code;
            resp.status = jData.status;
            return resp;
        }
        if (jData.data.files != null) {
            const files: DatTypes.File[] = []
            const jRecords = jData.data.files.records;
            if (jRecords != null) {
                for (const jRecord of jRecords) {
                    const fileItem = convert_json_str_to_file(JSON.stringify(jRecord));
                    if (fileItem == null) {
                        continue;
                    }
                    files.push(fileItem);
                }
                appStore.curFileTotal = jData.data.files.total;
                appStore.curFiles = files;
            }
            else {
                appStore.curFileTotal = 0;
                appStore.curFiles = [];
            }
        }
        else {
            appStore.curFileTotal = 0;
            appStore.curFiles = [];
        }
        update_after_get_files()
        if (jData.data.dirs != null) {
            {
                const dirs: DatTypes.DirItem[] = []
                const jRecords = jData.data.dirs.records;
                for (const jRecord of jRecords) {
                    if (jRecord.Type == 0) {
                        continue; // skip the root path
                    }
                    const dirItem = new DatTypes.DirItem();
                    dirItem.dir.id = jRecord.id;
                    dirItem.dir.path = jRecord.path;
                    dirItem.dir.name = jRecord.name;
                    dirItem.dir.rootPathId = jRecord.rootPathId;
                    dirItem.dir.type = jRecord.type;
                    dirItem.dir.alias = jRecord.alias;
                    dirItem.dir.infoHash = jRecord.infoHash;
                    dirItem.dir.status = jRecord.status;
                    dirItem.dir.description = jRecord.description;
                    dirItem.dir.createdAt = jRecord.createdAt;
                    dirItem.dir.updatedAt = jRecord.updatedAt;


                    const itemPath = "/" + jRecord.path;
                    dirItem.id = dirItem.dir.id;
                    dirItem.rootPathId = dirItem.dir.rootPathId;
                    dirItem.name = jRecord.name;
                    dirItem.icon = '/assets/images/folders.svg'
                    dirItem.type = DatTypes.FileType.folder;

                    dirItem.path = itemPath;
                    if (jRecord.tags != null) {
                        dirItem.tags = jRecord.tags
                    }
                    dirs.push(dirItem);
                }
                appStore.curAllDirs = dirs;
            }
            const dirs: DatTypes.DirItem[] = []
            appStore.curDirs = [];
            const jRecords = jData.data.dirs.records;
            logger.debug(`curpath:[${appStore.curPath}], dirs:${dirs}`);
            if (jRecords != null) {
                for (const jRecord of jRecords) {
                    if (jRecord.Type == 0) {
                        continue; // skip the root path
                    }
                    const itemPath = "/" + jRecord.path;
                    const iteamPaths = itemPath.split('/');
                    const curPaths = appStore.curPath === "/" ? [''] : appStore.curPath.split('/');
                    if (iteamPaths.length <= curPaths.length) {
                        continue;
                    }

                    let bNot = false
                    let i = 0
                    for (i = 0; i < curPaths.length; i++) {
                        if (iteamPaths[i] != curPaths[i]) {
                            bNot = true
                            break
                        }
                    }
                    if (bNot) {
                        continue
                    }
                    if (iteamPaths.length > curPaths.length + 1) {
                        continue;
                    }
                    const curName = iteamPaths[i]
                    const dirItem = new DatTypes.DirItem();
                    dirItem.id = jRecord.id;
                    dirItem.rootPathId = jRecord.rootPathId;
                    dirItem.name = curName
                    dirItem.icon = '/assets/images/folders.svg'
                    dirItem.type = DatTypes.FileType.folder;
                    dirItem.path = itemPath;
                    if (jRecord.tags != null) {
                        dirItem.tags = jRecord.tags
                    }
                    dirs.push(dirItem);
                }
                appStore.curDirs = dirs;
            }
            else {
                appStore.curDirs = [];
            }
        }
        else {
            appStore.curDirs = [];
        }
        return resp;
    }

    if (convType == "file_similarity_get") {
        const resp = new DatTypes.Resp()
        const jData = JSON.parse(_srcStr);
        if (jData.code != 0) {
            resp.code = jData.code;
            resp.status = jData.status;
            return resp;
        }

        if (jData.data != null) {
            const files: DatTypes.File[] = [];
            const catalogArr: DatTypes.FileCatalog[] = [];
            const jRecords = jData.data;
            for (const jRecord of jRecords) {
                const fileCatalog = new DatTypes.FileCatalog();
                for (const jFiles of jRecord) {
                    const fileItem = convert_json_str_to_file(JSON.stringify(jFiles));
                    if (fileItem == null) {
                        continue;
                    }
                    files.push(fileItem)
                    fileCatalog.name = fileItem.uniqueHash
                    fileCatalog.files.push(fileItem)
                }
                catalogArr.push(fileCatalog)
            }
            appStore.curFileTotal = files.length;
            appStore.curFiles = files;
            appStore.fileSililarity = catalogArr;
        }
        else {
            appStore.curFileTotal = 0;
            appStore.curFiles = [];
        }
        update_after_get_files()
        appStore.curDirs = [];
        appStore.fileShowType = "fileSimilarity"
        return resp;
    }
    const resp = new DatTypes.Resp()
    resp.code = 1;
    resp.status = "Unknow convert type";
    return resp;
}

export async function tags_get(withFileCount: boolean = false) {
    if (isLoadingTags) {
        return;
    }
    isLoadingTags = true;

    // build the list first, then assign once - keep existing tags on failure
    try {
        const req = new DatTypes.TagsGetReq();
        req.withFileCount = withFileCount;
        const resp = await ApiService.tagsGet(req);

        const tags: DatTypes.TagItem[] = [];
        for (const item of resp.data) {
            if (!item.name || item.name == "") {
                continue;
            }
            const tagItem = new DatTypes.TagItem();
            tagItem.name = item.name;
            tagItem.color = item.color == '' ? tagItem.color : item.color;
            tagItem.id = item.id;
            tagItem.description = item.description || '';
            tagItem.fileCount = item.fileCount || 0;
            tags.push(tagItem);
        }
        appStore.allTags = tags;
    } catch (error) {
        logger.error('Error fetching tags:', error);
    } finally {
        isLoadingTags = false;
    }
}

export async function tags_set(tag: DatTypes.TagItem): Promise<void> {
    const scoreRegex = /^[1-5]☆$/;
    if (scoreRegex.test(tag.name)) {
        message_notify({ content: `系统标签 ${tag.name} 不能被修改`, type: "error" });
        return;
    }

    const req = {
        tags: [{
            id: tag.id,
            name: tag.name,
            color: tag.color,
            description: tag.description || ''
        }]
    };

    try {
        const resp = await ApiService.tagsSet(req);
        logger.debug('tag info:', resp);
        tags_get()
        message_notify({ content: `标签设置成功`, type: 'success' })
    } catch (error) {
        logger.error('Error setting tag:', error);
    }
}

export async function files_path_chg(_req: DatTypes.FilePathChgReq): Promise<DatTypes.Resp<DatTypes.FilePathChgResp>> {
    _req.distPath = _req.distPath.substring(1);

    try {
        const response = await ApiService.filesPathChg(_req);
        logger.debug('file info:', response);

        switch (response.code) {
            case DatTypes.Code.Success: {
                files_get(null);
                message_notify({ content: `${response.data?.successNum}个文件操作成功`, type: 'success' })
                break;
            }
            case DatTypes.Code.NeedSure: {
                message_notify({ content: `文件操作需要确认`, type: 'success' })
                break;
            }
            case DatTypes.Code.FileAlreadyExist: {
                files_get(null);
                message_notify({ content: `${response.data?.successNum}个文件操作成功,${response.data?.failNum}个文件已存在`, type: 'warning' })
                break;
            }
            default: {
                message_notify({ content: `文件操作失败，已操作成功${response.data?.successNum}个， ${response.status}`, type: "error" })
                break;
            }
        }
        return response;
    } catch (error) {
        logger.error('Error fetching project info:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        message_notify({ content: `文件操作失败\n${errorMsg}`, type: 'error' })
        return { code: -1, status: errorMsg, doing: false };
    }
}

export async function files_delete(_req: DatTypes.FileDeleteReq): Promise<DatTypes.Resp> {
    try {
        const response = await ApiService.filesDelete(_req);
        logger.debug('file delete response:', response);
        files_get(null);
        message_notify({ content: `文件删除成功`, type: 'success' });
        return response;
    } catch (error) {
        logger.error('Error deleting files:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        message_notify({ content: `文件删除失败\n${errorMsg}`, type: 'error' });
        return { code: -1, status: errorMsg, doing: false };
    }
}

export async function files_restore(fileIds: number[]): Promise<DatTypes.Resp> {
    try {
        const req = new DatTypes.FileRestoreReq();
        req.fileIds = fileIds;
        const response = await ApiService.filesRestore(req);
        logger.debug('file restore response:', response);
        message_notify({ content: `文件恢复成功`, type: 'success' });
        return response;
    } catch (error) {
        logger.error('Error restoring files:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        message_notify({ content: `文件恢复失败\n${errorMsg}`, type: 'error' });
        return { code: -1, status: errorMsg, doing: false };
    }
}

export async function project_health(): Promise<DatTypes.Resp> {
    log_info_append("------开始数据健康度检查\n");
    try {
        const req = new DatTypes.FileHealthGetReq();
        req.type = 2;
        const response = await ApiService.projectHealth(req);
        files_get(null);
        message_notify({ content: `数据健康度检查成功`, type: 'success' })
        return response;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        message_notify({ content: `数据健康度检查失败\n${errorMsg}`, type: 'error' })
        return { code: -1, status: errorMsg, doing: false };
    }
}

export function page_show(_req: DatTypes.AppPageCtrlReq): DatTypes.Resp {
    const resp = new DatTypes.Resp()
    const validPages = ['home', 'set', 'message'];

    if (validPages.includes(_req.page)) {
        const pageItemInit = appStore.pageCtrlInit[_req.page as keyof typeof appStore.pageCtrl];
        appStore.pageCtrl[_req.page as keyof typeof appStore.pageCtrl] = pageItemInit;
        const pageItem = appStore.pageCtrl[_req.page as keyof typeof appStore.pageCtrl];
        const wasVisible = pageItem.bShow;
        pageItem.bShow = _req.bShow;
        if (!wasVisible && pageItem.bShow) {
            pageItem.idx += 1000;
        }
    } else {
        resp.code = -1;
        resp.status = `unknown page: ${_req.page}`;
    }
    return resp;
}

export function log_info_append(cont: string) {
    appStore.logInfo += cont
}

export async function dictionary_get() {
    try {
        const resp = await ApiService.dictionaryGet();
        logger.debug('dictionary info:', resp.data);
    } catch (error) {
        logger.error('Error fetching dictionary:', error);
    }
}

export function get_thumbnail_url(fileId: number): string {
    return `${appStore.srvPrefix}/static_thumb/${fileId}_thumbnail.jpg`;
}

export function dir_slt_update(treeItem: DatTypes.DirTreeItem | string) {
    if (typeof treeItem === 'string') {
        const path = treeItem; // treeItem is a path string
        appStore.curPath = path;
        // recursive lookup
        const findNodeRecursively = (nodes: DatTypes.DirTreeItem[]): DatTypes.DirTreeItem | undefined => {
            for (const node of nodes) {
                if (node.dirInfo.path === path) {
                    return node;
                }
                if (node.children && node.children.length > 0) {
                    const foundInChildren = findNodeRecursively(node.children);
                    if (foundInChildren) {
                        return foundInChildren;
                    }
                }
            }
            return undefined;
        };

        const titem = findNodeRecursively(appStore.DirTrees);
        if (titem == null) {
            if (treeItem != '/') {
                logger.debug(`dir slt update: path:${path} not found`);
                return;
            }
        }
        if (titem == undefined) {
            appStore.curSltDirTreeItem = null;
        }
        else {
            appStore.curSltDirTreeItem = titem;
        }
    }
    else {
        appStore.curSltDirTreeItem = treeItem;
        if (treeItem.dirInfo != null) {
            appStore.curPath = treeItem.dirInfo.path;
        }
    }
    files_get(null)
}

export async function tag_delete(_req: DatTypes.TagItem): Promise<DatTypes.Resp> {
    const resp = new DatTypes.Resp()
    const scoreRegex = /^[1-5]☆$/;
    if (scoreRegex.test(_req.name)) {
        message_notify({ content: `系统标签 ${_req.name} 不能被删除`, type: "error" });
        return resp;
    }

    try {
        const req = new DatTypes.TagsDeleteReq();
        req.tagName = _req.name;
        const response = await ApiService.tagsDelete(req);
        logger.debug('tag delete response:', response);
        message_notify({ content: `删除标签成功`, type: 'success' })
        tags_get()
        files_get(null)
    } catch (error) {
        logger.error('Error deleting tag:', error);
        message_notify({ content: `程序错误:${error}`, type: "error" })
    }
    return resp
}

// notify via Naive UI message api (bound in AppShellBridge); the legacy
// signature is kept so 30+ call sites stay unchanged
export function message_notify(_req: DatTypes.MessageReq) {
    toast_notify({ content: _req.content, type: _req.type });
}

export function addToast(message: string, type: DatTypes.MessageShowType = 'info') {
    toast_notify({ content: message, type: type });
}

// clear all historical messages
export function clearHistoryToasts() {
    appStore.historyToasts = []
}

export function files2Catalog(): DatTypes.FileCatalog[] {
    const fileCatalog: DatTypes.FileCatalog[] = [];
    if (appStore.fileShowType == "") {
        const item = new DatTypes.FileCatalog();
        item.name = "";
        item.files = appStore.curFiles;
        fileCatalog.push(item)
    }
    else if (appStore.fileShowType == "time") {
        for (const file of appStore.curFiles) {
            const time = file.time;
            const year = time.substring(0, 4);
            const month = time.substring(5, 7);
            const day = time.substring(8, 10);
            const date = year + "-" + month + "-" + day;
            let found = false;
            for (const item of fileCatalog) {
                if (item.name == date) {
                    item.files.push(file);
                    found = true;
                    break;
                }
            }
            if (!found) {
                const item = new DatTypes.FileCatalog();
                item.name = date;
                item.files.push(file);
                fileCatalog.push(item)
            }
        }
    }
    else if (appStore.fileShowType == "fileSimilarity") {
        return appStore.fileSililarity
    }
    return fileCatalog
}

export async function project_set(req: DatTypes.PrjSetReq) {
    log_info_append("------开始设置项目\n");
    try {
        const resp = await ApiService.projectSet(req);

        if (resp.doing) {
            addToast("设置中", "info")
        }
        else {
            message_notify({ content: "设置完成", type: "success" })
            if (req.type.length > 0 && req.type[0] == DatTypes.PrjSetType.Open) {
                await prj_info_get()
            }
        }
    } catch (error) {
        logger.error('Error setting project:', error);
    }
}

export async function files_get(_req: DatTypes.FilesGetReq | null = null, bUpdateStore: boolean = true): Promise<DatTypes.Resp> {
    const req = buildFilesGetReq(appStore.searchCon, appStore.curPath, _req);

    try {
        logger.debug('files_get request tags:', req.tags, 'noTag:', req.noTag, 'bReverseTag:', req.bReverseTag, 'bAndTag:', req.bAndTag);
        const response = await ApiService.filesGet(req);
        logger.debug('file info:', response);
        if (bUpdateStore) {
            const result: DatTypes.Resp = convert_to_file_item(JSON.stringify(response))
            if (result.code === 0) {
                get_dir_trees()
            } else {
                logger.error('Error converting file items:', result.status);
            }
            return result;
        } else {
            return response;
        }
    } catch (error) {
        logger.error('Error fetching files:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return { code: -1, status: errorMsg, doing: false };
    }
}

export function cancle_file_checked() {
    clearChecked(appStore.curFiles);
}

export async function files_tag_set(_req: DatTypes.FilesTagSetReq): Promise<DatTypes.Resp> {
    _req.fileIds = checkedFileIds(appStore.curFiles);
    if (_req.fileIds.length == 0) {
        if (appStore.curSltFile == null) {
            return { code: -1, status: `no file selected`, doing: false };
        }
        else {
            _req.fileIds.push(appStore.curSltFile.id)
        }
    }

    if (!_req.tagColor || _req.tagColor === '') {
        const existingTag = appStore.allTags.find(tag => tag.name === _req.tagName);
        if (existingTag) {
            _req.tagColor = existingTag.color;
        } else {
            _req.tagColor = get_next_tag_color();
        }
    }

    try {
        const response = await ApiService.filesTagSet(_req);
        logger.debug('file info:', response);
        if (response.doing) {
            message_notify({ content: `文件操作中`, type: "warning" })
            return response;
        }
        cancle_file_checked()
        message_notify({ content: `文件操作成功`, type: 'success' })
        tags_get()
        files_get(null);
        return response;
    } catch (error) {
        logger.error('Error setting file tags:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return { code: -1, status: errorMsg, doing: false };
    }
}

export async function files_tag_delete(_req: DatTypes.FilesTagSetReq): Promise<DatTypes.Resp> {
    _req.fileIds = checkedFileIds(appStore.curFiles);
    if (_req.fileIds.length == 0) {
        if (appStore.curSltFile == null) {
            return { code: -1, status: `no file selected`, doing: false };
        }
        else {
            _req.fileIds.push(appStore.curSltFile.id)
        }
    }
    if (_req.fileIds.length == 0) {
        message_notify({ content: `no file selected`, type: "error" })
        return { code: -1, status: `no file selected`, doing: false };
    }

    try {
        const response = await ApiService.filesTagDelete(_req);
        logger.debug('file info:', response);
        if (response.doing) {
            message_notify({ content: `文件操作中`, type: "warning" })
            return response;
        }
        cancle_file_checked()
        message_notify({ content: `文件操作成功`, type: 'success' })
        files_get(null);
        return response;
    } catch (error) {
        logger.error('Error deleting file tags:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return { code: -1, status: errorMsg, doing: false };
    }
}

export async function file_similarity_detect(useAI: boolean = false, minSimilarity: number = 0.9): Promise<DatTypes.Resp> {
    try {
        const response = await ApiService.fileSimilarityDetect(useAI, minSimilarity);
        logger.debug('file info:', response);
        return response;
    } catch (error) {
        logger.error('Error detecting file similarity:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        message_notify({ content: `程序错误:${errorMsg}`, type: "error" })
        return { code: -1, status: errorMsg, doing: false };
    }
}

export async function file_similarity_get(page: number = 1, pageSize: number = 20): Promise<DatTypes.Resp> {
    try {
        const response = await ApiService.fileSimilarityGet(page, pageSize);
        logger.debug('file info:', response);
        return response;
    } catch (error) {
        logger.error('Error getting file similarity:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return { code: -1, status: errorMsg, doing: false };
    }
}

export async function prj_info_get() {
    try {
        const resp = await ApiService.projectGet();
        appStore.prj = resp.data;
        logger.debug('Project info:', appStore.prj);
    } catch (error) {
        logger.error('Error fetching project info:', error);
    }
    await files_get(null)
    await dictionary_get()
    await tags_get()
}

export async function dirCreate(req: DatTypes.DirCreateReq) {
    try {
        const response = await ApiService.dirCreate(req);
        message_notify({ content: `文件夹创建成功`, type: 'success' });
        await files_get(null);
        return response;
    } catch (error) {
        logger.error('Error creating directory:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return { code: -1, status: errorMsg, doing: false };
    }
}

export async function fileOpenWithDefault(fileId: number): Promise<DatTypes.Resp> {
    return await ApiService.fileOpenWithDefault(fileId);
}
