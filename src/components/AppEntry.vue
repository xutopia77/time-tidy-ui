<template>
    <div class="app-entry">
        <div class="home-entry" v-show="!appStore.bShowSetting">
            <HeaderPanel class="header-panel-section" />
            <router-view class="page-view" />
        </div>
        <div class="settings-panel" v-show="appStore.bShowSetting">
            <OperateEntry />
        </div>
        <!-- 消息显示区域 -->
        <div class="message-show">
            <MessageNotify />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import axios from 'axios';
import Utils from '@/utils/utils'
import HeaderPanel from '@/components/HeaderPanel.vue';
import OperateEntry from '@/components/OperateEntry.vue';
import MessageNotify from '@/components/MessageNotify/MessageNotify.vue'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

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
</script>

<style scoped>
.app-entry {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
}

.home-entry {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    /* 垂直布局 */
    height: 100%;
    width: 100%;
}

.settings-panel {
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