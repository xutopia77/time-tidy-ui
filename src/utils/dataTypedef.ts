
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


export interface Resp<T = string> {
    code: number;
    status: string;
    data?: T;
}
