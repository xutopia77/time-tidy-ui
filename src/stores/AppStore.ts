import { defineStore } from 'pinia'

import * as DataTypes from '@/utils/dataTypedef'

const pageCtrlInit: DataTypes.AppPageCtrl = {
    set: { idx: 49, bShow: false },
    home: { idx: 50, bShow: true },
};

// 定义消息类型
export interface ToastMessage {
    id: number
    message: string
    type: DataTypes.MessageShowType
    timestamp: number // 添加时间戳
}


export type AppStore = {
    platform: DataTypes.PlatformType,
    envMode: DataTypes.EnvModeType,
    cardWidth: number,                          // 卡片宽度
    cardHeight: number,                         // 卡片高度
    cardViewMode: DataTypes.CardViewMode,       // 卡片视图模式
    // 
    prj: DataTypes.Prj,                        // 当前项目信息
    srvPrefix: string,                          // 服务器前缀
    logInfo: string,                            // 日志信息

    // 当前显示的消息数组（用于自动消失的消息）
    toasts: ToastMessage[],
    historyToasts: ToastMessage[],
    // 
    pageCtrl: DataTypes.AppPageCtrl,
    pageCtrlInit: DataTypes.AppPageCtrl,
    bPageSearchSetting: boolean,                // 打开界面 搜索设置
    bPageFileTransfer: boolean,                 // 打开界面 文件传输
    bPageSet: boolean,                          // 打开界面 设置
    bPageResentMsg: boolean,                    // 打开界面 最近消息
    bPageImgView: boolean,                      // 打开界面 图片预览
    fileShowType: DataTypes.FileShowType,       // 文件展示目录，目录的类型
    fileSililarity: DataTypes.FileCatalog[],    // 文件相似目录
    // 
    allTags: DataTypes.TagItem[],               // 所有标签列表
    curFiles: DataTypes.File[],             // 当前展示的文件列表
    curSltFile: DataTypes.File | null,      // 当前 选中 的单个文件
    hoverFile: DataTypes.File | null,       // 当前悬停的文件（用于侧边栏预览）
    curDirs: DataTypes.DirItem[],               // 当前展示的文件夹列表
    curAllDirs: DataTypes.DirItem[],            // 当前工程中所有文件夹列表
    DirTrees: DataTypes.DirTreeItem[],          // 当前工程中所有文件夹列表的树状结构
    curSltDirTreeItem: DataTypes.DirTreeItem | null,    // 当前选中的文件夹树
    curFileTotal: number,                       // 当前文件列表的总数
    searchCon: DataTypes.FileSearchCondition,   // 文件搜索条件
    curPath: string,                            // 当前路径

    // 进度状态
    progressThumbnail: DataTypes.ProgressData,
    progressExif: DataTypes.ProgressData,
    progressHash: DataTypes.ProgressData,
    progressSimilarity: DataTypes.ProgressData,
    progressFileMove: DataTypes.ProgressData,
}

export const useAppStore = defineStore('app', {
    state: (): AppStore => ({
        platform: DataTypes.PlatformType.browser,
        envMode: DataTypes.EnvModeType.pro,
        cardWidth: 216, // 卡片宽度
        cardHeight: 216, // 卡片高度
        cardViewMode: "card", // 卡片视图模式
        // 
        srvPrefix: 'http://127.0.0.1:38080', // debug，electron
        // srvPrefix: '', // release
        logInfo: '', // 日志信息
        prj: new DataTypes.Prj(),
        toasts: [],
        historyToasts: [],
        // 
        pageCtrl: pageCtrlInit,
        pageCtrlInit: pageCtrlInit,
        bPageSearchSetting: false,
        bPageFileTransfer: false,
        bPageSet: false,
        bPageResentMsg: false,
        bPageImgView: false,
        fileShowType: "",
        fileSililarity: [],
        // 
        allTags: [], // 所有标签列表
        curFiles: [],
        curSltFile: null,
        hoverFile: null,
        curDirs: [],
        curAllDirs: [],
        DirTrees: [],
        curSltDirTreeItem: null,
        curFileTotal: 0,
        searchCon: new DataTypes.FileSearchCondition(),
        curPath: '/',

        // 进度状态
        progressThumbnail: { step: DataTypes.ProgressStep.Thumbnail, current: 0, total: 0, percent: 0, status: '', isRunning: false },
        progressExif: { step: DataTypes.ProgressStep.Exif, current: 0, total: 0, percent: 0, status: '', isRunning: false },
        progressHash: { step: DataTypes.ProgressStep.Hash, current: 0, total: 0, percent: 0, status: '', isRunning: false },
        progressSimilarity: { step: DataTypes.ProgressStep.Similarity, current: 0, total: 0, percent: 0, status: '', isRunning: false },
        progressFileMove: { step: DataTypes.ProgressStep.FileMove, current: 0, total: 0, percent: 0, status: '', isRunning: false },

    }),
    actions: {
        setData(key: string, value: string): void {
            console.log(`setData: ${key} = ${value}`)
            // this[key] = value
        },
    }
})

