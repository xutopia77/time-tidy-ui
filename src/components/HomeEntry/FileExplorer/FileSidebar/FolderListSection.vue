<template>
    <div class="sidebar-section folder-tree-section">
        <h4 class="section-title">
            <span class="section-icon">📁</span>
            文件夹列表
            <span class="section-count">({{ totalFolderCount }})</span>
        </h4>
        <div class="section-content">
            <div class="folder-tree" v-if="dirTrees.length > 0">
                <DirTreeItem :data="dirTrees" v-model="selectedItem" />
            </div>
            <div v-else class="empty-folder">
                <span class="empty-text">暂无文件夹</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore'
import Utils from '@/utils/utils'
import DirTreeItem from '@/components/HomeEntry/WorkPanel/DirTreeItem.vue'

const appStore = useAppStore()

defineProps<{
    dirs: DatType.DirItem[];
    isAllPathSearch: boolean;
}>()

defineEmits<{
    (e: 'enter-folder', dir: DatType.DirItem): void;
}>()

const dirTrees = computed(() => {
    return appStore.DirTrees
})

const selectedItem = ref<DatType.DirTreeItem | null>(null)

watch(selectedItem, (newValue: DatType.DirTreeItem | null) => {
    if (newValue == null) {
        return
    }
    console.log('FolderListSection selected:', newValue)
    Utils.dir_slt_update(newValue)
})

function countFolders(items: DatType.DirTreeItem[]): number {
    let count = 0
    for (const item of items) {
        count++
        if (item.children && item.children.length > 0) {
            count += countFolders(item.children)
        }
    }
    return count
}

const totalFolderCount = computed(() => {
    return countFolders(dirTrees.value)
})
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

.folder-tree {
    width: 100%;
}

.folder-tree-section :deep(.folder-list) {
    padding-left: 0;
}

.folder-tree-section :deep(.dir-item) {
    padding: 4px 6px;
    margin: 2px 0;
}

.folder-tree-section :deep(.dir-item:hover) {
    background-color: var(--xc-background-color-hover);
    border-radius: var(--xc-border-radius-sm);
}

.folder-tree-section :deep(.dir-item.selected) {
    background-color: var(--xc-primary-color-light);
    border-radius: var(--xc-border-radius-sm);
}

.empty-folder {
    text-align: center;
    padding: var(--xc-spacing-md);
}

.empty-text {
    color: var(--xc-text-color-secondary);
    font-size: var(--xc-font-size-sm);
}
</style>
