
export class FileItem {
    id: number = 0;
    rootPathId: number = 0;
    name: string = "";
    type: string = "file";
    path: string = "";
    icon: string = "";
    tags: string[] = [];
    size?: number;
    checked: boolean = false;
}

export class DirItem {
    id: number = 0;
    rootPathId: number = 0;
    name: string = "";
    type: string = "folder";
    path: string = "";
    icon: string = "";
    size?: number;
    tags: string[] = [];
    checked: boolean = false;
}


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
}

export class FilesTagSetReq {
    fileIds: number[] = [];
    tagName: string = "";
}

export class ProjectSetReq {
    basePath: string = "";
}

export class FilePathChgReq {
    fileIds: number[] = [];
    distPath: string = "";
    type: string = "";//move, copy
    distRootPathId: number = 0;
    srcRootPathId: number = 0;
}

export interface Resp<T = string> {
    code: number;
    status: string;
    data?: T;
}
