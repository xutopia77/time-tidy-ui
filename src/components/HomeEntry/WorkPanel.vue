<template>
    <div class="work-panel">
        <!-- 文件基础信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('basicInfo')">
                文件信息
                <span>{{ isPanelOpen('basicInfo') ? '▼' : '▶' }}</span>
            </div>
            <div v-if="isPanelOpen('basicInfo')" class="panel-content">
                <WorkInfo />
            </div>
        </div>

        <!-- 文件标签信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('tagInfo')">
                文件标签
                <span>{{ isPanelOpen('tagInfo') ? '▼' : '▶' }}</span>
            </div>
            <div v-if="isPanelOpen('tagInfo')" class="panel-content">
                <WorkTag />
            </div>
        </div>
        <!-- 文件操作区域折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('operation')">
                文件操作
                <span>{{ isPanelOpen('operation') ? '▼' : '▶' }}</span>
            </div>
            <div v-if="isPanelOpen('operation')" class="panel-content">
                <WorkOperate />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WorkTag from '@/components/HomeEntry/WorkPanel/WorkTag.vue';
import WorkOperate from '@/components/HomeEntry/WorkPanel/WorkOperate.vue';
import WorkInfo from '@/components/HomeEntry/WorkPanel/WorkInfo.vue';

// 管理每个折叠面板的展开状态
const panelStates = ref({
    basicInfo: false,
    tagInfo: false,
    operation: false
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
}

.panel-header {
    padding: 2px;
    background-color: #f5f5f5;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header:hover {
    background-color: #e0e0e0;
}

.panel-content {
    padding: 10px;
    border-top: 1px solid #ddd;
}
</style>