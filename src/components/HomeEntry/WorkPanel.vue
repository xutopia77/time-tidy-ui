<template>
    <div class="work-panel xc-scrollbar">
        <div>
        </div>
        <!-- 文件基础信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('basicInfo')">
                <Down v-bind="iconProps" v-if="isPanelOpen('basicInfo')" />
                <Right v-bind="iconProps" v-if="!isPanelOpen('basicInfo')" />
                <Info v-bind="iconProps" />
            </div>
            <div v-if="isPanelOpen('basicInfo')" class="panel-content">
                <WorkInfo />
            </div>
        </div>

        <!-- 文件标签信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('tagInfo')">
                <Down v-bind="iconProps" v-if="isPanelOpen('tagInfo')" />
                <Right v-bind="iconProps" v-if="!isPanelOpen('tagInfo')" />
                <TagOne v-bind="iconProps" />
            </div>
            <div v-if="isPanelOpen('tagInfo')" class="panel-content">
                <WorkTag />
            </div>
        </div>
        <!-- 文件操作区域折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('operation')">
                <Down v-bind="iconProps" v-if="isPanelOpen('operation')" />
                <Right v-bind="iconProps" v-if="!isPanelOpen('operation')" />
                <Setting v-bind="iconProps" />
            </div>
            <div v-if="isPanelOpen('operation')" class="panel-content">
                <WorkOperate />
            </div>
        </div>
        <!-- 文件夹面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('tree')">
                <Down v-bind="iconProps" v-if="isPanelOpen('tree')" />
                <Right v-bind="iconProps" v-if="!isPanelOpen('tree')" />
                <FolderClose v-bind="iconProps" />
            </div>
            <div v-if="isPanelOpen('tree')" class="panel-content">
                <WorkTree />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import WorkTag from '@/components/HomeEntry/WorkPanel/WorkTag.vue';
import WorkOperate from '@/components/HomeEntry/WorkPanel/WorkOperate.vue';
import WorkInfo from '@/components/HomeEntry/WorkPanel/WorkInfo.vue';
import WorkTree from '@/components/HomeEntry/WorkPanel/WorkTree.vue';
import '@/assets/common.css';
// import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
const iconProps = computed(() => (appStore.iconProps))

import { FolderClose, Down, Right, TagOne, Info, Setting } from '@icon-park/vue-next'
// import Utils from '@/utils/utils';

// 管理每个折叠面板的展开状态
const panelStates = ref({
    basicInfo: true,
    tagInfo: true,
    operation: true,
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
    padding: var(--xc-spacing-xs);
}

.collapse-panel {
    margin-bottom: var(--xc-spacing-sm);
    border: none;
    border-radius: var(--xc-border-radius-sm);
    width: 100%;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
}

.panel-header {
    padding: var(--xc-spacing-xs);
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    transition: background-color var(--xc-transition-normal);
}

.panel-header:hover {
    background-color: var(--xc-background-color-hover);
}

.panel-content {
    padding: var(--xc-spacing-sm);
    border-top: var(--xc-border);
    width: calc(100% - var(--xc-spacing-lg));
    height: 100%;
    overflow: hidden;
}

.span-close-exp {
    padding-right: var(--xc-spacing-xs);
}
</style>