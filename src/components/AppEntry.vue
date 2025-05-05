<template>
    <div class="home-entry">
        <!-- HeaderPanel 区域 -->
        <HeaderPanel class="header-panel-section" />
        <!-- 下方容器，包含 FileExplorer 和 WorkPanel -->
        <!-- <FileMain /> -->
        <router-view class="page-view" />
    </div>
</template>

<script setup lang="ts">
import HeaderPanel from '@/components/HeaderPanel.vue';
</script>

<style scoped>
.home-entry {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    /* 垂直布局 */
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