<template>
    <div class="p-0 m-0 w-full h-full relative flex flex-col">
        <FileNavHeader class="p-0 m-0 w-full h-[50px] flex-shrink-0 border-b border-border" />

        <div class="flex-1 flex min-h-0 relative">
            <div class="flex-1 min-w-0 h-full">
                <VirtualScroll
                    ref="virtualScrollRef"
                    :items="virtualScrollItems"
                    :item-width="cardItemWidth"
                    :row-height="cardRowHeight"
                    :gap="cardGap"
                    :buffer-rows="3"
                    @scroll="onVirtualScroll">
                    <template #item="{ item }">
                        <FolderCard v-if="isDirItem(item)" :item="(item as DatType.DirItem)" />
                        <ImageCard v-else :item="(item as DatType.File)" />
                    </template>
                </VirtualScroll>
            </div>

            <TimelineBar :items="virtualScrollItems" :scroll-ratio="scrollRatio" @scroll-to-index="onScrollToIndex" />

            <FileSidebar 
                :visible="sidebarOpen"
                :selected-files="selectedFiles"
                :dirs="dirs"
                :is-all-path-search="isAllPathSearch"
                @close="appStore.sidebarOpen = false"
                @enter-folder="enterFolder"
            />
        </div>

        <div class="fixed bottom-5 right-5 z-[100]"
            :class="{ 'right-[340px]': sidebarOpen }">
            <n-dropdown trigger="click" placement="top-end" :options="fabOptions"
                @select="onFabSelect" @update:show="(v: boolean) => fabMenuOpen = v">
                <n-button circle type="primary" size="large" class="w-12 h-12">
                    <span class="inline-block transition-transform duration-200"
                        :class="{ 'rotate-45': fabMenuOpen }">+</span>
                </n-button>
            </n-dropdown>
        </div>

        <n-modal v-model:show="showCreateFolderDialog" preset="card" :title="t('file.createNewFolder')"
            class="w-[420px] max-w-[90vw]">
            <p class="m-0 mb-3 text-text-secondary text-sm">{{ t('file.currentLocation') }} {{ currentPath }}</p>
            <n-input v-model:value="newFolderName" ref="folderInputRef" :placeholder="t('file.enterFolderName')"
                maxlength="100" @keyup.enter="createNewFolder" />
            <template #footer>
                <div class="flex justify-end gap-2">
                    <n-button @click="closeCreateFolderDialog">{{ t('common.cancel') }}</n-button>
                    <n-button type="primary" :disabled="!newFolderName.trim()" @click="createNewFolder">
                        {{ t('common.confirm') }}</n-button>
                </div>
            </template>
        </n-modal>

        <FileOperationBar />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { NDropdown, NButton, NModal, NInput, NIcon } from 'naive-ui';
import type { DropdownOption } from 'naive-ui';
import { FileDoc, Robot, Left, Right, Folder } from '@icon-park/vue-next';
import FileNavHeader from '@/components/HomeEntry/FileExplorer/FileNavHeader.vue';
import ImageCard from '@/components/HomeEntry/FileExplorer/ImageCard.vue';
import FolderCard from '@/components/HomeEntry/FileExplorer/FolderCard.vue';
import FileOperationBar from '@/components/HomeEntry/FileExplorer/FileOperationBar.vue';
import FileSidebar from '@/components/HomeEntry/FileExplorer/FileSidebar/FileSidebar.vue';
import VirtualScroll from '@/components/HomeEntry/FileExplorer/VirtualScroll.vue';
import TimelineBar from '@/components/HomeEntry/FileExplorer/TimelineBar.vue';
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
import { ApiService } from '@/utils/apiService';
import type { AIStatus } from '@/utils/dataTypedef';
const appStore = useAppStore()
const { t } = useI18n();
import '@/assets/common.css'
import Utils from '@/utils/utils';
import { filterCheckedFiles } from '@/common/selection';
import { logger } from '@/common/logger';

const items = computed(() => appStore.curFiles);
const dirs = computed(() => appStore.curDirs);
const currentPath = computed(() => appStore.curPath);
const isAllPathSearch = computed(() => appStore.searchCon.pathType === 'allPath');
const cardViewMode = computed(() => appStore.cardViewMode);

// virtual scroll items: dirs first, then files
const virtualScrollItems = computed(() => {
    const result: Array<DatType.DirItem | DatType.File> = [];
    if (!isAllPathSearch.value) {
        for (const dir of dirs.value) {
            result.push(dir);
        }
    }
    for (const file of items.value) {
        result.push(file);
    }
    return result;
});

function isDirItem(item: unknown): boolean {
    return typeof item === 'object' && item !== null && 'dir' in item;
}

// card dimensions for virtual scroll
const cardItemWidth = computed(() => {
    return appStore.cardWidth;
});

const cardRowHeight = computed(() => {
    if (cardViewMode.value === 'tile') {
        return appStore.cardHeight;
    }
    // card mode: image area + desc area (filename 1 line + meta 1 line + tags up to 2 lines + padding)
    return appStore.cardHeight + 74;
});

const cardGap = computed(() => {
    return cardViewMode.value === 'tile' ? 2 : 8;
});

const virtualScrollRef = ref<InstanceType<typeof VirtualScroll> | null>(null);
const scrollRatio = ref(0);

const onVirtualScroll = ({ ratio }: { ratio: number }) => {
    scrollRatio.value = ratio;
};

// back to top when navigating to a new folder or changing search conditions
watch([() => appStore.curPath, () => appStore.searchCon], () => {
    virtualScrollRef.value?.scrollToTop();
}, { deep: true });

const onScrollToIndex = (index: number) => {
    virtualScrollRef.value?.scrollToItem(index);
};

const selectedFiles = computed(() => {
    return filterCheckedFiles(items.value);
});

const canOpenFile = computed(() => {
    return selectedFiles.value.length === 1;
});

const aiStatus = ref<AIStatus | null>(null);

const canAITag = computed(() => {
    return selectedFiles.value.length > 0 && aiStatus.value?.available === true;
});

const loadAIStatus = async () => {
    try {
        const resp = await ApiService.aiStatus();
        if (resp.code === 0 && resp.data) {
            aiStatus.value = resp.data as AIStatus;
        }
    } catch (e) {
        logger.error('Failed to load AI status:', e);
    }
};

const aiTagDetect = async () => {
    if (!canAITag.value) {
        if (!aiStatus.value?.available) {
            Utils.message_notify({ content: t('message.aiNotAvailable'), type: 'warning' });
        } else {
            Utils.message_notify({ content: t('file.selectFile'), type: 'warning' });
        }
        return;
    }

    fabMenuOpen.value = false;

    const fileIds = selectedFiles.value.map(f => f.id);
    try {
        const resp = await ApiService.aiTagDetect({ fileIds, topK: 5 });
        if (resp.code === 0) {
            if (resp.doing) {
                Utils.message_notify({ content: t('message.aiDetectionStarted'), type: 'info' });
            } else {
                Utils.message_notify({ content: t('message.aiDetectionCompleted'), type: 'success' });
            }
        } else {
            Utils.message_notify({ content: t('file.aiTagDetectFailed') + ': ' + (resp.status || ''), type: 'error' });
        }
    } catch (error) {
        logger.error('AI tag detection failed:', error);
        Utils.message_notify({ content: t('message.aiDetectionFailed'), type: 'error' });
    }
};

const sidebarOpen = computed(() => appStore.sidebarOpen);

function toggleSidebar() {
    fabMenuOpen.value = false;
    appStore.sidebarOpen = !appStore.sidebarOpen;
}

function enterFolder(dir: DatType.DirItem) {
    Utils.dir_slt_update(dir.path);
}

const openFileWithDefault = async () => {
    if (!canOpenFile.value) {
        Utils.message_notify({ 
            content: t('file.selectSingleFile'), 
            type: 'warning' 
        });
        return;
    }

    const file = selectedFiles.value[0];
    try {
        await Utils.fileOpenWithDefault(file.id);
        Utils.message_notify({ 
            content: t('file.fileOpened'), 
            type: 'success' 
        });
    } catch (error) {
        logger.error('open file failed:', error);
        Utils.message_notify({ 
            content: t('file.openFileFailed'), 
            type: 'error' 
        });
    }
};

const isShiftPressed = ref(false);
const firstCheckedIndex = ref<number | null>(null);

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
        isShiftPressed.value = true;
    }
};

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
        isShiftPressed.value = false;
        firstCheckedIndex.value = null
    }
};

const handleMouseDown = () => {
    if (!isShiftPressed.value) {
        firstCheckedIndex.value = null;
    }
};

watch(() => items.value.map(item => item.checked), (newCheckedStates, oldValue) => {
    const changedIndex = newCheckedStates.findIndex((checked, index) => {
        return oldValue[index] !== checked;
    });

    const isChecked = newCheckedStates[changedIndex];
    if (changedIndex == -1) {
        return
    }

    if (!isShiftPressed.value) {
        return
    }
    if (firstCheckedIndex.value === null) {
        firstCheckedIndex.value = changedIndex;
        return
    }

    if (firstCheckedIndex.value === changedIndex) {
        return
    }

    const start = Math.min(firstCheckedIndex.value, changedIndex);
    const end = Math.max(firstCheckedIndex.value, changedIndex);
    for (let i = start; i <= end; i++) {
        items.value[i].checked = isChecked;
    }
}, { deep: true });

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    
    Utils.files_get();
    loadAIStatus();
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('keydown', handleEscKey);
});

const fabMenuOpen = ref(false);

function renderFabIcon(icon: unknown) {
    return () => h(NIcon, null, { default: () => h(icon as Parameters<typeof h>[0]) });
}

const fabOptions = computed<DropdownOption[]>(() => [
    { key: 'open', label: t('file.defaultOpen'), icon: renderFabIcon(FileDoc), disabled: !canOpenFile.value },
    { key: 'ai', label: t('file.aiTag'), icon: renderFabIcon(Robot), disabled: !canAITag.value },
    {
        key: 'sidebar',
        label: sidebarOpen.value ? t('file.collapsePanel') : t('file.expandPanel'),
        icon: renderFabIcon(sidebarOpen.value ? Left : Right),
    },
    { key: 'folder', label: t('file.createFolder'), icon: renderFabIcon(Folder) },
]);

const onFabSelect = (key: string | number) => {
    switch (key) {
        case 'open': openFileWithDefault(); break;
        case 'ai': aiTagDetect(); break;
        case 'sidebar': toggleSidebar(); break;
        case 'folder': openCreateFolderDialog(); break;
    }
};

const showCreateFolderDialog = ref(false);
const newFolderName = ref('');
const folderInputRef = ref<{ focus: () => void } | null>(null);

const openCreateFolderDialog = async () => {
    fabMenuOpen.value = false;
    showCreateFolderDialog.value = true;
    newFolderName.value = '';

    await nextTick();
    if (folderInputRef.value) {
        folderInputRef.value.focus();
    }
};

const closeCreateFolderDialog = () => {
    showCreateFolderDialog.value = false;
    newFolderName.value = '';
};

const createNewFolder = async () => {
    if (!newFolderName.value.trim()) {
        Utils.message_notify({ content: t('file.folderNameEmpty'), type: 'error' });
        return;
    }

    if (!appStore.curSltDirTreeItem) {
        Utils.message_notify({ content: t('file.selectDirFirst'), type: 'error' });
        return;
    }

    try {
        const req = new DatType.DirCreateReq();
        req.parentDirId = appStore.curSltDirTreeItem.dirInfo.dir.id;
        req.path = appStore.curSltDirTreeItem.dirInfo.dir.path + '/' + newFolderName.value.trim();
        req.type = 1;
        req.description = "";
        logger.debug('createNewFolder req:', req)
        await Utils.dirCreate(req);
        closeCreateFolderDialog();
    } catch (error) {
        logger.error('create folder failed:', error);
        Utils.message_notify({ content: t('file.createFolderFailed'), type: 'error' });
    }
};

const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        if (showCreateFolderDialog.value) {
            closeCreateFolderDialog();
        } else if (fabMenuOpen.value) {
            fabMenuOpen.value = false;
        } else if (sidebarOpen.value) {
            appStore.sidebarOpen = false;
        }
    }
};

document.addEventListener('keydown', handleEscKey);
</script>
