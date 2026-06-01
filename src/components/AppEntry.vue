<template>
    <div class="app-entry">
        <HeaderPanel class="header-panel-section" />
        <div class="home-entry">
            <router-view class="page-view" />
        </div>
        <div class='image-view' v-if="appStore.bPageImgView" style="z-index: 100;">
            <FileViewer />
        </div>

        <div v-if="bPageSearchSetting" class="fullscreen-overlay">
            <SearchSet>
            </SearchSet>
        </div>
        <div v-if="bPageFileTransfer" class="fullscreen-overlay">
            <FileTransfer>
            </FileTransfer>
        </div>
        <div v-if="bPageSet" class="fullscreen-overlay">
            <PageSet />
        </div>
        <MessageToast />
        <RecentMessagesPanel />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted } from 'vue';
import HeaderPanel from '@/components/AppNav.vue';
import MessageToast from '@/components/MessageNotify/MessageToast.vue'
import RecentMessagesPanel from '@/components/MessageNotify/RecentMessagesPanel.vue'
import FileViewer from '@/components/HomeEntry/FileExplorer/FileViewer.vue'
// import SearchSet from '@/components/HomeEntry/WorkPanel/SearchSet.vue'
import FileTransfer from '@/components/HomeEntry/WorkPanel/FileTransfer.vue'
import PageSet from '@/components/HomeEntry/WorkPanel/PageSet.vue'
import '@/assets/common.css'
import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()


const bPageSearchSetting = computed(() => { return appStore.bPageSearchSetting })
const bPageFileTransfer = computed(() => { return appStore.bPageFileTransfer })
const bPageSet = computed(() => { return appStore.bPageSet })

onBeforeMount(() => {
    // 判断当前是否为开发环境
    const isDev = import.meta.env.MODE === 'development';
    // 判断当前是否为生产环境
    // const isProd = import.meta.env.MODE === 'production';
    appStore.envMode = isDev ? DatType.EnvModeType.dev : DatType.EnvModeType.pro
    console.log(`env: navigator.userAgent: ${navigator.userAgent}; MODE : ${import.meta.env.MODE}; `);
    if (navigator.userAgent.includes('time-tidy')) {
        console.log('当前在Electron中运行');
        appStore.platform = DatType.PlatformType.electron;
    }
    else {
        console.log('当前在浏览器中运行');
        appStore.platform = DatType.PlatformType.browser;
    }
    if (appStore.platform == DatType.PlatformType.electron) {
        appStore.srvPrefix = 'http://127.0.0.1:38080'
    }
    else {
        if (isDev) {
            appStore.srvPrefix = 'http://127.0.0.1:38080'
        }
        else {
            appStore.srvPrefix = ''
        }
    }
    Utils.appstore_set(appStore)
    Utils.prj_info_get()
})


let eventSource: EventSource | null = null

onMounted(() => {
    connectSSE()
})

onUnmounted(() => {
    if (eventSource) {
        eventSource.close()
    }
})

function connectSSE() {
    const url = `${appStore.srvPrefix}/api/v1/events`
    eventSource = new EventSource(url)
    
    eventSource.onopen = () => {
        console.log('SSE connected')
    }
    
    eventSource.onmessage = (event) => {
        try {
            const message: DatType.SseMsg = JSON.parse(event.data)
            handleSSEMessage(message)
        } catch (error) {
            console.error('Failed to parse SSE message:', error)
        }
    }
    
    eventSource.onerror = (error) => {
        console.error('SSE error:', error)
        if (eventSource) {
            eventSource.close()
        }
        setTimeout(() => {
            connectSSE()
        }, 3000)
    }
}

function handleSSEMessage(message: DatType.SseMsg) {
    switch (message.type) {
        case DatType.SseMsgType.SysStatus:
            handleSysStatus(message.data as DatType.Resp<DatType.RespSysStatus>)
            break
        case DatType.SseMsgType.FileUpdate:
            handleFileUpdate(message.data as DatType.Resp<DatType.FileUpdateData>)
            break
        case DatType.SseMsgType.TagUpdate:
            handleTagUpdate(message.data as DatType.Resp<DatType.TagUpdateData>)
            break
        case DatType.SseMsgType.ProjectUpdate:
            handleProjectUpdate(message.data as DatType.Resp<DatType.ProjectUpdateData>)
            break
        case DatType.SseMsgType.LogUpdate:
            handleLogUpdate(message.data as DatType.Resp<DatType.LogUpdateData>)
            break
        case DatType.SseMsgType.Heartbeat:
            break
        case DatType.SseMsgType.Progress:
            handleProgressUpdate(message.data as DatType.Resp<DatType.ProgressUpdateData>)
            break
        default:
            console.log('Unknown SSE message type:', message.type)
    }
}

function handleSysStatus(data: DatType.Resp<DatType.RespSysStatus>) {
    console.log('handleSysStatus:', data)
    
    if (data.data && data.data.taskInfo && data.data.taskInfo.status === DatType.TaskStatus.Completed) {
        if (data.data.taskInfo.cmd === DatType.TaskCmd.PrjSet) {
            const taskResult = data.data.taskInfo.result as DatType.Resp<DatType.PrjSetResp>
            console.log('taskResult:', taskResult)
            
            if (taskResult && taskResult.code === 0) {
                Utils.message_notify({ 
                    content: '设置完成', 
                    type: 'success' 
                })
                
                if (taskResult.data && taskResult.data.bNeedGetFiles) {
                    Utils.files_get()
                }
            } else if (taskResult && taskResult.code !== 0) {
                Utils.message_notify({ 
                    content: `设置失败: ${taskResult.status}`, 
                    type: 'error' 
                })
            }
        }
    }
}

function handleFileUpdate(data: DatType.Resp<DatType.FileUpdateData>) {
    if (data.data && data.data.files && data.data.dirs) {
        appStore.curFiles = data.data.files
        appStore.curDirs = data.data.dirs
    }
}

function handleTagUpdate(data: DatType.Resp<DatType.TagUpdateData>) {
    if (data.data && data.data.tags) {
        appStore.allTags = data.data.tags
    }
}

function handleProjectUpdate(data: DatType.Resp<DatType.ProjectUpdateData>) {
    if (data.data && data.data.project) {
        appStore.prj = data.data.project
    }
}

function handleLogUpdate(data: DatType.Resp<DatType.LogUpdateData>) {
    if (data.data && data.data.log) {
        appendLog(data.data.log)
    }
}

const MAX_LOG_LINES = 100
const MAX_LOG_SIZE = 1024 * 1024 // 1MB

function appendLog(newLog: string) {
    appStore.logInfo += newLog
    
    const lines = appStore.logInfo.split('\n')
    
    if (lines.length > MAX_LOG_LINES) {
        appStore.logInfo = lines.slice(-MAX_LOG_LINES).join('\n')
    }
    
    if (appStore.logInfo.length > MAX_LOG_SIZE) {
        appStore.logInfo = appStore.logInfo.slice(-MAX_LOG_SIZE)
    }
}

function handleProgressUpdate(data: DatType.Resp<DatType.ProgressUpdateData>) {
    if (data.data && data.data.progress) {
        const progress = data.data.progress
        switch (progress.step) {
            case DatType.ProgressStep.Thumbnail:
                appStore.progressThumbnail = progress
                break
            case DatType.ProgressStep.Exif:
                appStore.progressExif = progress
                break
            case DatType.ProgressStep.Hash:
                appStore.progressHash = progress
                break
            case DatType.ProgressStep.Similarity:
                appStore.progressSimilarity = progress
                break
            case DatType.ProgressStep.FileMove:
                appStore.progressFileMove = progress
                break
            case DatType.ProgressStep.AIBackgroundAnalyze:
                appStore.progressData = progress
                break
        }
    }
}

</script>

<style scoped>
.app-entry {
    padding: 0px;
    margin: 0px;
    height: 100%;
    width: 100%;
    position: relative;
}

.header-panel-section {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 100;
}

.home-entry {
    margin-left: var(--xc-sidebar-width);
    height: 100%;
    width: calc(100% - var(--xc-sidebar-width));
    z-index: 10;
}

.settings-panel,
.image-view,
.message-show {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.settings-panel {
    padding: 0;
    margin: 0;
    background-color: var(--xc-background-color);
    z-index: 10;
}

.image-view {
    padding: 0;
    margin: 0;
    z-index: 100;
}

.page-view {
    margin: 0px;
    padding: 0px;
    height: 100%;
    width: 100%;
    background-color: var(--xc-background-color);
    overflow-y: auto;
    overflow-x: hidden;
}

.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--xc-spacing-xl);
    box-sizing: border-box;
}

.fullscreen-overlay>div {
    width: 90%;
    max-width: 800px;
    max-height: 90%;
    overflow: hidden;
}
</style>