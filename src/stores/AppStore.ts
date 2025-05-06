import { defineStore } from 'pinia'

import * as DataTypes from '@/utils/dataTypedef'

export class PrjInfo {
    name: string = '';
    basePath: string = '';
}

export type AppStore = {
    prj: PrjInfo | null, // 当前项目信息
    srvPrefix: string, // 服务器前缀
    bShowSetting: boolean, // 是否显示设置窗口
    bShowImageView: boolean, // 是否显示图片预览窗口
    messageNotify: DataTypes.Message[], // 消息通知
    // 
    setOperateType: string, // 当前操作类型
    // 
    curFiles: DataTypes.FileItem[], // 当前展示的文件列表
    curSltFile: DataTypes.FileItem | null, // 当前选中的文件
    curDirs: DataTypes.DirItem[], // 当前展示的文件夹列表
    curSltDir: DataTypes.DirItem | null, // 当前选中的文件夹
    curAllDirs: DataTypes.DirItem[], // 当前工程中所有文件夹列表
    curFileTotal: number, // 当前文件列表的总数
    curPage: number, // 当前页码
    pageSize: number, // 每页显示的文件数
    curPath: string, // 当前路径
}

export const useAppStore = defineStore('app', {
    state: (): AppStore => ({
        srvPrefix: 'http://127.0.0.1:38080',
        bShowSetting: false,
        bShowImageView: false,
        prj: null,
        messageNotify: [], // 消息通知
        // 
        setOperateType: '', // 当前操作类型 files_cpy, files_mv
        // 
        curFiles: [],
        curSltFile: null,
        curDirs: [],
        curSltDir: null,
        curAllDirs: [],
        curFileTotal: 0,
        curPage: 1,
        pageSize: 10,
        curPath: '/'
    }),
    actions: {
        setData(key: string, value: string): void {
            console.log(`setData: ${key} = ${value}`)
            // this[key] = value
        }
    }
})

