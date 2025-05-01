
export class FileItem {
  name: string;
  type: string;
  path : string;
  icon: string;
  size?: number;
  lastModified?: number;
  lastModifiedDate?: Date;
  webkitRelativePath?: string;
  constructor() {
    this.name = "";
    this.type = "";
    this.icon = "";
    this.size = 0;
    this.lastModified = 0;
    this.lastModifiedDate = new Date();
    this.webkitRelativePath = "";
    this.path = "";
  }
}

