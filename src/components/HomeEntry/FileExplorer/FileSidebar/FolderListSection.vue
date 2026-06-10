<template>
    <div class="py-3 border-b border-border">
        <h4 class="flex items-center gap-1 m-0 mb-3 text-base text-text-primary font-medium">
            <span class="text-base">📁</span>
            文件夹列表
            <span class="text-text-secondary font-normal text-sm">({{ totalFolderCount }})</span>
        </h4>
        <div class="flex flex-col gap-2">
            <div class="w-full" v-if="dirTrees.length > 0">
                <DirTreeItem :data="dirTrees" v-model="selectedItem" />
            </div>
            <div v-else class="text-center py-3">
                <span class="text-text-secondary text-sm">暂无文件夹</span>
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
    if (appStore.searchCon.pathType === 'allPath') {
        Utils.message_notify({ 
            content: '当前为全部文件搜索模式，无法跳转文件夹', 
            type: 'warning' 
        });
        return;
    }
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
.folder-tree-section :deep(.dir-item) {
    padding: 4px 6px;
    margin: 2px 0;
}

.folder-tree-section :deep(.dir-item:hover) {
    background-color: var(--color-bg-tertiary);
    border-radius: 2px;
}

.folder-tree-section :deep(.dir-item.selected) {
    background-color: rgba(99, 102, 241, 0.1);
    border-radius: 2px;
}
</style>
