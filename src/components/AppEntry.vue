<template>
    <div class="app-entry">
        <div class="home-entry" v-show="pageCtrl.home.bShow" :style="{ zIndex: pageCtrl.home.idx }">
            <HeaderPanel class="header-panel-section" />
            <router-view class="page-view" />
        </div>
        <div class="settings-panel" v-show="pageCtrl.set.bShow" :style="{ zIndex: pageCtrl.set.idx }">
            <OperateEntry />
        </div>
        <div class='image-view' v-show="pageCtrl.imageView.bShow" :style="{ zIndex: pageCtrl.imageView.idx }">
            <FileViewer />
        </div>
        <!-- 消息显示区域 -->
        <div class="message-show" v-show="pageCtrl.message.bShow" :style="{ zIndex: pageCtrl.message.idx }">
            <MessageNotify />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted } from 'vue';
import HeaderPanel from '@/components/HeaderPanel.vue';
import OperateEntry from '@/components/OperateEntry.vue';
import MessageNotify from '@/components/MessageNotify/MessageNotify.vue'
import FileViewer from '@/components/HomeEntry/FileExplorer/FileViewer.vue'
import '@/assets/common.css'
import Utils from '@/utils/utils'
import * as DatTypes from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'
const pageCtrl = computed(() => {
    return appStore.pageCtrl
})

onBeforeMount(() => {
    // 判断当前是否为开发环境
    const isDev = import.meta.env.MODE === 'development';
    // 判断当前是否为生产环境
    // const isProd = import.meta.env.MODE === 'production';
    appStore.envMode = isDev ? DatTypes.EnvModeType.dev : DatTypes.EnvModeType.pro
    console.log(`env: navigator.userAgent: ${navigator.userAgent}; MODE : ${import.meta.env.MODE}; `);
    if (navigator.userAgent.includes('time_capsule')) {
        console.log('当前在Electron中运行');
        appStore.platform = DatTypes.PlatformType.electron;
    }
    else {
        console.log('当前在浏览器中运行');
        appStore.platform = DatTypes.PlatformType.browser;
    }
    if (appStore.platform == DatTypes.PlatformType.electron) {
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
    position: relative;
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
</style>