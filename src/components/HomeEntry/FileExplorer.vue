<template>
    <div class="file-explorer" :class="{ 'sidebar-open': sidebarOpen }">
        <FileNavHeader class="file-nav-header" />

        <div class="main-content">
            <div class="file-content xc-scrollbar">
                <template v-for="catalog in fileCatalog" :key="catalog.name">
                    <div v-if="catalog.name.length">
                        <span style="color: aliceblue;">{{ catalog.name }}</span>
                        <hr>
                    </div>
                    <div class="file-grid" :class="`view-mode-${cardViewMode}`">
                        <template v-for="(item) in catalog.files" :key="item.id">
                            <ImageCard :item="item" />
                        </template>
                    </div>
                </template>
                <div class="file-grid" :class="`view-mode-${cardViewMode}`" v-if="!isAllPathSearch">
                    <template v-for="item in dirs" :key="item.id">
                        <FolderCard :item="item" />
                    </template>
                </div>
            </div>

            <FileSidebar 
                :visible="sidebarOpen"
                :selected-files="selectedFiles"
                :dirs="dirs"
                :is-all-path-search="isAllPathSearch"
                @close="sidebarOpen = false"
                @enter-folder="enterFolder"
            />
        </div>

        <div class="fab-container" :class="{ 'fab-sidebar-open': sidebarOpen }">
            <div v-if="fabMenuOpen" class="fab-menu">
                <div class="fab-menu-item" @click="openFileWithDefault" :class="{ 'disabled': !canOpenFile }">
                    <span class="fab-menu-icon">📂</span>
                    <span class="fab-menu-text">默认打开</span>
                </div>
                <div class="fab-menu-item" @click="aiTagDetect" :class="{ 'disabled': !canAITag }">
                    <span class="fab-menu-icon">🤖</span>
                    <span class="fab-menu-text">AI标签</span>
                </div>
                <div class="fab-menu-item" @click="toggleSidebar">
                    <span class="fab-menu-icon">{{ sidebarOpen ? '◀' : '▶' }}</span>
                    <span class="fab-menu-text">{{ sidebarOpen ? '收起面板' : '展开面板' }}</span>
                </div>
                <div class="fab-menu-item" @click="openCreateFolderDialog">
                    <span class="fab-menu-icon">📁</span>
                    <span class="fab-menu-text">创建文件夹</span>
                </div>
            </div>
            <button class="fab-button" @click="toggleFabMenu">
                <span :class="{ 'fab-icon-rotate': fabMenuOpen }">+</span>
            </button>
        </div>

        <div v-if="showCreateFolderDialog" class="dialog-overlay" @click="closeCreateFolderDialog">
            <div class="dialog-content" @click.stop>
                <h3>创建新文件夹</h3>
                <p class="current-path">当前位置: {{ currentPath }}</p>
                <input v-model="newFolderName" @keyup.enter="createNewFolder" placeholder="输入文件夹名称"
                    class="folder-name-input" ref="folderInputRef" maxlength="100" />
                <div class="dialog-actions">
                    <button @click="createNewFolder" class="confirm-btn" :disabled="!newFolderName.trim()">确定</button>
                    <button @click="closeCreateFolderDialog" class="cancel-btn">取消</button>
                </div>
            </div>
        </div>

        <FilePagination v-if="showPagination" class="file-pagination" />
        
        <FileOperationBar />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import FileNavHeader from '@/components/HomeEntry/FileExplorer/FileNavHeader.vue';
import ImageCard from '@/components/HomeEntry/FileExplorer/ImageCard.vue';
import FolderCard from '@/components/HomeEntry/FileExplorer/FolderCard.vue';
import FileOperationBar from '@/components/HomeEntry/FileExplorer/FileOperationBar.vue';
import FilePagination from '@/components/HomeEntry/FileExplorer/FilePagination.vue';
import FileSidebar from '@/components/HomeEntry/FileExplorer/FileSidebar/FileSidebar.vue';
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
import { ApiService } from '@/utils/apiService';
import type { AIStatus } from '@/utils/dataTypedef';
const appStore = useAppStore()
import '@/assets/common.css'
import Utils from '@/utils/utils';

const fileCatalog = ref<DatType.FileCatalog[]>([]);
const items = computed(() => appStore.curFiles);
watch([() => appStore.curFiles, () => appStore.fileShowType], () => {
    fileCatalog.value = Utils.files2Catalog()
})

const dirs = computed(() => appStore.curDirs);

const currentPath = computed(() => appStore.curPath);

const isAllPathSearch = computed(() => appStore.searchCon.pathType === 'allPath');

const cardViewMode = computed(() => appStore.cardViewMode);

const showPagination = computed(() => {
    const totalPages = Math.ceil(appStore.curFileTotal / appStore.searchCon.pageSize);
    return totalPages > 1;
});

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
            Utils.message_notify({ content: 'AI引擎不可用，请在设置中启用AI功能', type: 'warning' });
        } else {
            Utils.message_notify({ content: '请选择文件', type: 'warning' });
        }
        return;
    }

    fabMenuOpen.value = false;

    const fileIds = selectedFiles.value.map(f => f.id);
    try {
        const resp = await ApiService.aiTagDetect({ fileIds, topK: 5 });
        if (resp.code === 0) {
            if (resp.doing) {
                Utils.message_notify({ content: 'AI标签检测已开始', type: 'info' });
            } else {
                Utils.message_notify({ content: 'AI标签检测完成', type: 'success' });
            }
        } else {
            Utils.message_notify({ content: 'AI标签检测失败: ' + (resp.status || '未知错误'), type: 'error' });
        }
    } catch (error) {
        console.error('AI标签检测失败:', error);
        Utils.message_notify({ content: 'AI标签检测失败', type: 'error' });
    }
};

const sidebarOpen = ref(false);

function toggleSidebar() {
    fabMenuOpen.value = false;
    sidebarOpen.value = !sidebarOpen.value;
}

function enterFolder(dir: DatType.DirItem) {
    Utils.dir_slt_update(dir.path);
}

const openFileWithDefault = async () => {
    if (!canOpenFile.value) {
        Utils.message_notify({ 
            content: '请选择单个文件', 
            type: 'warning' 
        });
        return;
    }

    const file = selectedFiles.value[0];
    try {
        await Utils.fileOpenWithDefault(file.id);
        Utils.message_notify({ 
            content: '已使用默认软件打开文件', 
            type: 'success' 
        });
    } catch (error) {
        console.error('打开文件失败:', error);
        Utils.message_notify({ 
            content: '打开文件失败', 
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
        Utils.message_notify({ content: '文件夹名称不能为空', type: 'error' });
        return;
    }

    if (!appStore.curSltDirTreeItem) {
        Utils.message_notify({ content: '请先选择一个目录', type: 'error' });
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
        console.error('创建文件夹失败:', error);
        Utils.message_notify({ content: '创建文件夹失败', type: 'error' });
    }
};

const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        if (showCreateFolderDialog.value) {
            closeCreateFolderDialog();
        } else if (fabMenuOpen.value) {
            fabMenuOpen.value = false;
        } else if (sidebarOpen.value) {
            sidebarOpen.value = false;
        }
    }
};

document.addEventListener('keydown', handleEscKey);
</script>

<style scoped>
.file-explorer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
}

.file-nav-header {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: var(--xc-normal-height);
    flex-shrink: 0;
}

.main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.file-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    transition: margin-right var(--xc-transition-normal);
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.sidebar-open .file-content {
    margin-right: 0;
}

.file-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-md);
    padding: var(--xc-spacing-sm);
    align-content: flex-start;
}

.file-grid.view-mode-card {
    gap: var(--xc-spacing-md);
}

.file-grid.view-mode-tile {
    gap: 2px;
}

.file-grid.view-mode-adaptive {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--xc-spacing-xs);
}

.file-pagination {
    flex-shrink: 0;
    border-top: var(--xc-border);
    border-bottom: none;
}

.fab-container {
    position: absolute;
    bottom: calc(var(--xc-spacing-xl) + var(--xc-normal-height));
    right: var(--xc-spacing-xl);
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: var(--xc-spacing-sm);
    z-index: 100;
    transition: right var(--xc-transition-normal);
}

.fab-sidebar-open {
    right: calc(var(--xc-spacing-xl) + 280px);
}

.fab-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background-color: var(--xc-primary-color);
    color: white;
    font-size: var(--xc-font-size-xl);
    cursor: pointer;
    box-shadow: var(--xc-shadow-md);
    transition: all var(--xc-transition-normal);
    display: flex;
    align-items: center;
    justify-content: center;
}

.fab-button:hover {
    background-color: var(--xc-primary-color-hover);
    transform: scale(1.1);
}

.fab-icon-rotate {
    display: inline-block;
    transform: rotate(45deg);
    transition: transform var(--xc-transition-normal);
}

.fab-menu {
    display: flex;
    flex-direction: column;
    gap: var(--xc-spacing-xs);
}

.fab-menu-item {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-background-color-hover);
    border-radius: var(--xc-border-radius-md);
    cursor: pointer;
    box-shadow: var(--xc-shadow-sm);
    transition: all var(--xc-transition-normal);
}

.fab-menu-item:hover {
    background-color: var(--xc-primary-color);
    color: white;
}

.fab-menu-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.fab-menu-icon {
    font-size: var(--xc-font-size-md);
}

.fab-menu-text {
    font-size: var(--xc-font-size-md);
    white-space: nowrap;
}

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.dialog-content {
    background-color: var(--xc-background-color);
    padding: var(--xc-spacing-xl);
    border-radius: var(--xc-border-radius-md);
    box-shadow: var(--xc-shadow-lg);
    min-width: 300px;
    max-width: 500px;
}

.dialog-content h3 {
    margin: 0 0 var(--xc-spacing-md) 0;
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-lg);
}

.current-path {
    margin: 0 0 var(--xc-spacing-md) 0;
    color: var(--xc-text-color-secondary);
    font-size: var(--xc-font-size-sm);
}

.folder-name-input {
    width: 100%;
    padding: var(--xc-spacing-sm);
    margin-bottom: var(--xc-spacing-md);
    background-color: var(--xc-input-bg-color);
    border: 1px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-md);
    outline: none;
    transition: border-color var(--xc-transition-normal);
}

.folder-name-input:focus {
    border-color: var(--xc-input-border-color-focus);
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--xc-spacing-sm);
}

.confirm-btn,
.cancel-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    border-radius: var(--xc-border-radius-sm);
    font-size: var(--xc-font-size-md);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.confirm-btn {
    background-color: var(--xc-primary-color);
    color: white;
    border: none;
}

.confirm-btn:hover:not(:disabled) {
    background-color: var(--xc-primary-color-hover);
}

.confirm-btn:disabled {
    background-color: var(--xc-button-bg-color-disabled);
    color: var(--xc-button-text-color-disabled);
    cursor: not-allowed;
}

.cancel-btn {
    background-color: var(--xc-button-bg-color);
    color: var(--xc-button-text-color);
    border: 1px solid var(--xc-border-color);
}

.cancel-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}
</style>
