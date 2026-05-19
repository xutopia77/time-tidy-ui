<template>
    <div class="sidebar-section" v-if="dirs.length > 0 && !isAllPathSearch">
        <h4 class="section-title">
            <span class="section-icon">📁</span>
            文件夹列表
            <span class="section-count">({{ dirs.length }})</span>
        </h4>
        <div class="section-content">
            <div 
                v-for="dir in dirs" 
                :key="dir.id" 
                class="folder-item"
                @click="$emit('enter-folder', dir)"
            >
                <span class="folder-icon">📂</span>
                <span class="folder-name" :title="dir.name">{{ dir.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as DatType from '@/utils/dataTypedef'

defineProps<{
    dirs: DatType.DirItem[];
    isAllPathSearch: boolean;
}>();

defineEmits<{
    (e: 'enter-folder', dir: DatType.DirItem): void;
}>();
</script>

<style scoped>
.sidebar-section {
    padding: var(--xc-spacing-md);
    border-bottom: var(--xc-border);
}

.section-title {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    margin: 0 0 var(--xc-spacing-md) 0;
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    font-weight: 500;
}

.section-icon {
    font-size: var(--xc-font-size-md);
}

.section-count {
    color: var(--xc-text-color-secondary);
    font-weight: normal;
    font-size: var(--xc-font-size-sm);
}

.section-content {
    display: flex;
    flex-direction: column;
    gap: var(--xc-spacing-sm);
}

.folder-item {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    border-radius: var(--xc-border-radius-sm);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.folder-item:hover {
    background-color: var(--xc-background-color-hover);
}

.folder-icon {
    font-size: var(--xc-font-size-md);
}

.folder-name {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
