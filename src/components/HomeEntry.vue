<template>
    <div class="p-0 m-0 w-full h-full flex flex-col">
        <div class="flex items-stretch flex-shrink-0 w-full border-b border-border">
            <FileSearchBar class="flex-1 border-b-none" />
            <PageSettingsButton class="flex-shrink-0 mx-1" />
        </div>
        <div class="flex-1 flex flex-row overflow-hidden min-h-0">
            <FileExplorer class="m-0 p-0 h-full flex-1 overflow-hidden" />
        </div>
    </div>
</template>

<script setup lang="ts">
import FileSearchBar from '@/components/HomeEntry/FileSearchBar.vue';
import PageSettingsButton from '@/components/HomeEntry/PageSettingsButton.vue';
import FileExplorer from '@/components/HomeEntry/FileExplorer.vue';
</script>
