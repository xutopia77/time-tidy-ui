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
            <div v-if="fabMenuOpen" class="absolute bottom-14 right-0 flex flex-col gap-2 p-2 bg-bg-secondary rounded-lg border border-border shadow-lg">
                <div class="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-bg-elevated"
                    @click="openFileWithDefault"
                    :class="{ 'opacity-50 cursor-not-allowed': !canOpenFile }">
                    <span class="text-sm">📂</span>
                    <span class="text-sm whitespace-nowrap">{{ t('file.defaultOpen') }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-bg-elevated"
                    @click="aiTagDetect"
                    :class="{ 'opacity-50 cursor-not-allowed': !canAITag }">
                    <span class="text-sm">🤖</span>
                    <span class="text-sm whitespace-nowrap">{{ t('file.aiTag') }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-bg-elevated"
                    @click="toggleSidebar">
                    <span class="text-sm">{{ sidebarOpen ? '◀' : '▶' }}</span>
                    <span class="text-sm whitespace-nowrap">{{ sidebarOpen ? t('file.collapsePanel') : t('file.expandPanel') }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-bg-elevated"
                    @click="openCreateFolderDialog">
                    <span class="text-sm">📁</span>
                    <span class="text-sm whitespace-nowrap">{{ t('file.createFolder') }}</span>
                </div>
            </div>
            <button class="w-12 h-12 rounded-full bg-primary text-white border-none cursor-pointer shadow-lg transition-all duration-200 hover:bg-primary-hover"
                @click="toggleFabMenu">
                <span class="inline-block transition-transform duration-200"
                    :class="{ 'rotate-45': fabMenuOpen }">+</span>
            </button>
        </div>

        <div v-if="showCreateFolderDialog" 
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            @click="closeCreateFolderDialog">
            <div class="bg-bg-secondary p-5 rounded-lg shadow-lg min-w-[300px] max-w-[500px]"
                @click.stop>
                <h3 class="m-0 mb-3 text-text-primary text-base">{{ t('file.createNewFolder') }}</h3>
                <p class="m-0 mb-3 text-text-secondary text-sm">{{ t('file.currentLocation') }} {{ currentPath }}</p>
                <input v-model="newFolderName" @keyup.enter="createNewFolder" :placeholder="t('file.enterFolderName')"
                    class="w-full py-2 mb-3 bg-bg-tertiary border border-border rounded text-text-primary text-sm outline-none transition-colors duration-200 focus:border-primary"
                    ref="folderInputRef" maxlength="100" />
                <div class="flex justify-end gap-2">
                    <button @click="createNewFolder" 
                        class="py-1 px-3 rounded text-sm cursor-pointer transition-all duration-200 bg-primary text-white border-none hover:bg-primary-hover disabled:bg-bg-tertiary disabled:text-text-disabled disabled:cursor-not-allowed"
                        :disabled="!newFolderName.trim()">{{ t('common.confirm') }}</button>
                    <button @click="closeCreateFolderDialog" 
                        class="py-1 px-3 rounded text-sm cursor-pointer transition-all duration-200 bg-bg-elevated text-text-primary border border-border hover:bg-bg-tertiary">
                        {{ t('common.cancel') }}</button>
                </div>
            </div>
        </div>

        <FileOperationBar />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
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
        return appStore.cardWidth;
    }
    // card mode: image area + desc area
    return appStore.cardWidth + 60;
});

const cardGap = computed(() => {
    return cardViewMode.value === 'tile' ? 2 : 8;
});

const virtualScrollRef = ref<InstanceType<typeof VirtualScroll> | null>(null);
const scrollRatio = ref(0);

const onVirtualScroll = ({ ratio }: { ratio: number }) => {
    scrollRatio.value = ratio;
};

const onScrollToIndex = (index: number) => {
    virtualScrollRef.value?.scrollToItem(index);
};

const selectedFiles = computed(() => {
    return items.value.filter(item => item.checked);
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
        console.error('Failed to load AI status:', e);
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
        console.error('AI tag detection failed:', error);
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
        console.error('open file failed:', error);
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

function toggleFabMenu() {
    fabMenuOpen.value = !fabMenuOpen.value;
}

const showCreateFolderDialog = ref(false);
const newFolderName = ref('');
const folderInputRef = ref<HTMLInputElement | null>(null);

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
        console.log('createNewFolder req:', req)
        await Utils.dirCreate(req);
        closeCreateFolderDialog();
    } catch (error) {
        console.error('create folder failed:', error);
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
