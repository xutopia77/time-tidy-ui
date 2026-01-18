
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
    other = "other",
}

export type FileShowType = "fileSimilarity" | "time" | "";
export type MessageShowType = "success" | "error" | "warning" | "info";

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

export class Dir {
    id: number = 0;
    path: string = "";
    name: string = "";
    rootPathId: number = 0;
    type: number = 0;
    alias: string = "";
    infoHash: string = "";
    status: number = 0;
    description: string = "";
    createdAt: string = "";
    updatedAt: string = "";
}


export class DirCreateReq {
    path: string = "";
    type: number = 0;
    description: string = "";
    parentDirId: number = 0;
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
    successNum: number = 0;
    failNum: number = 0;
}

export class TagItem {
    name = "";
    color = "#4A6FA5";
    id = 0;
    description: string = "";
}

export class FileItemTag {
    id: number = 0;
    name: string = "";
    color: string = "#4A6FA5";
    type: string = "";
    description: string = "";
    createdAt: string = "";
    updatedAt: string = "";
}

export class File {
    id: number = 0;
    rootPathId: number = 0;
    name: string = "";
    type: FileType = FileType.image;
    path: string = "";
    fullpath = "";
    icon: string = "";
    tags: FileItemTag[] = [];
    size: number = 0;
    time: string = "";
    checked: boolean = false;
    uniqueHash: string = "";
}

export class FileCatalog {
    name: string = "";
    files: File[] = [];
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
    dir: Dir = new Dir();
}

export class AppPageCtrlItem {
    idx: number = 50;
    bShow: boolean = false
}

export class AppPageCtrl {
    set: AppPageCtrlItem = { idx: 1, bShow: false }
    home: AppPageCtrlItem = { idx: 1, bShow: true }
};

export class AppPageCtrlReq {
    page: string = "";
    bShow: boolean = false
}

export class FileSearchCondition {
    sortBy: string = "time";// name, size, time, type
    sortOrder: string = "asc";// asc, desc
    pathType: string = "curPath";// curPath, allPath
    page: number = 1;
    pageSize: number = 50;
    tags: string[] = [];// tags
    noTag: 'true' | 'false' | '' = '';
    bReverseSltTag: boolean = false; // 反向选择标签
    types: FileType[] = [];
}

// ============================================================== communicate with back server
export class MessageReq {
    content: string = "";
    duration?: number = 0;
    type: MessageShowType = "success";//success, error, info, warning
}


export class FilesGetReq {
    pageSize: number | null = 10;
    page: number | null = 0;
    tags: string[] | null = [];
    noTag: 'true' | 'false' | '' = '';
    bReverseTag: boolean = false; // 反向选择标签
    types: FileType[] | null = null;
    dirs: string[] | null = [];
    statuss: number[] | null = null;
    origins: string[] | null = [];
    startTime: string | null = null;
    endTime: string | null = null;
    sortBy: string | null = null;
    sortOrder: string | null = null; // asc, desc
    fileId: number | null = null;

    id: number | null = null;
    bFilterModel: boolean | null = null;
}

export class FilesTagSetReq {
    fileIds: number[] = [];
    tagName: string = "";
}


export enum PrjSetType {
    Create = "create",
    Open = "open",
    Save = "save",
    Sync = "sync",
    GenThumbNone = "genThumbNone",
    GenThumbFull = "genThumbFull",
    GenThumbIncre = "genThumbIncre", // incremental
    ScanExifNone = "scanExifNone",
    ScanExifFull = "scanExifFull",
    ScanExifIncre = "scanExifIncre", // incremental
    GenHashNone = "genHashNone",
    GenHashFull = "genHashFull",
    GenHashIncre = "genHashIncre", // incremental
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
    bNeedGetFiles = false;
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

export class IconProps {
    size: number = 24;                           // 图标大小
    color: string = "#333";                         // 图标颜色 
    strokeWidth: number = 2;                    // 图标描边宽度
    theme: 'outline' | 'filled' | 'two-tone' | 'multi-color' | undefined = 'outline';                          // 图标主题, 
}
