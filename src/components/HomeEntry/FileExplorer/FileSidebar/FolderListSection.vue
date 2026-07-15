<template>
    <div class="py-3 border-b border-border">
        <h4 class="flex items-center gap-1 m-0 mb-3 text-base text-text-primary font-medium cursor-pointer select-none" @click="$emit('update:collapsed', !collapsed)">
            <span class="text-base transition-transform duration-200" :class="{ 'rotate-[-90deg]': collapsed }">▾</span>
            <span class="text-base">📁</span>
            {{ t('sidebar.folderList') }}
            <span class="text-text-secondary font-normal text-sm">({{ totalFolderCount }})</span>
        </h4>
        <div class="flex flex-col gap-2" v-if="!collapsed">
            <div class="w-full" v-if="dirTrees.length > 0">
                <DirTreeItem :data="dirTrees" v-model="selectedItem" />
            </div>
            <div v-else class="text-center py-3">
                <span class="text-text-secondary text-sm">{{ t('sidebar.noFolders') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore'
import Utils from '@/utils/utils'
import DirTreeItem from '@/components/HomeEntry/WorkPanel/DirTreeItem.vue'

const { t } = useI18n()
const appStore = useAppStore()

defineProps<{
    dirs: DatType.DirItem[];
    isAllPathSearch: boolean;
    collapsed: boolean;
}>()

defineEmits<{
    (e: 'enter-folder', dir: DatType.DirItem): void;
    (e: 'update:collapsed', value: boolean): void;
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
            content: t('sidebar.allPathSearchWarning'), 
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
