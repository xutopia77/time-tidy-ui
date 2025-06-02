import { defineStore } from 'pinia'

import * as DataTypes from '@/utils/dataTypedef'

export class PrjInfo {
    name: string = '';
    basePath: string = '';
}

const pageCtrlInit: DataTypes.AppPageCtrl = {
    imageView: { idx: 48, bShow: false },
    set: { idx: 49, bShow: false },
    home: { idx: 50, bShow: true },
    message: { idx: 51, bShow: false },
};

const fileSearchConditionInit: DataTypes.FileSearchCondition = {
    sortBy: '', // '', name, size, time, type
    sortOrder: 'asc', // asc, desc
    pathType: 'curPath', // curPath, allPath
    page: 1,
    pageSize: 10,
    tags: [], // tags
};

export type AppStore = {
    platform: DataTypes.PlatformType,
    cardWidth: number, // 卡片宽度
    cardHeight: number, // 卡片高度
    // 
    prj: PrjInfo | null, // 当前项目信息
    srvPrefix: string, // 服务器前缀

    messageNotify: DataTypes.Message[], // 消息通知
    // 
    setOperateType: string, // 当前操作类型
    pageCtrl: DataTypes.AppPageCtrl,
    pageCtrlInit: DataTypes.AppPageCtrl,
    // 
    curFiles: DataTypes.FileItem[], // 当前展示的文件列表
    curSltFile: DataTypes.FileItem | null, // 当前选中的文件
    curDirs: DataTypes.DirItem[], // 当前展示的文件夹列表
    curSltDir: DataTypes.DirItem | null, // 当前选中的文件夹
    curAllDirs: DataTypes.DirItem[], // 当前工程中所有文件夹列表
    curFileTotal: number, // 当前文件列表的总数
    searchCon: DataTypes.FileSearchCondition, // 文件搜索条件
    curPath: string, // 当前路径
    heartbeat: DataTypes.HeartBeat,
}

export const useAppStore = defineStore('app', {
    state: (): AppStore => ({
        platform: DataTypes.PlatformType.browser,
        cardWidth: 390, // 卡片宽度
        cardHeight: 390, // 卡片高度
        // 
        srvPrefix: 'http://127.0.0.1:38080', // debug，electron
        // srvPrefix: '', // release
        prj: null,
        messageNotify: [], // 消息通知
        // 
        pageCtrl: pageCtrlInit,
        pageCtrlInit: pageCtrlInit,
        setOperateType: '', // 当前操作类型 files_cpy, files_mv
        // 
        curFiles: [],
        curSltFile: null,
        curDirs: [],
        curSltDir: null,
        curAllDirs: [],
        curFileTotal: 0,
        searchCon: fileSearchConditionInit,
        curPath: '/',
        heartbeat: { status: "" }
    }),
    actions: {
        setData(key: string, value: string): void {
            console.log(`setData: ${key} = ${value}`)
            // this[key] = value
        }
    }
})

