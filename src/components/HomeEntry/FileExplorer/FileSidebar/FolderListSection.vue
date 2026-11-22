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
import { logger } from '@/common/logger';
import Utils from '@/utils/utils'
import DirTreeItem from '@/components/HomeEntry/WorkPanel/DirTreeItem.vue'

const { t } = useI18n()
const appStore = useAppStore()

defineProps<{
    dirs: DatType.DirItem[];
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

const isNoFolder = (path: string) => {
    return !path || path === '/';
};

function findNodeByPath(nodes: DatType.DirTreeItem[], path: string): DatType.DirTreeItem | undefined {
    for (const node of nodes) {
        if (node.dirInfo.path === path) {
            return node;
        }
        if (node.children && node.children.length > 0) {
            const found = findNodeByPath(node.children, path);
            if (found) {
                return found;
            }
        }
    }
    return undefined;
}

// keep the tree selection in sync with the app state: the folder may be
// entered via folder card click or breadcrumb navigation as well
watch(() => appStore.curPath, (path) => {
    if (isNoFolder(path)) {
        selectedItem.value = null;
        return;
    }
    selectedItem.value = findNodeByPath(dirTrees.value, path) ?? null;
});

// selection/deselection from the tree itself:
// - select a folder -> browse files under it
// - deselect (click again / null) -> show all files
watch(selectedItem, (item) => {
    if (item == null) {
        if (!isNoFolder(appStore.curPath)) {
            logger.debug('FolderListSection deselected, show all files');
            appStore.curPath = '';
            appStore.curSltDirTreeItem = null;
            Utils.files_get(null);
        }
        return;
    }
    if (appStore.curPath === item.dirInfo.path) {
        return; // already in sync (e.g. set by the curPath watcher)
    }
    logger.debug('FolderListSection selected:', item)
    Utils.dir_slt_update(item)
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
