import axios from 'axios';
import type { AppStore } from '@/stores/AppStore'
let appStore: AppStore

import * as DatTypes from '@/utils/dataTypedef'

function get_dir_trees() {
    const allDirs = appStore.curAllDirs;
    const dirTree: DatTypes.DirTreeItem[] = [];
    appStore.DirTrees = []
    // 遍历所有目录项
    for (const dir of allDirs) {
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
    console.log("dirTree", appStore.DirTrees)
}


function convert_to_file_item(_srcStr: string): DatTypes.Resp {
    const resp: DatTypes.Resp = {
        code: 0,
        status: ""
    }

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

    const jData = JSON.parse(_srcStr);
    if (jData.code != 0) {
        resp.code = jData.code;
        resp.status = jData.msg;
        return resp;
    }
    if (jData.data.files != null) {
        const files: DatTypes.FileItem[] = []
        const jRecords = jData.data.files.records;
        if (jRecords != null) {
            for (const jRecord of jRecords) {
                const fileType = DatTypes.stringToFileType(jRecord.Type);
                if (fileType == null) {
                    console.warn(`Unknown file type: ${jRecord.Type}, skipping file ${jRecord.FileName}`);
                    continue;
                }
                const fileItem = new DatTypes.FileItem();
                fileItem.id = jRecord.ID;
                fileItem.rootPathId = jRecord.RootPathID;
                fileItem.name = jRecord.FileName;
                fileItem.path = jRecord.Path;
                fileItem.fullpath = jRecord.fullPath;
                fileItem.size = jRecord.Size;
                fileItem.time = jRecord.CreateTime
                fileItem.type = fileType;
                fileItem.icon = appStore.srvPrefix + "/static_thumb/" + fileItem.id + "_thumbnail.jpg";
                if (jRecord.Tags != null) {
                    for (const x of jRecord.Tags) {
                        const tag = new DatTypes.FileItemTag();
                        tag.name = x.name
                        tag.color = x.color == '' ? tag.color : x.color
                        if (tag.name == '') {
                            continue;
                        }
                        fileItem.tags.push(tag)
                    }


                }
                files.push(fileItem);
            }
            appStore.curFileTotal = jData.data.files.total;
            appStore.curFiles = files;
            update_after_get_files()
        }
        else {
            appStore.curFileTotal = 0;
            appStore.curFiles = [];
            update_after_get_files()
        }
    }
    else {
        appStore.curFileTotal = 0;
        appStore.curFiles = [];
        update_after_get_files()
    }
    if (jData.data.dirs != null) {
        {
            const dirs: DatTypes.DirItem[] = []
            const jRecords = jData.data.dirs.records;
            for (const jRecord of jRecords) {
                if (jRecord.Type == 0) {
                    continue; // skip the root path
                }
                const itemPath = "/" + jRecord.Path;
                const dirItem = new DatTypes.DirItem();
                dirItem.id = jRecord.ID;
                dirItem.rootPathId = jRecord.RootPathId;
                dirItem.name = jRecord.Path;
                dirItem.icon = '/assets/images/folders.svg'
                dirItem.type = DatTypes.FileType.folder;

                dirItem.path = itemPath;
                if (jRecord.Tags != null) {
                    dirItem.tags = jRecord.Tags
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
                const itemPath = "/" + jRecord.Path;
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
                dirItem.id = jRecord.ID;
                dirItem.rootPathId = jRecord.RootPathId;
                // dirItem.name = jRecord.Path;
                dirItem.name = curName
                dirItem.icon = '/assets/images/folders.svg'
                dirItem.type = DatTypes.FileType.folder;
                dirItem.path = itemPath;
                if (jRecord.Tags != null) {
                    dirItem.tags = jRecord.Tags
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

async function files_get(_req: DatTypes.FilesGetReq | null) {

    const req: DatTypes.FilesGetReq = {
        id: 0,
        bFilterModel: false,
        pageSize: appStore.searchCon.pageSize,
        page: appStore.searchCon.page - 1,
        dirs: [appStore.curPath.substring(1)],
        origins: [],
        sortOrder: appStore.searchCon.sortOrder,
        sortBy: appStore.searchCon.sortBy,
        tags: appStore.searchCon.tags,
    }
    if (appStore.searchCon.pathType == "allPath") {
        req.dirs = [];
    }

    if (_req != null) {
        if (_req.id != null) { req.id = _req.id; }
        if (_req.bFilterModel != null) { req.bFilterModel = _req.bFilterModel; }
        if (_req.pageSize != null) { req.pageSize = _req.pageSize; }
        if (_req.page != null) { req.page = _req.page; }
        if (_req.dirs != null) { req.dirs = _req.dirs; }
        if (_req.origins != null) { req.origins = _req.origins; }
        if (_req.sortOrder != null) { req.sortOrder = _req.sortOrder; }
        if (_req.sortBy != null) { req.sortBy = _req.sortBy; }
        if (_req.tags != null) { req.tags = _req.tags; }
    }

    await axios.post(`${appStore.srvPrefix}/api/v1/files_get`, JSON.stringify(req))
        .then((response) => {
            console.log('file info:', response.data);
            const resp: DatTypes.Resp = convert_to_file_item(JSON.stringify(response.data))
            if (resp.code === 0) {
                get_dir_trees()
            } else {
                console.error('Error converting file items:', resp.status);
            }
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
}

function tags_get() {
    appStore.allTags = [];
    axios.post(`${appStore.srvPrefix}/api/v1/tags_get`)
        .then((response) => {
            console.log('tag info:', response.data);
            const resp = response.data;
            if (resp.code != 0) {
                Utils.message_notify({ content: `获取标签失败:${resp.status}` })
                return;
            }
            // const tagsColors = ["#6577bf", "#e8cb95", "#e4775e", "#c9cde7", "#34ce72", "#d3adf7", "#4ac0f2"]
            // const idx = 0;
            for (const item of resp.data) {
                if (item.TagName == "") {
                    continue;
                }
                const tagItem = new DatTypes.TagItem();
                tagItem.name = item.TagName;

                tagItem.color = item.Color == '' ? tagItem.color : item.Color;


                tagItem.id = item.ID;
                appStore.allTags.push(tagItem);
            }
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
}

function tags_set(tag: DatTypes.TagItem) {
    appStore.allTags = [];
    axios.post(`${appStore.srvPrefix}/api/v1/tags_set`, JSON.stringify(tag))
        .then((response) => {
            console.log('tag info:', response.data);
            const resp = response.data;
            if (resp.code != 0) {
                Utils.message_notify({ content: `获取标签失败:${resp.status}` })
                return;
            }
            Utils.tags_get()
            Utils.message_notify({ content: `标签设置成功` })
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
}


function files_tag_set(_req: DatTypes.FilesTagSetReq): DatTypes.Resp {
    const resp: DatTypes.Resp = {
        code: 0,
        status: "",
    }
    axios.post(`${appStore.srvPrefix}/api/v1/files_tag_set`, JSON.stringify(_req))
        .then((response) => {
            console.log('file info:', response.data);
            resp.code = response.data.code;
            resp.status = response.data.status;
            Utils.files_get(null);
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
            resp.code = -1;
            resp.status = error.message;
        }
        );
    return resp;
}

function files_tag_delete(_req: DatTypes.FilesTagSetReq): DatTypes.Resp {
    const resp: DatTypes.Resp = {
        code: 0,
        status: "",
    }
    axios.post(`${appStore.srvPrefix}/api/v1/files_tag_delete`, JSON.stringify(_req))
        .then((response) => {
            console.log('file info:', response.data);
            resp.code = response.data.code;
            resp.status = response.data.status;
            Utils.files_get(null);
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
            resp.code = -1;
            resp.status = error.message;
        }
        );
    return resp;
}

async function files_path_chg(_req: DatTypes.FilePathChgReq): Promise<DatTypes.Resp<DatTypes.FilePathChgResp>> {
    const resp: DatTypes.Resp<DatTypes.FilePathChgResp> = {
        code: 0,
        status: "",
        data: new DatTypes.FilePathChgResp(),
    }
    if (resp.data == null || resp.data == undefined) {
        resp.code = 1;
        return resp;
    }
    _req.distPath = _req.distPath.substring(1);

    await axios.post(`${appStore.srvPrefix}/api/v1/files_path_chg`, JSON.stringify(_req))
        .then((response) => {
            if (resp.data == null || resp.data == undefined) {
                console.log('resp.data is null or undefined');
                resp.code = 1;
                return resp;
            }
            console.log('file info:', response.data);
            resp.code = response.data.code;
            resp.status = response.data.status;
            const respDat = response.data.data
            if (respDat != null) {
                resp.data.bNeedSure = respDat.bNeedSure != null ? respDat.bNeedSure : false;
                if (respDat.dirInfos != null) {
                    for (const item of respDat.dirInfos) {
                        const dirInfo = new DatTypes.DirInfo();
                        dirInfo.count = item.count;
                        dirInfo.size = item.size;
                        dirInfo.dirCount = item.dirCount;
                        resp.data?.dirInfos.push(dirInfo);
                    }
                }

            }
            if (resp.data.bNeedSure) {
                return resp;
            }
            Utils.files_get(null);
            Utils.message_notify({ content: `文件操作成功` })
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
            resp.code = -1;
            resp.status = error.message;
            Utils.message_notify({ content: `文件操作失败\n${error.message}` })
        })
    return resp;
}

function files_delete(_req: DatTypes.FileDeleteReq): DatTypes.Resp {
    const resp: DatTypes.Resp = {
        code: 0,
        status: "",
    }

    axios.post(`${appStore.srvPrefix}/api/v1/files_delete`, JSON.stringify(_req))
        .then((response) => {
            console.log('file info:', response.data);
            resp.code = response.data.code;
            resp.status = response.data.status;
            Utils.files_get(null);
            Utils.message_notify({ content: `文件操作成功` })
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
            resp.code = -1;
            resp.status = error.message;
            Utils.message_notify({ content: `文件操作失败\n${error.message}` })
        })
    return resp;
}

function project_health(): DatTypes.Resp {
    const resp: DatTypes.Resp = {
        code: 0,
        status: "",
    }
    Utils.log_info_append("------开始数据健康度检查\n");
    axios.post(`${appStore.srvPrefix}/api/v1/project_health`, JSON.stringify({ type: 2 }))
        .then((response) => {
            resp.code = response.data.code;
            resp.status = response.data.status;
            Utils.files_get(null);
            Utils.message_notify({ content: `数据健康度检查成功` })
        })
        .catch((error) => {
            resp.code = -1;
            resp.status = error.message;
            Utils.message_notify({ content: `数据健康度检查失败\n${error.message}` })
        })
    return resp;
}


function message_notify(_req: DatTypes.MessageReq): DatTypes.Resp {
    const resp: DatTypes.Resp = {
        code: 0,
        status: "",
    }
    const msg: DatTypes.Message = new DatTypes.Message();
    msg.content = _req.content;
    msg.durationMs = _req.duration ? _req.duration : 2000;
    msg.type = _req.type ? _req.type : "info";
    msg.startTime = Date.now();
    appStore.messageNotify.push(msg);
    //删除超过duration的消息
    const now = Date.now();
    for (let i = 0; i < appStore.messageNotify.length; i++) {
        if (now - appStore.messageNotify[i].startTime > appStore.messageNotify[i].durationMs * 1000) {
            appStore.messageNotify.splice(i, 1);
            i--;
        }
    }
    return resp;
}

function page_show(_req: DatTypes.AppPageCtrlReq): DatTypes.Resp {
    const resp: DatTypes.Resp = {
        code: 0,
        status: "",
    }
    const validPages = ['home', 'set', 'imageView', 'message'];

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

async function prj_info_get() {
    await axios.post(`${appStore.srvPrefix}/api/v1/project`)
        .then((response) => {
            const resp = response.data
            if (resp.code != 0) {
                console.log("project info get err ", resp.status)
            }
            else {
                appStore.prj = resp.data;
                console.log('Project info:', appStore.prj);

            }
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
    await Utils.files_get(null)
    await dictionary_get()
    await tags_get()
}

function heartbeat() {
    axios.post(`${appStore.srvPrefix}/api/v1/heartbeat`)
        .then((response) => {
            const resp = response.data
            if (resp.code != 0) {
                console.log("heartbeat err ", resp.status)
            }
            else {
                appStore.heartbeat.status = resp.data.status;
                appStore.logInfo += resp.data.logInfo;
                // console.log('heart beat:', appStore.heartbeat);
            }
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
}

function log_info_append(cont: string) {
    appStore.logInfo += cont
}

async function dictionary_get() {
    await axios.post(`${appStore.srvPrefix}/api/v1/dictionary_get`)
        .then((response) => {
            const resp = response.data
            if (resp.code != 0) {
                console.log("dictionary get err ", resp.status)
            }
            else {
                // appStore.prj = resp.data;
                // console.log('Project info:', appStore.prj);
                console.log('dictionary info:', resp.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
}


function project_set(req: DatTypes.ProjectSetReq) {
    Utils.log_info_append("------开始设置项目\n");
    axios.post(`${appStore.srvPrefix}/api/v1/project_set`, JSON.stringify(req))
        .then((response) => {
            console.log('file info:', response.data);
            const resp = response.data
            if (resp.code != 0) {
                Utils.message_notify({ content: resp.status, type: "error" })
            }
            else {
                if (resp.doing == true) {
                    Utils.message_notify({ content: "设置中", type: "warning" })
                }
                else {
                    Utils.message_notify({ content: "设置完成", type: "success" })
                }
            }
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
            Utils.message_notify({ content: `程序发生错误:${error}`, type: "error" })
        });
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

class Utils {
    constructor() { }
    static project_set = project_set
    static dictionary_get = dictionary_get;
    static files_get = files_get;
    static tags_get = tags_get;
    static tags_set = tags_set;
    static files_tag_set = files_tag_set;
    static files_tag_delete = files_tag_delete;
    static files_path_chg = files_path_chg;
    static files_delete = files_delete;
    static project_health = project_health;
    static page_show = page_show;
    static message_notify = message_notify;
    static log_info_append = log_info_append
    static prj_info_get = prj_info_get;
    static heartbeat = heartbeat;
    static gen_size_str = gen_size_str;
    static folder_get(folder: string) {
        const reqDat = {
            folder: folder
        }
        axios.post(`${appStore.srvPrefix}/api/v1/folder`, JSON.stringify(reqDat))
            .then((response) => {
                appStore.curFiles = response.data;
                console.log('file info:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching project info:', error);
            });
    }
    static appstore_set(store: AppStore) {
        appStore = store;
    }
}

export default Utils;