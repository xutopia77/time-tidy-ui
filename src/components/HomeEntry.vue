<template>
    <div class="file-home">
        <div class="top-bar">
            <FileSearchBar class="file-search-bar-section" />
            <PageSettingsButton class="page-settings-button" />
            <FilePagination class="file-pagination-section" />
        </div>
        <div class="file-content-wrapper">
            <FileExplorer class="file-explorer-section" />
            <WorkPanel class="work-panel-section" />
        </div>
    </div>
</template>
<script setup lang="ts">
import FileSearchBar from '@/components/HomeEntry/FileSearchBar.vue';
import PageSettingsButton from '@/components/HomeEntry/PageSettingsButton.vue';
import FilePagination from '@/components/HomeEntry/FileExplorer/FilePagination.vue';
import FileExplorer from '@/components/HomeEntry/FileExplorer.vue';
import WorkPanel from '@/components/HomeEntry/WorkPanel.vue';
import '@/assets/common.css'
</script>

<style scoped>
.file-home {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.top-bar {
    display: flex;
    align-items: stretch;
    flex-shrink: 0;
    width: 100%;
    border-bottom: var(--xc-border);
}

.file-search-bar-section {
    flex: 1;
    border-bottom: none;
}

.page-settings-button {
    flex-shrink: 0;
    margin: 0 var(--xc-spacing-xs);
}

.file-pagination-section {
    flex-shrink: 0;
    border-bottom: none;
    border-left: var(--xc-border);
}

.file-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    min-height: 0;
}

.file-explorer-section {
    margin: 0px;
    padding: 0px;
    height: 100%;
    flex: 1;
    overflow: hidden;
}

.work-panel-section {
    max-width: 400px;
    min-width: 200px;
    width: 20%;
    margin: 0px;
    padding: 0px;
    height: 100%;
    border-left: var(--xc-border);
    overflow-y: auto;
    overflow-x: hidden;
}
</style>