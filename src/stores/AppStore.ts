import { defineStore } from 'pinia'

import * as DataTypes from '@/utils/dataTypedef'

const pageCtrlInit: DataTypes.AppPageCtrl = {
    imageView: { idx: 48, bShow: false },
    set: { idx: 49, bShow: false },
    home: { idx: 50, bShow: true },
    message: { idx: 51, bShow: false },
};

// const fileSearchConditionInit: DataTypes.FileSearchCondition = {
//     sortBy: '', // '', name, size, time, type
//     sortOrder: 'asc', // asc, desc
//     pathType: 'curPath', // curPath, allPath
//     page: 1,
//     pageSize: 50,
//     tags: [], // tags
//     noTag: '',
//     bReverseSltTag: false,
// };

export type AppStore = {
    platform: DataTypes.PlatformType,
    envMode: DataTypes.EnvModeType,
    cardWidth: number,                          // 卡片宽度
    cardHeight: number,                         // 卡片高度
    // 
    prj: DataTypes.Prj,                        // 当前项目信息
    srvPrefix: string,                          // 服务器前缀
    logInfo: string,                            // 日志信息

    messageNotify: DataTypes.Message[],         // 消息通知
    // 
    setOperateType: string,                     // 当前操作类型
    pageCtrl: DataTypes.AppPageCtrl,
    pageCtrlInit: DataTypes.AppPageCtrl,
    bPageSearchSetting: boolean,                // 打开界面 搜索设置
    bPageFileTransfer: boolean,                 // 打开界面 文件传输
    bPageSet: boolean,                          // 打开界面 设置
    fileShowType: DataTypes.FileShowType,       // 文件展示目录，目录的类型
    // 
    allTags: DataTypes.TagItem[],               // 所有标签列表
    curFiles: DataTypes.File[],             // 当前展示的文件列表
    curSltFile: DataTypes.File | null,      // 当前 选中 的单个文件
    curDirs: DataTypes.DirItem[],               // 当前展示的文件夹列表
    curAllDirs: DataTypes.DirItem[],            // 当前工程中所有文件夹列表
    DirTrees: DataTypes.DirTreeItem[],          // 当前工程中所有文件夹列表的树状结构
    curSltDirTreeItem: DataTypes.DirTreeItem | null,    // 当前选中的文件夹树
    curFileTotal: number,                       // 当前文件列表的总数
    searchCon: DataTypes.FileSearchCondition,   // 文件搜索条件
    curPath: string,                            // 当前路径

    // icon
    iconProps: DataTypes.IconProps,                          // 图标主题
}

export const useAppStore = defineStore('app', {
    state: (): AppStore => ({
        platform: DataTypes.PlatformType.browser,
        envMode: DataTypes.EnvModeType.pro,
        cardWidth: 220, // 卡片宽度
        cardHeight: 220, // 卡片高度
        // 
        srvPrefix: 'http://127.0.0.1:38080', // debug，electron
        // srvPrefix: '', // release
        logInfo: '', // 日志信息
        prj: new DataTypes.Prj(),
        messageNotify: [], // 消息通知
        // 
        pageCtrl: pageCtrlInit,
        pageCtrlInit: pageCtrlInit,
        bPageSearchSetting: false,
        bPageFileTransfer: false,
        bPageSet: false,
        fileShowType: "",
        setOperateType: '', // 当前操作类型 files_cpy, files_mv
        // 
        allTags: [], // 所有标签列表
        curFiles: [],
        curSltFile: null,
        curDirs: [],
        curAllDirs: [],
        DirTrees: [],
        curSltDirTreeItem: null,
        curFileTotal: 0,
        searchCon: new DataTypes.FileSearchCondition(),
        curPath: '/',
        // 
        iconProps: new DataTypes.IconProps,

    }),
    actions: {
        setData(key: string, value: string): void {
            console.log(`setData: ${key} = ${value}`)
            // this[key] = value
        }
    }
})

