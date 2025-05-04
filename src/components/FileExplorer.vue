<template>
    <div class="file-explorer">
        <FileNavHeader class="file-nav-header" />
        <div class="file-grid">
            <!-- 循环渲染文件和文件夹 -->
            <template v-for="item in items" :key="item.path">
                <ImageCard v-if="item.type === 'file'" :item="item" />
                <FolderCard v-else-if="item.type === 'folder'" :item="item" />
            </template>
            <template v-for="item in dirs" :key="item.path">
                <ImageCard v-if="item.type === 'file'" :item="item" />
                <FolderCard v-else-if="item.type === 'folder'" :item="item" />
            </template>
        </div>
        <FileFooter class="file-footer" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FileNavHeader from '@/components/FileExplorer/FileNavHeader.vue';
import ImageCard from '@/components/FileExplorer/ImageCard.vue';
import FolderCard from '@/components/FileExplorer/FolderCard.vue';
import FileFooter from '@/components/FileExplorer/FileFooter.vue';

import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

const items = computed(() => {
    return appStore.curFiles;
});
const dirs = computed(() => {
    return appStore.curDirs;
});
</script>

<style scoped>
.file-explorer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    /* background-color: aqua; */
}

.file-footer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 25px;
}

.file-nav-header {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 25px;
    /* background-color: aquamarine; */
}

.file-grid {
    display: flex;
    flex-wrap: wrap;
    height: calc(100% - 50px);
    /* background-color: bisque; */
    overflow: auto;
    /* 添加 overflow 属性，内容超出时自动显示滚动条 */
}

/* 假设 ImageCard 和 FolderCard 有共同的类名 .file-card，这里设置其基础样式 */
.file-card {
    flex: 1 0 calc(20% - 6px);
    /* 每行最多 5 个项目，减去间距 */
    min-width: 120px;
    /* 最小宽度 */
    box-sizing: border-box;
    /* 包含内边距和边框 */
}
</style>