import { defineStore } from 'pinia'

import * as DataTypes from '@/utils/dataTypedef'

export type AppStore = {
    curFiles : DataTypes.FileItem[] | null, // 当前展示的文件列表
}

export const useAppStore = defineStore('app', {
    state: (): AppStore => ({
        curFiles: null,
    }),
    actions: {
        setData(key: string, value: string): void {
            console.log(`setData: ${key} = ${value}`)
            // this[key] = value
        }
    }
})

