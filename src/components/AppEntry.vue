<template>
    <div class="app-entry">
        <div class="home-entry" v-show="pageCtrl.home.bShow" :style="{ zIndex: pageCtrl.home.idx }">
            <HeaderPanel class="header-panel-section" />
            <router-view class="page-view" />
        </div>
        <div class='image-view' v-show="pageCtrl.imageView.bShow" :style="{ zIndex: pageCtrl.imageView.idx }">
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
import SearchSet from '@/components/HomeEntry/WorkPanel/SearchSet.vue'
import FileTransfer from '@/components/HomeEntry/WorkPanel/FileTransfer.vue'
import PageSet from '@/components/HomeEntry/WorkPanel/PageSet.vue'
import '@/assets/common.css'
import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

const pageCtrl = computed(() => {
    return appStore.pageCtrl
})

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
    if (navigator.userAgent.includes('time_capsule')) {
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


let timerId = 0

onMounted(() => {
    Utils.page_show({ page: 'message', bShow: true })
    timerId = window.setInterval(Utils.heartbeat, 1000);
})

onUnmounted(() => {
    if (timerId) {
        window.clearInterval(timerId);
    }
});

</script>

<style scoped>
.app-entry {
    padding: 0px;
    margin: 0px;
    height: 100%;
    width: 100%;
    /* position: relative; */
    /* position: flex; */
    /* 为子元素的绝对定位提供参考 */
}

.home-entry,
.settings-panel,
.image-view,
.message-show {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.message-show {
    pointer-events: none;
}

.home-entry {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    /* 垂直布局 */
    height: 100%;
    width: 100%;
    z-index: 10;
}

.settings-panel {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    opacity: 1;
    background-color: var(--xc-background-color);
}

.image-view {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
}

.header-panel-section {
    /* 可根据需要调整 HeaderPanel 的高度 */
    flex: 0 0 auto;
    border-bottom: var(--xc-border-hover);
    /* 添加底部边框 */
    box-sizing: border-box;
    /* 将盒模型设置为 border-box */
    height: 32px;
    width: 100%;
    padding: 0px;
    margin: 0px;
    background-color: var(--xc-background-color);
}

.page-view {
    flex: 1;
    width: 100%;
    margin: 0px;
    padding: 0px;
    height: calc(100% - 32px);
    background-color: var(--xc-background-color);
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
    padding: 20px;
    box-sizing: border-box;
}

.fullscreen-overlay>div {
    width: 90%;
    max-width: 800px;
    max-height: 90%;
    overflow: hidden;
}
</style>