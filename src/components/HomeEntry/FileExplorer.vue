<template>
    <div class="file-explorer">
        <FileNavHeader class="file-nav-header" />
        <div class="file-grid xc-scrollbar">
            <!-- 循环渲染文件和文件夹 -->
            <template v-for="item in items" :key="item.id">
                <ImageCard :item="item" />
            </template>
            <template v-for="item in dirs" :key="item.id">
                <FolderCard :item="item" />
            </template>
        </div>
        <FileFooter class="file-footer" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FileNavHeader from '@/components/HomeEntry/FileExplorer/FileNavHeader.vue';
import ImageCard from '@/components/HomeEntry/FileExplorer/ImageCard.vue';
import FolderCard from '@/components/HomeEntry/FileExplorer/FolderCard.vue';
import FileFooter from '@/components/HomeEntry/FileExplorer/FileFooter.vue';

import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'
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

.file-nav-header {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 32px;
    /* background-color: aquamarine; */
}

.file-grid {
    padding: 0px;
    margin: 0px;
    /* display: flex;
    flex-wrap: wrap; */

    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    height: calc(100% - 32px - 32px);
    /* background-color: bisque; */
}


.file-footer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 32px;
}
</style>