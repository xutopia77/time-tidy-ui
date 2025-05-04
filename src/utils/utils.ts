

import axios from 'axios';
import type { AppStore } from '@/stores/AppStore'
let appStore: AppStore

import * as DatTypes from '@/utils/dataTypedef'

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
                const fileItem = new DatTypes.FileItem();
                fileItem.id = jRecord.ID;
                fileItem.rootPathId = jRecord.RootPathID;
                fileItem.name = jRecord.FileName;
                fileItem.path = jRecord.Path;
                fileItem.type = 'file';
                fileItem.icon = appStore.srvPrefix + "/static_thumb/" + fileItem.id + "_thumbnail.jpg";
                if (jRecord.Tags != null) {
                    fileItem.tags = jRecord.Tags
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
        const dirs: DatTypes.DirItem[] = []
        const jRecords = jData.data.dirs.records;
        console.log("cur path:", appStore.curPath);
        if (jRecords != null) {
            for (const jRecord of jRecords) {
                if (jRecord.Type == 0) {
                    continue; // skip the root path
                }
                const itemPath = "/" + jRecord.Path;
                const subPath = itemPath.substring(appStore.curPath.length);
                if (subPath.includes('/')) {
                    continue;
                }
                if (!itemPath.startsWith(appStore.curPath) || itemPath == appStore.curPath) {
                    continue;
                }
                const dirItem = new DatTypes.DirItem();
                dirItem.id = jRecord.ID;
                dirItem.rootPathId = jRecord.RootPathID;
                dirItem.name = jRecord.Path;
                dirItem.icon = 'src/assets/icons/folders.svg'
                dirItem.type = 'folder';
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

function files_get(_req: DatTypes.FilesGetReq | null) {

    const req: DatTypes.FilesGetReq = {
        id: 0,
        bFilterModel: false,
        pageSize: appStore.pageSize,
        page: appStore.curPage - 1,
        dirs: [appStore.curPath.substring(1)],
        origins: [],
    }

    if (_req != null) {
        if (_req.id != null) {
            req.id = _req.id;
        }
        if (_req.bFilterModel != null) {
            req.bFilterModel = _req.bFilterModel;
        }
        if (_req.pageSize != null) {
            req.pageSize = _req.pageSize;
        }
        if (_req.page != null) {
            req.page = _req.page;
        }
        if (_req.dirs != null) {
            req.dirs = _req.dirs;
        }
        if (_req.origins != null) {
            req.origins = _req.origins;
        }
    }

    axios.post(`${appStore.srvPrefix}/api/v1/files_get`, JSON.stringify(req))
        .then((response) => {
            // appStore.curFiles = response.data;
            console.log('file info:', response.data);
            const resp: DatTypes.Resp = Utils.convert_to_file_item(JSON.stringify(response.data))
            if (resp.code === 0) {
            } else {
                console.error('Error converting file items:', resp.status);
            }
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

class Utils {
    constructor() { }
    static convert_to_file_item = convert_to_file_item;
    static files_get = files_get;
    static files_tag_set = files_tag_set;
    static files_tag_delete = files_tag_delete;
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