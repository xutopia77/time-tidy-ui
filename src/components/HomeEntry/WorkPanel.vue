<template>
    <div class="work-panel xc-scrollbar">
        <!-- 文件基础信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('basicInfo')">
                <span v-html="isPanelOpen('basicInfo') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <!-- <img src="/assets/images/info.svg" alt="Tag Icon" title="文件信息"> -->
                <InfoIcon />
            </div>
            <div v-if="isPanelOpen('basicInfo')" class="panel-content">
                <WorkInfo />
            </div>
        </div>

        <!-- 文件标签信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('tagInfo')">
                <span v-html="isPanelOpen('tagInfo') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <!-- <img src="/assets/images/tag-one.svg" alt="Tag Icon" title="文件标签"> -->
                <TagOneIcon />
            </div>
            <div v-if="isPanelOpen('tagInfo')" class="panel-content">
                <WorkTag />
            </div>
        </div>
        <!-- 文件操作区域折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('operation')">
                <span v-html="isPanelOpen('operation') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <FileSettingIcon :icon-props="{
                    width: '24',
                    height: '24',
                    fillColor: '#676b6e'
                }" />
            </div>
            <div v-if="isPanelOpen('operation')" class="panel-content">
                <WorkOperate />
            </div>
        </div>
        <!-- 文件搜索区域折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('search')">
                <span v-html="isPanelOpen('search') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <!-- <img src="/assets/images/search.svg" alt="Tag Icon" title="文件搜索"> -->
                <SearchIcon />
            </div>
            <div v-if="isPanelOpen('search')" class="panel-content">
                <WorkSearch />
            </div>
        </div>
        <!-- 文件夹面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('tree')">
                <span v-html="isPanelOpen('tree') ? expandedSvg : collapsedSvg" class="span-close-exp"></span>
                <SearchIcon />
            </div>
            <div v-if="isPanelOpen('tree')" class="panel-content">
                <WorkTree />
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
import WorkTree from '@/components/HomeEntry/WorkPanel/WorkTree.vue';
import '@/assets/common.css';
import { FileSettingIcon, TagOneIcon, InfoIcon, SearchIcon } from '@/components/Icon'

// 定义 SVG 变量
const expandedSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2"/>
</svg>`;

const collapsedSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2"/>
</svg>`;

// const file_setting_svg = `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 44H38C39.1046 44 40 43.1046 40 42V14H30V4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44Z" fill="#2F88FF" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 4L40 14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="27" r="5" fill="#43CCF8" stroke="#FFF" stroke-width="4"/><path d="M24 19V22" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 32V35" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.8281 21L27.7068 23.1213" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.8281 31L17.7068 33.1213" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 21L20.1213 23.1213" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 31L30.1213 33.1213" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 27H17.5H19" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 27H30.5H32" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`

// const dynamicColor = ref('#2F88FF');


// 管理每个折叠面板的展开状态
const panelStates = ref({
    basicInfo: true,
    tagInfo: true,
    operation: true,
    search: true,
    tree: true
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
    border: none;
    border-radius: 4px;
    width: 100%;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
}

.panel-header {
    padding: 2px;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    /* 修改为 flex-end 使内容靠右显示 */
    /* align-items: center; */
}

.panel-header:hover {
    background-color: var(--xc-background-color-hover);
}

.panel-content {
    padding: 10px;
    border-top: var(--xc-border);
    width: calc(100% - 20px);
    height: 100%;
    overflow: hidden;
}

.span-close-exp {
    padding-right: 5px;
}
</style>