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
            <ImageViewer />
        </div>
        <!-- 消息显示区域 -->
        <div class="message-show" v-show="pageCtrl.message.bShow" :style="{ zIndex: pageCtrl.message.idx }">
            <MessageNotify />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted } from 'vue';
import axios from 'axios';

import HeaderPanel from '@/components/HeaderPanel.vue';
import OperateEntry from '@/components/OperateEntry.vue';
import MessageNotify from '@/components/MessageNotify/MessageNotify.vue'
import ImageViewer from '@/components/HomeEntry/FileExplorer/ImageViewer.vue'
import '@/assets/common.css'
import Utils from '@/utils/utils'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

const pageCtrl = computed(() => {
    return appStore.pageCtrl
})

function get_prj_info() {
    axios.post(`${appStore.srvPrefix}/api/v1/project`)
        .then((response) => {
            appStore.prj = response.data;
            console.log('Project info:', appStore.prj);
            Utils.files_get(null)
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
}

onBeforeMount(() => {
    Utils.appstore_set(appStore)
    get_prj_info()
})

onMounted(() => {
    Utils.page_show({ page: 'message', bShow: true })
})

</script>

<style scoped>
.app-entry {
    padding: 0;
    margin: 0;
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
    background-color: var(--common-background-color);
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
    border-bottom: 1px solid #ddd;
    /* 添加底部边框 */
    height: 25px;
    width: 100%;
}

.page-view {
    flex: 1;
}
</style>