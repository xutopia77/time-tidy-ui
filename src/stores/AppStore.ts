import { defineStore } from 'pinia'

import * as DataTypes from '@/utils/dataTypedef'

export class PrjInfo {
    name: string = '';
    basePath: string = '';
}

export type AppStore = {
    prj: PrjInfo | null, // 当前项目信息
    srvPrefix: string, // 服务器前缀
    curFiles: DataTypes.FileItem[] | null, // 当前展示的文件列表
    curPath: string, // 当前路径
}

export const useAppStore = defineStore('app', {
    state: (): AppStore => ({
        srvPrefix: 'http://127.0.0.1:38080',
        prj: null,
        curFiles: null,
        curPath: '/'
    }),
    actions: {
        setData(key: string, value: string): void {
            console.log(`setData: ${key} = ${value}`)
            // this[key] = value
        }
    }
})

