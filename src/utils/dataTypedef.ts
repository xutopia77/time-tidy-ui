
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
    size?: number;
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
    sortBy: string | null = null;
    sortOrder: string | null = null; // asc, desc
}

export class FilesTagSetReq {
    fileIds: number[] = [];
    tagName: string = "";
}

export class ProjectSetReq {
    basePath: string = "";
}

export class HeartBeat {
    status: string = "";
};

export class FilePathChgReq {
    fileIds: number[] = [];
    distPath: string = "";
    type: string = "";//move, copy
    distRootPathId: number = 0;
    srcRootPathId: number = 0;
}

export class FileDeleteReq {
    fileIds: number[] = [];
    bRemoveToDtrash: boolean = true;
}

export interface Resp<T = string> {
    code: number;
    status: string;
    data?: T;
}
