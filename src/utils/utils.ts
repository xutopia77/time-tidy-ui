import type { AppStore } from '@/stores/AppStore'
import { initApiClient } from '@/utils/apiClient';
import { ApiService } from '@/utils/apiService';
let appStore: AppStore
import * as DatTypes from '@/utils/dataTypedef'

const TAG_COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B500',
    '#00CED1'
];

let tagColorIndex = 0;
let isLoadingTags = false;

function get_next_tag_color(): string {
    const color = TAG_COLORS[tagColorIndex % TAG_COLORS.length];
    tagColorIndex++;
    return color;
}

function get_dir_trees() {
    const allDirs = appStore.curAllDirs;
    const dirTree: DatTypes.DirTreeItem[] = [];
    appStore.DirTrees = []
    // 遍历所有目录项
    for (const dir of allDirs) {
        if( dir.dir.type != DatTypes.DirType.Normal ) { 
            console.info(`Unknown dir type: ${dir.dir.type}, skipping dir ${dir.path}`);    
            continue; 
        }
        // 分割路径，过滤掉空字符串
        const pathParts = dir.path.split('/').filter(part => part);
        let currentLevel = dirTree;
        for (const part of pathParts) {
            // 查找当前层级是否已存在该节点
            let foundNode = currentLevel.find(node => node.name === part);

            if (!foundNode) {
                // 若不存在则创建新节点
                foundNode = {
                    expanded: true,
                    name: part,
                    count: 0,
                    dirInfo: dir,
                    children: []
                };
                currentLevel.push(foundNode);
            }
            // 移动到下一层级
            currentLevel = foundNode.children || [];
        }
    }
    appStore.DirTrees = dirTree;
    // console.log("dirTree", appStore.DirTrees)
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
            console.warn(`Unknown file type: ${jRecord.type}, skipping file ${jRecord.name}`);
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
            fileItem.icon = `data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 44H38C39.1046 44 40 43.1046 40 42V14H30V4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 4L40 14" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 31V28C26.2091 28 28 25.9853 28 23.5C28 21.0147 26.2091 19 24 19C21.7909 19 20 21.0147 20 23.5" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 39C25.3807 39 26.5 37.8807 26.5 36.5C26.5 35.1193 25.3807 34 24 34C22.6193 34 21.5 35.1193 21.5 36.5C21.5 37.8807 22.6193 39 24 39Z" fill="%23333"/></svg>`;
        }
        else if (fileItem.type == DatTypes.FileType.other) {
            fileItem.icon = `data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 44H38C39.1046 44 40 43.1046 40 42V14H30V4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 4L40 14" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 31V28C26.2091 28 28 25.9853 28 23.5C28 21.0147 26.2091 19 24 19C21.7909 19 20 21.0147 20 23.5" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 39C25.3807 39 26.5 37.8807 26.5 36.5C26.5 35.1193 25.3807 34 24 34C22.6193 34 21.5 35.1193 21.5 36.5C21.5 37.8807 22.6193 39 24 39Z" fill="%23333"/></svg>`;
        }
        else {
            fileItem.icon = appStore.srvPrefix + "/static_thumb/" + fileItem.id + "_thumbnail.jpg";
        }

        if (jRecord.tags != null) {
            for (const x of jRecord.tags) {
                const tag = new DatTypes.FileItemTag();
                tag.name = x.name
                tag.color = x.color == '' ? tag.color : x.color
                tag.type = x.type == '' ? tag.type : x.type
                tag.description = x.Description == '' ? tag.description : x.Description
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
            console.log(`curpath:[${appStore.curPath}], dirs:${dirs}`);
            if (jRecords != null) {
                for (const jRecord of jRecords) {
                    if (jRecord.Type == 0) {
                        continue; // skip the root path
                    }
                    const itemPath = "/" + jRecord.path;
                    const iteamPaths = itemPath.split('/');
                    const curPaths = appStore.curPath === "/" ? [''] : appStore.curPath.split('/');
                    // console.log(`itemPath:${itemPath},------ iteamPaths:[${iteamPaths}],------ curPaths:[${curPaths}],${iteamPaths.length}, ${curPaths.length}`);
                    if (iteamPaths.length <= curPaths.length) {
                        // console.log(`continue1, iteamPaths.length:${iteamPaths.length}, curPaths.length:${curPaths.length}`);
                        continue;
                    }

                    let bNot = false
                    let i = 0
                    for (i = 0; i < curPaths.length; i++) {
                        if (iteamPaths[i] != curPaths[i]) {
                            // console.log(`continue2, iteamPaths[${i}]:${iteamPaths[i]}, curPaths[${i}]:${curPaths[i]}`);
                            bNot = true
                            break
                        }
                    }
                    if (bNot) {
                        continue
                    }
                    if (iteamPaths.length > curPaths.length + 1) {
                        // console.log(`continue3, iteamPaths.length:${iteamPaths.length}, curPaths.length:${curPaths.length}`);
                        continue;
                    }
                    const curName = iteamPaths[i]
                    const dirItem = new DatTypes.DirItem();
                    dirItem.id = jRecord.id;
                    dirItem.rootPathId = jRecord.rootPathId;
                    // dirItem.name = jRecord.path;
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



async function tags_get() {
    if (isLoadingTags) {
        return;
    }
    isLoadingTags = true;
    
    appStore.allTags = [];
    try {
        const resp = await ApiService.tagsGet();
        console.log('tag info:', resp);
        
        for (const item of resp.data) {
            if (!item.name || item.name == "") {
                continue;
            }
            const tagItem = new DatTypes.TagItem();
            tagItem.name = item.name;
            tagItem.color = item.color == '' ? tagItem.color : item.color;
            tagItem.id = item.id;
            appStore.allTags.push(tagItem);
        }
    } catch (error) {
        console.error('Error fetching tags:', error);
    } finally {
        isLoadingTags = false;
    }
}

async function tags_set(tag: DatTypes.TagItem): Promise<void> {
    const scoreRegex = /^sys_score(10|[1-9])$/;
    if (scoreRegex.test(tag.name)) {
        Utils.message_notify({ content: `系统标签 ${tag.name} 不能被修改`, type: "error" });
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
        console.log('tag info:', resp);
        Utils.tags_get()
        Utils.message_notify({ content: `标签设置成功`, type: 'success' })
    } catch (error) {
        console.error('Error setting tag:', error);
    }
}

async function files_path_chg(_req: DatTypes.FilePathChgReq): Promise<DatTypes.Resp<DatTypes.FilePathChgResp>> {
    _req.distPath = _req.distPath.substring(1);

    try {
        const response = await ApiService.filesPathChg(_req);
        console.log('file info:', response);
        
        switch (response.code) {
            case DatTypes.Code.Success: {
                Utils.files_get(null);
                Utils.message_notify({ content: `${response.data?.successNum}个文件操作成功`, type: 'success' })
                break;
            }
            case DatTypes.Code.NeedSure: {
                Utils.message_notify({ content: `文件操作需要确认`, type: 'success' })
                break;
            }
            case DatTypes.Code.FileAlreadyExist: {
                Utils.files_get(null);
                Utils.message_notify({ content: `${response.data?.successNum}个文件操作成功,${response.data?.failNum}个文件已存在`, type: 'warning' })
                break;
            }
            default: {
                Utils.message_notify({ content: `文件操作失败，已操作成功${response.data?.successNum}个， ${response.status}`, type: "error" })
                break;
            }
        }
        return response;
    } catch (error) {
        console.error('Error fetching project info:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        Utils.message_notify({ content: `文件操作失败\n${errorMsg}`, type: 'error' })
        return { code: -1, status: errorMsg, doing: false };
    }
}

async function files_delete(_req: DatTypes.FileDeleteReq): Promise<DatTypes.Resp> {
    try {
        const response = await ApiService.filesDelete(_req);
        console.log('file delete response:', response);
        Utils.files_get(null);
        Utils.message_notify({ content: `文件删除成功`, type: 'success' });
        return response;
    } catch (error) {
        console.error('Error deleting files:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        Utils.message_notify({ content: `文件删除失败\n${errorMsg}`, type: 'error' });
        return { code: -1, status: errorMsg, doing: false };
    }
}

async function files_restore(fileIds: number[]): Promise<DatTypes.Resp> {
    try {
        const req = new DatTypes.FileRestoreReq();
        req.fileIds = fileIds;
        const response = await ApiService.filesRestore(req);
        console.log('file restore response:', response);
        Utils.message_notify({ content: `文件恢复成功`, type: 'success' });
        return response;
    } catch (error) {
        console.error('Error restoring files:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        Utils.message_notify({ content: `文件恢复失败\n${errorMsg}`, type: 'error' });
        return { code: -1, status: errorMsg, doing: false };
    }
}

async function project_health(): Promise<DatTypes.Resp> {
    Utils.log_info_append("------开始数据健康度检查\n");
    try {
        const req = new DatTypes.FileHealthGetReq();
        req.type = 2;
        const response = await ApiService.projectHealth(req);
        Utils.files_get(null);
        Utils.message_notify({ content: `数据健康度检查成功`, type: 'success' })
        return response;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        Utils.message_notify({ content: `数据健康度检查失败\n${errorMsg}`, type: 'error' })
        return { code: -1, status: errorMsg, doing: false };
    }
}

function page_show(_req: DatTypes.AppPageCtrlReq): DatTypes.Resp {
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

function log_info_append(cont: string) {
    appStore.logInfo += cont
}

async function dictionary_get() {
    try {
        const resp = await ApiService.dictionaryGet();
        console.log('dictionary info:', resp.data);
    } catch (error) {
        console.error('Error fetching dictionary:', error);
    }
}

function gen_size_str(size: number): string {
    if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + "KB";
    }
    else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + "MB";
    }
    else {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
}

function get_thumbnail_url(fileId: number): string {
    return `${appStore.srvPrefix}/static_thumb/${fileId}_thumbnail.jpg`;
}


function dir_slt_update(treeItem: DatTypes.DirTreeItem | string) {
    if (typeof treeItem === 'string') {
        const path = treeItem; // 假设 treeItem 是路径字符串
        appStore.curPath = path;
        // 递归查找函数
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
                console.log(`dir slt update: path:${path} not found`);
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
    Utils.files_get(null)
}

async function tag_delete(_req: DatTypes.TagItem): Promise<DatTypes.Resp> {
    const resp = new DatTypes.Resp()
    const scoreRegex = /^sys_score(10|[1-9])$/;
    if (scoreRegex.test(_req.name)) {
        Utils.message_notify({ content: `系统标签 ${_req.name} 不能被删除`, type: "error" });
        return resp;
    }
    
    try {
        const req = new DatTypes.TagsDeleteReq();
        req.tagName = _req.name;
        const response = await ApiService.tagsDelete(req);
        console.log('tag delete response:', response);
        Utils.message_notify({ content: `删除标签成功`, type: 'success' })
        Utils.tags_get()
        Utils.files_get(null)
    } catch (error) {
        console.error('Error deleting tag:', error);
        Utils.message_notify({ content: `程序错误:${error}`, type: "error" })
    }
    return resp
}


class Utils {
    constructor() { }
    // ------
    static appstore_set(store: AppStore) { 
        appStore = store;
        initApiClient(store);
    }
    static page_show = page_show;
    static log_info_append = log_info_append
    static gen_size_str = gen_size_str;
    static get_thumbnail_url = get_thumbnail_url;
    static dir_slt_update = dir_slt_update;
    // 将标签名称转换为显示名称
    static tagName2Display(name: string): string {
        if (!name) {
            return '';
        }
        const scoreMatch = name.match(/^sys_score(\d{1,2})$/);
        if (scoreMatch) {
            const score = parseInt(scoreMatch[1]);
            if (score >= 1 && score <= 10) {
                return `${score}☆`;
            }
        }
        return name;
    }

    static message_notify(_req: DatTypes.MessageReq) {
        Utils.addToast(_req.content, _req.type)
    }

    static addToast(message: string, type: DatTypes.MessageShowType = 'info') {
        const id = Date.now()
        const timestamp = Date.now()
        const toast = { id, message, type, timestamp }

        // 添加到当前消息和历史消息
        appStore.toasts.push(toast)
        appStore.historyToasts.push(toast)

        // 限制历史消息数量，最多保留100条
        if (appStore.historyToasts.length > 100) {
            appStore.historyToasts.shift()
        }

        // 3秒后自动移除当前显示的消息
        setTimeout(() => {
            // this.removeToast(id)
            const index = appStore.toasts.findIndex(toast => toast.id === id)
            if (index !== -1) {
                appStore.toasts.splice(index, 1)
            }
        }, 3000)
    }
    // 清空所有历史消息
    static clearHistoryToasts() {
        appStore.historyToasts = []
    }

    static files2Catalog(): DatTypes.FileCatalog[] {
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

    // ------
    static async project_set(req: DatTypes.PrjSetReq) {
        Utils.log_info_append("------开始设置项目\n");
        try {
            const resp = await ApiService.projectSet(req);
            
            if (resp.doing) {
                Utils.addToast("设置中", "info")
            }
            else {
                Utils.message_notify({ content: "设置完成", type: "success" })
                if (req.type.length > 0 && req.type[0] == DatTypes.PrjSetType.Open) {
                    await Utils.prj_info_get()
                }
            }
        } catch (error) {
            console.error('Error setting project:', error);
        }
    }
    static convertToLinuxPath(path: string): string {
        return path.replace(/\\/g, '/');
    }
    static dictionary_get = dictionary_get;
	static async files_get(_req: DatTypes.FilesGetReq | null = null, bUpdateStore: boolean = true): Promise<DatTypes.Resp> {
		const req: DatTypes.FilesGetReq = {
			pageSize: appStore.searchCon.pageSize,
			page: appStore.searchCon.page - 1,
			tags: appStore.searchCon.tags,
			noTag: appStore.searchCon.noTag,
			bReverseTag: appStore.searchCon.bReverseSltTag,
			types: appStore.searchCon.types,
			dirs: [appStore.curPath.substring(1)],
			statuss: [],
			origins: [],
			startTime: '',
			endTime: '',
			sortBy: appStore.searchCon.sortBy,
			sortOrder: appStore.searchCon.sortOrder,
			fileId: 0,
			id: 0,
			bFilterModel: false,
			keyword: null,
			minSize: null,
			maxSize: null,
			hasGPS: null,
			minLat: null,
			maxLat: null,
			minLon: null,
			maxLon: null,
			minDuration: null,
			maxDuration: null,
			minWidth: null,
			maxWidth: null,
			minHeight: null,
			maxHeight: null,
			extensions: null,
		}
		if (appStore.searchCon.pathType == "allPath") {
			req.dirs = [];
		}

		if (_req != null) {
			if (_req.pageSize != null) { req.pageSize = _req.pageSize; }
			if (_req.page != null) { req.page = _req.page; }
			if (_req.tags != null) { req.tags = _req.tags; }
			if (_req.noTag != null) { req.noTag = _req.noTag; }
			if (_req.bReverseTag != null) { req.bReverseTag = _req.bReverseTag; }
			if (_req.types != null) { req.types = _req.types; }
			if (_req.dirs != null) { req.dirs = _req.dirs; }
			if (_req.statuss != null) { req.statuss = _req.statuss; }
			if (_req.origins != null) { req.origins = _req.origins; }
			if (_req.startTime != null) { req.startTime = _req.startTime; }
			if (_req.endTime != null) { req.endTime = _req.endTime; }
			if (_req.sortOrder != null) { req.sortOrder = _req.sortOrder; }
			if (_req.sortBy != null) { req.sortBy = _req.sortBy; }

			if (_req.id != null) { req.id = _req.id; }
			if (_req.bFilterModel != null) { req.bFilterModel = _req.bFilterModel; }

			if (_req.keyword != null) { req.keyword = _req.keyword; }
			if (_req.minSize != null) { req.minSize = _req.minSize; }
			if (_req.maxSize != null) { req.maxSize = _req.maxSize; }
			if (_req.hasGPS != null) { req.hasGPS = _req.hasGPS; }
			if (_req.minLat != null) { req.minLat = _req.minLat; }
			if (_req.maxLat != null) { req.maxLat = _req.maxLat; }
			if (_req.minLon != null) { req.minLon = _req.minLon; }
			if (_req.maxLon != null) { req.maxLon = _req.maxLon; }
			if (_req.minDuration != null) { req.minDuration = _req.minDuration; }
			if (_req.maxDuration != null) { req.maxDuration = _req.maxDuration; }
			if (_req.minWidth != null) { req.minWidth = _req.minWidth; }
			if (_req.maxWidth != null) { req.maxWidth = _req.maxWidth; }
			if (_req.minHeight != null) { req.minHeight = _req.minHeight; }
			if (_req.maxHeight != null) { req.maxHeight = _req.maxHeight; }
			if (_req.extensions != null) { req.extensions = _req.extensions; }
		}

		try {
			const response = await ApiService.filesGet(req);
			console.log('file info:', response);
			if (bUpdateStore) {
				const result: DatTypes.Resp = convert_to_file_item(JSON.stringify(response))
				if (result.code === 0) {
					get_dir_trees()
				} else {
					console.error('Error converting file items:', result.status);
				}
				return result;
			} else {
				return response;
			}
		} catch (error) {
			console.error('Error fetching files:', error);
			const errorMsg = error instanceof Error ? error.message : 'Unknown error';
			return { code: -1, status: errorMsg, doing: false };
		}
	}

    static cancle_file_checked() {
        for (const item of appStore.curFiles) {
            item.checked = false;
        }
    }

    static tags_get = tags_get;
    static tags_set = tags_set;
    static async files_tag_set(_req: DatTypes.FilesTagSetReq): Promise<DatTypes.Resp> {
        _req.fileIds = []
        for (const item of appStore.curFiles) {
            if (item.checked)
                _req.fileIds.push(item.id)
        }
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
            console.log('file info:', response);
            if (response.doing) {
                Utils.message_notify({ content: `文件操作中`, type: "warning" })
                return response;
            }
            this.cancle_file_checked()
            Utils.message_notify({ content: `文件操作成功`, type: 'success' })
            Utils.tags_get()
            Utils.files_get(null);
            return response;
        } catch (error) {
            console.error('Error setting file tags:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            return { code: -1, status: errorMsg, doing: false };
        }
    }

    static async files_tag_delete(_req: DatTypes.FilesTagSetReq): Promise<DatTypes.Resp> {
        _req.fileIds = []
        for (const item of appStore.curFiles) {
            if (item.checked)
                _req.fileIds.push(item.id)
        }
        if (_req.fileIds.length == 0) {
            if (appStore.curSltFile == null) {
                return { code: -1, status: `no file selected`, doing: false };
            }
            else {
                _req.fileIds.push(appStore.curSltFile.id)
            }
        }
        if (_req.fileIds.length == 0) {
            Utils.message_notify({ content: `no file selected`, type: "error" })
            return { code: -1, status: `no file selected`, doing: false };
        }

        try {
            const response = await ApiService.filesTagDelete(_req);
            console.log('file info:', response);
            if (response.doing) {
                Utils.message_notify({ content: `文件操作中`, type: "warning" })
                return response;
            }
            this.cancle_file_checked()
            Utils.message_notify({ content: `文件操作成功`, type: 'success' })
            Utils.files_get(null);
            return response;
        } catch (error) {
            console.error('Error deleting file tags:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            return { code: -1, status: errorMsg, doing: false };
        }
    }

    static tag_delete = tag_delete;
    static files_path_chg = files_path_chg;
    static files_delete = files_delete;
    static files_restore = files_restore;
    static project_health = project_health;

    static async file_similarity_detect(): Promise<DatTypes.Resp> {
        try {
            const response = await ApiService.fileSimilarityDetect();
            console.log('file info:', response);
            return response;
        } catch (error) {
            console.error('Error detecting file similarity:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            Utils.message_notify({ content: `程序错误:${errorMsg}`, type: "error" })
            return { code: -1, status: errorMsg, doing: false };
        }
    }

    static async file_similarity_get(page: number = 1, pageSize: number = 20): Promise<DatTypes.Resp> {
        try {
            const response = await ApiService.fileSimilarityGet(page, pageSize);
            console.log('file info:', response);
            return response;
        } catch (error) {
            console.error('Error getting file similarity:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            return { code: -1, status: errorMsg, doing: false };
        }
    }

    static async prj_info_get() {
        try {
            const resp = await ApiService.projectGet();
            appStore.prj = resp.data;
            console.log('Project info:', appStore.prj);
        } catch (error) {
            console.error('Error fetching project info:', error);
        }
        await Utils.files_get(null)
        await dictionary_get()
        await tags_get()
    }

    static async dirCreate(req: DatTypes.DirCreateReq) {
        try {
            const response = await ApiService.dirCreate(req);
            Utils.message_notify({ content: `文件夹创建成功`, type: 'success' });
            await Utils.files_get(null);
            return response;
        } catch (error) {
            console.error('Error creating directory:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            return { code: -1, status: errorMsg, doing: false };
        }
    }
    static async fileOpenWithDefault(fileId: number): Promise<DatTypes.Resp> {
        return await ApiService.fileOpenWithDefault(fileId);
    }
}

export default Utils;