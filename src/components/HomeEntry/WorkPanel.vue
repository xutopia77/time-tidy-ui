<template>
    <div class="work-panel">
        <!-- 文件基础信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('basicInfo')">
                <!-- <span>{{ isPanelOpen('basicInfo') ? '▼' : '▶' }}</span> -->
                <span v-html="isPanelOpen('basicInfo') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <img src="/assets/images/info.svg" alt="Tag Icon" title="文件信息">
            </div>
            <div v-if="isPanelOpen('basicInfo')" class="panel-content">
                <WorkInfo />
            </div>
        </div>

        <!-- 文件标签信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('tagInfo')">
                <!-- <span>{{ isPanelOpen('tagInfo') ? '▼' : '▶' }}</span> -->
                <span v-html="isPanelOpen('tagInfo') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <img src="/assets/images/tag-one.svg" alt="Tag Icon" title="文件标签">
            </div>
            <div v-if="isPanelOpen('tagInfo')" class="panel-content">
                <WorkTag />
            </div>
        </div>
        <!-- 文件操作区域折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('operation')">
                <!-- <span>{{ isPanelOpen('operation') ? '▼' : '▶' }}</span> -->
                <span v-html="isPanelOpen('operation') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <img src="/assets/images/file-settings.svg" alt="Tag Icon" title="文件操作">
            </div>
            <div v-if="isPanelOpen('operation')" class="panel-content">
                <WorkOperate />
            </div>
        </div>
        <!-- 文件搜索区域折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('search')">
                <!-- <span>{{ isPanelOpen('search') ? '▼' : '▶' }}</span> -->
                <span v-html="isPanelOpen('search') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <img src="/assets/images/search.svg" alt="Tag Icon" title="文件搜索">
            </div>
            <div v-if="isPanelOpen('search')" class="panel-content">
                <WorkSearch />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WorkTag from '@/components/HomeEntry/WorkPanel/WorkTag.vue';
import WorkOperate from '@/components/HomeEntry/WorkPanel/WorkOperate.vue';
import WorkSearch from '@/components/HomeEntry/WorkPanel/WorkSearch.vue';
import WorkInfo from '@/components/HomeEntry/WorkPanel/WorkInfo.vue';


// 定义 SVG 变量
const expandedSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2"/>
</svg>`;

const collapsedSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2"/>
</svg>`;

// 管理每个折叠面板的展开状态
const panelStates = ref({
    basicInfo: false,
    tagInfo: true,
    operation: false,
    search: false
});
type PanelName = keyof typeof panelStates.value;

// 切换面板展开状态
const togglePanel = (panelName: PanelName) => {
    panelStates.value[panelName] = !panelStates.value[panelName];
};

// 判断面板是否展开
const isPanelOpen = (panelName: PanelName) => {
    return panelStates.value[panelName];
};
</script>

<style scoped>
.work-panel {
    padding: 2px;
}

.collapse-panel {
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
}

.panel-header {
    padding: 2px;
    background-color: #f5f5f5;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    /* 修改为 flex-end 使内容靠右显示 */
    /* align-items: center; */
}

.panel-header:hover {
    background-color: #e0e0e0;
}

.panel-content {
    padding: 10px;
    border-top: 1px solid #ddd;
    width: calc(100% - 20px);
    height: 100%;
    overflow: hidden;
}

.span-close-exp {
    padding-right: 5px;
}
</style>