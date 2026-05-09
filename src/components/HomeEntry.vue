<template>
    <div class="file-home">
        <div class="top-bar">
            <FileSearchBar class="file-search-bar-section" />
            <PageSettingsButton class="page-settings-button" />
        </div>
        <div class="file-content-wrapper">
            <FileExplorer class="file-explorer-section" />
        </div>
    </div>
</template>
<script setup lang="ts">
import FileSearchBar from '@/components/HomeEntry/FileSearchBar.vue';
import PageSettingsButton from '@/components/HomeEntry/PageSettingsButton.vue';
import FileExplorer from '@/components/HomeEntry/FileExplorer.vue';
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
</style>