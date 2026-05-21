<template>
    <transition name="sidebar-slide">
        <div v-if="visible" class="info-sidebar xc-scrollbar">
            <div class="sidebar-header">
                <h3>信息面板</h3>
                <button class="sidebar-close-btn" @click="$emit('close')">×</button>
            </div>

            <FileInfoSection :selected-files="selectedFiles" />
            
            <FileTagSection :selected-files="selectedFiles" />
            
            <FolderListSection 
                :dirs="dirs"
                :is-all-path-search="isAllPathSearch"
                @enter-folder="$emit('enter-folder', $event)"
            />
        </div>
    </transition>
</template>

<script setup lang="ts">
import * as DatType from '@/utils/dataTypedef'
import FileInfoSection from './FileInfoSection.vue'
import FileTagSection from './FileTagSection.vue'
import FolderListSection from './FolderListSection.vue'

defineProps<{
    visible: boolean;
    selectedFiles: DatType.File[];
    dirs: DatType.DirItem[];
    isAllPathSearch: boolean;
}>();

defineEmits<{
    (e: 'close'): void;
    (e: 'enter-folder', dir: DatType.DirItem): void;
}>();
</script>

<style scoped>
.info-sidebar {
    width: 280px;
    background-color: var(--xc-background-color);
    border-left: var(--xc-border);
    overflow-y: auto;
    flex-shrink: 0;
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
    transition: all var(--xc-transition-normal);
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-md);
    border-bottom: var(--xc-border);
    position: sticky;
    top: 0;
    background-color: var(--xc-background-color);
    z-index: 10;
}

.sidebar-header h3 {
    margin: 0;
    font-size: var(--xc-font-size-lg);
    color: var(--xc-text-color);
}

.sidebar-close-btn {
    width: 28px;
    height: 28px;
    border: none;
    background-color: transparent;
    color: var(--xc-text-color-secondary);
    font-size: 20px;
    cursor: pointer;
    border-radius: var(--xc-border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--xc-transition-normal);
}

.sidebar-close-btn:hover {
    background-color: var(--xc-background-color-hover);
    color: var(--xc-text-color);
}
</style>
