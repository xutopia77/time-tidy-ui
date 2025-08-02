
// 不可修改，和后端约定好的
export enum Code {
    Success = 0,       // 0
    Err,                     // 1
    SysBusy,                    // 2
    ReqErr,                   // 3
    DbErr,                  // 4
    NeedSure,                     // 5
    FileAlreadyExist,                 // 6
}


// ----------------------

export enum PlatformType {
    browser = "browser",
    electron = "electron",
}

export enum EnvModeType {
    dev = 'development',
    pro = 'production'
};


export enum FileType {
    image = "image",
    video = "video",
    audio = "audio",
    document = "document",
    folder = "folder",
}

// 字符串转 FileType 枚举
export function stringToFileType(str: string): FileType | null {
    for (const key in FileType) {
        if (FileType[key as keyof typeof FileType] === str) {
            return FileType[key as keyof typeof FileType];
        }
    }
    return null;
}
// FileType 枚举转字符串
export function fileTypeToString(fileType: FileType): string {
    return fileType;
}

export class FolderItemInfo {
    name: string = '';
    count: number = 0;
    children?: FolderItemInfo[];
}

export class DirTreeItem {
    expanded: boolean = true;
    name: string = '';
    count: number = 0;
    dirInfo: DirItem = new DirItem();
    children?: DirTreeItem[];
}

export class DirInfo {
    count: number = 0;      // 文件数量
    size: number = 0;       // 文件大小（字节）
    dirCount: number = 0;   // 文件夹数量
}

export class FilePathChgRespItemInfo {
    id: number = 0;
    srcPath: string = "";
    destPath: string = "";
    status: string = "";
    code: Code = 0;
}

export class FilePathChgResp {
    dirInfos: DirInfo[] = [];
    bNeedSure: boolean = false;
    items: FilePathChgRespItemInfo[] = [];
    remainFileIds: number[] = [];
}

export class TagItem {
    name = "";
    color = "#e6475e";
    id = 0;
}

export class FileItemTag {
    name: string = "";
    color: string = "#e6475e";
}

export class FileItem {
    id: number = 0;
    rootPathId: number = 0;
    name: string = "";
    type: FileType = FileType.image;
    path: string = "";
    fullpath = "";
    icon: string = "";
    tags: FileItemTag[] = [];
    size: number = 0;
    time?: string = "";
    checked: boolean = false;
}

export class DirItem {
    id: number = 0;
    rootPathId: number = 0;
    name: string = "";
    type: FileType = FileType.folder;
    path: string = "";
    icon: string = "";
    size?: number;
    tags: string[] = [];
    checked: boolean = false;
}

export class AppPageCtrlItem {
    idx: number = 50;
    bShow: boolean = false
}

export class AppPageCtrl {
    message: AppPageCtrlItem = { idx: 1, bShow: true }
    imageView: AppPageCtrlItem = { idx: 1, bShow: false }
    set: AppPageCtrlItem = { idx: 1, bShow: false }
    home: AppPageCtrlItem = { idx: 1, bShow: true }
};

export class AppPageCtrlReq {
    page: string = "";
    bShow: boolean = false
}

export class FileSearchCondition {
    sortBy: string = "";// name, size, time, type
    sortOrder: string = "";// asc, desc
    pathType: string = "";// curPath, allPath
    page: number = 0;
    pageSize: number = 10;
    tags: string[] = [];// tags
    noTag: 'true' | 'false' | '' = '';
    bReverseSltTag: boolean = false; // 反向选择标签
}

// ============================================================== communicate with back server
export class MessageReq {
    content: string = "";
    duration?: number = 0;
    type?: string = "";//success, error, info, warning
}

export class Message {
    content: string = "";
    durationMs: number = 0;
    type: string = "";//success, error, info, warning
    startTime: number = 0;
}


export class FilesGetReq {
    id: number | null = null;
    bFilterModel: boolean | null = null;
    pageSize: number | null = 10;
    page: number | null = 0;
    origins: string[] | null = [];
    dirs: string[] | null = [];
    tags: string[] | null = [];
    noTag: 'true' | 'false' | '' = '';
    bReverseTag: boolean = false; // 反向选择标签
    sortBy: string | null = null;
    sortOrder: string | null = null; // asc, desc
}

export class FilesTagSetReq {
    fileIds: number[] = [];
    tagName: string = "";
}


export enum PrjSetType {
    Create = 1,
    Open = 2,
    Save = 3,
    Sync = 4,
    GenThumb = 5,
    ScanExif = 6,
    GenHash = 7
}

export class Repo {
    path = ''
}


export class Prj {
    name: string = '';
    path: string = '';
    thumbPath: string = '';
    dbPath: string = '';
    repo: Repo[] = []
}

export class PrjSetReq {
    prj: Prj = new Prj();
    type: PrjSetType[] = [];
}

export class PrjSetResp {
    prj: Prj = new Prj();
}

export class TaskInfo<T = string> {
    resp?: T
    doing: boolean = false;
}

export class SystemStatus {
    busy: boolean = false;
    status: string = '';
    logInfo: string = '';
    curCmd: string = ''; // get in heartbeat, and set '' when get finish
    curTask: TaskInfo = new TaskInfo();
}

export class HeartBeatResp {
    sysStatus: SystemStatus = new SystemStatus();
}

export class FilePathChgReq {
    fileIds: number[] = [];
    dirIds: number[] = [];
    distPath: string = "";
    type: string = "";//move, copy
    distRootPathId: number = 0;
    srcRootPathId: number = 0;
    bNeedSure: boolean = true; // 如果请求中没有目录，这个参数不起作用
    bAllFileCover: boolean = false;
    fileIdsCover: number[] = [];
}

export class FileDeleteReq {
    fileIds: number[] = [];
    dirIds: number[] = [];
    bRemoveToDtrash: boolean = true;
}

export class Resp<T = string> {
    code: number = 0;
    status: string = '';
    doing: boolean = false;
    data?: T;
}
