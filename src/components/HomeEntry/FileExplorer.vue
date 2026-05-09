<template>
    <div class="file-explorer">
        <FileNavHeader class="file-nav-header" />

        <div class="file-content xc-scrollbar">
            <template v-for="catalog in fileCatalog" :key="catalog.name">
                <div v-if="catalog.name.length">
                    <span style="color: aliceblue;">{{ catalog.name }}</span>
                    <hr>
                </div>
                <div class="file-grid">
                    <template v-for="(item) in catalog.files" :key="item.id">
                        <ImageCard :item="item" />
                    </template>
                </div>
            </template>
            <div class="file-grid">
                <template v-for="item in dirs" :key="item.id">
                    <FolderCard :item="item" />
                </template>
            </div>
        </div>

        <div class="fab-container">
            <div v-if="fabMenuOpen" class="fab-menu">
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

        <FileFooter class="file-footer" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import FileNavHeader from '@/components/HomeEntry/FileExplorer/FileNavHeader.vue';
import ImageCard from '@/components/HomeEntry/FileExplorer/ImageCard.vue';
import FolderCard from '@/components/HomeEntry/FileExplorer/FolderCard.vue';
import FileFooter from '@/components/HomeEntry/FileExplorer/FileFooter.vue';
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
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

// 记录 Shift 键是否按下
const isShiftPressed = ref(false);
// 记录首次点击的 ImageCard 索引
const firstCheckedIndex = ref<number | null>(null);

// 监听 Shift 键按下和释放
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

// 监听 appStore.curFiles 中 checked 状态的变化
watch(() => items.value.map(item => item.checked), (newCheckedStates, oldValue) => {
    const changedIndex = newCheckedStates.findIndex((checked, index) => {
        // 找到状态改变的项
        return oldValue[index] !== checked;
    });

    const isChecked = newCheckedStates[changedIndex];
    if (changedIndex == -1) {
        // console.log('没有发现变化', changedIndex)
        return
    }

    if (!isShiftPressed.value) {
        // console.log('变化值', changedIndex, "没有按下Shift键", isChecked)
        firstCheckedIndex.value = null
        return
    }
    if (firstCheckedIndex.value === null) {
        // console.log('变化值', changedIndex, "按下Shift键，没有首个值, 设置首个值")
        firstCheckedIndex.value = changedIndex;
        return
    }

    if (firstCheckedIndex.value === changedIndex) {
        // console.log('变化值', changedIndex, "按下Shift键，值相等")
        return
    }

    const start = Math.min(firstCheckedIndex.value, changedIndex);
    const end = Math.max(firstCheckedIndex.value, changedIndex);
    // console.log('变化值', changedIndex, "按下Shift键，值相等，区间", start, end, "新值", isChecked)
    // console.log("======", newCheckedStates)
    for (let i = start; i <= end; i++) {
        items.value[i].checked = isChecked;
    }
}, { deep: true });

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
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

.file-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
}

.file-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-md);
    padding: var(--xc-spacing-sm);
    align-content: flex-start;
}

.file-footer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: var(--xc-normal-height);
    flex-shrink: 0;
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
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
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