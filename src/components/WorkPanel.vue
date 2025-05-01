<template>
    <div class="work-panel">
        <!-- 文件基础信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('basicInfo')">
                文件基础信息
                <span class="arrow">{{ isPanelOpen('basicInfo') ? '▼' : '▶' }}</span>
            </div>
            <div v-if="isPanelOpen('basicInfo')" class="panel-content">
                <!-- 这里添加文件基础信息内容 -->
                <p>文件名称: example.txt</p>
                <p>文件大小: 1024 KB</p>
                <p>创建时间: 2025-05-01</p>
            </div>
        </div>

        <!-- 文件标签信息折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('tagInfo')">
                文件标签信息
                <span class="arrow">{{ isPanelOpen('tagInfo') ? '▼' : '▶' }}</span>
            </div>
            <div v-if="isPanelOpen('tagInfo')" class="panel-content">
                <!-- 这里添加文件标签信息内容 -->
                <p>标签 1: 重要</p>
                <p>标签 2: 文档</p>
            </div>
        </div>

        <!-- 文件操作区域折叠面板 -->
        <div class="collapse-panel">
            <div class="panel-header" @click="togglePanel('operation')">
                文件操作区域
                <span class="arrow">{{ isPanelOpen('operation') ? '▼' : '▶' }}</span>
            </div>
            <div v-if="isPanelOpen('operation')" class="panel-content">
                <!-- 这里添加文件操作区域内容 -->
                <button>重命名</button>
                <button>删除</button>
                <button>分享</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 管理每个折叠面板的展开状态
const panelStates = ref({
    basicInfo: false,
    tagInfo: false,
    operation: false
});

// 切换面板展开状态
const togglePanel = (panelName: string) => {
    panelStates.value[panelName] = !panelStates.value[panelName];
};

// 判断面板是否展开
const isPanelOpen = (panelName: string) => {
    return panelStates.value[panelName];
};
</script>

<style scoped>
.work-panel {
    padding: 10px;
}

.collapse-panel {
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.panel-header {
    padding: 10px;
    background-color: #f5f5f5;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header:hover {
    background-color: #e0e0e0;
}

.arrow {
    font-size: 12px;
}

.panel-content {
    padding: 10px;
    border-top: 1px solid #ddd;
}
</style>