<template>
    <div class="file-home">
        <FileExplorer class="file-explorer-section" />
        <WorkPanel class="work-panel-section" />
    </div>
</template>
<script setup lang="ts">
import FileExplorer from '@/components/HomeEntry/FileExplorer.vue';
import WorkPanel from '@/components/HomeEntry/WorkPanel.vue';
</script>

<style scoped>
.file-home {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    /* 水平布局 */
    height: calc(100% - 30px);
    width: 100%;
}

.work-panel-section {
    max-width: 400px;
    min-width: 200px;
    width: 20%;
    border-left: 1px solid #ddd;
}
</style>