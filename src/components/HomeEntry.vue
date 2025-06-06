<template>
    <div class="file-home">
        <FileExplorer class="file-explorer-section" />
        <WorkPanel class="work-panel-section" />
    </div>
</template>
<script setup lang="ts">
import FileExplorer from '@/components/HomeEntry/FileExplorer.vue';
import WorkPanel from '@/components/HomeEntry/WorkPanel.vue';
import '@/assets/common.css'
</script>

<style scoped>
.file-home {
    padding: 0;
    margin: 0;
    width: 100%;
    /* height: 100%; */
    /* 不用再设置高度，在外面已经设置了 */
    display: flex;
    flex-direction: row;
    /* 水平布局 */
}

.file-explorer-section {
    margin: 0px;
    padding: 0px;
    height: 100%;
}

.work-panel-section {
    max-width: 400px;
    min-width: 200px;
    width: 20%;
    margin: 0px;
    padding: 0px;
    height: 100%;
    border-left: var(--xc-border);
}
</style>