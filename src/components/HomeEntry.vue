<template>
    <div class="home-entry">
        <!-- HeaderPanel 区域 -->
        <HeaderPanel class="header-panel-section" />
        <!-- 下方容器，包含 FileExplorer 和 WorkPanel -->
        <div class="bottom-container">
            <FileExplorer class="file-explorer-section" />
            <WorkPanel class="work-panel-section" />
        </div>
    </div>
</template>

<script setup lang="ts">
import FileExplorer from '@/components/FileExplorer.vue';
import WorkPanel from '@/components/WorkPanel.vue';
import HeaderPanel from '@/components/HeaderPanel.vue';
</script>

<style scoped>
.home-entry {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    /* 垂直布局 */
    height: 100vh;
    /* 占满视口高度 */
}

.header-panel-section {
    /* 可根据需要调整 HeaderPanel 的高度 */
    flex: 0 0 auto;
    border-bottom: 1px solid #ddd;
    /* 添加底部边框 */
}

.bottom-container {
    flex: 1;
    /* 占据剩余空间 */
    display: flex;
    /* 水平布局 */
}

.file-explorer-section {
    flex: 1;
    /* 占据剩余空间 */
}

.work-panel-section {
    flex: 0 0 20%;
    /* 初始宽度为 20% */
    max-width: 100px;
    /* 最大宽度为 100px */
    border-left: 1px solid #ddd;
    /* 添加左侧边框 */
}
</style>