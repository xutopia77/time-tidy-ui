<!-- <template>
    <div class="file-explorer">
        <FileNavHeader class="file-nav-header" />

        <div class="file-content xc-scrollbar">
            <div class="file-grid">
                <template v-for="(item) in items" :key="item.id">
                    <ImageCard :item="item" />
                </template>
            </div>
            <span style="color: aliceblue;">asdasdas</span>
            <hr />
            <div class="file-grid">
                <template v-for="item in dirs" :key="item.id">
                    <FolderCard :item="item" />
                </template>
            </div>
        </div>
        <FileFooter class="file-footer" />
    </div>
</template> -->

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
}

.file-nav-header {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 32px;
    /* background-color: aquamarine; */
}

.file-grid---delete {
    padding: 0px;
    margin: 0px;
    /* display: flex;
    flex-wrap: wrap; */

    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    height: calc(100% - 32px - 32px);
    /* background-color: bisque; */
}



.file-grid---1 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2px;
    /* margin-top: 20px; */
    height: calc(100% - 32px - 32px);
}

.file-grid---2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, auto));
    gap: 15px;
    height: calc(100% - 32px - 32px);
    padding: 10px;
}

.file-content {
    height: calc(100% - 32px - 32px);
}

.file-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    /* height: calc(100% - 32px - 32px - 20px); */
    padding: 10px;
    align-content: flex-start;
    /* overflow-y: auto; */
}



/* .file-grid hr {
    display: block;
    margin: 10px 0;
    border: none;
    border-top: 1px solid #ccc;
    width: 100%;
} */


.file-footer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 32px;
}

.fab-container {
    position: absolute;
    bottom: 52px;
    right: 20px;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 10px;
    z-index: 100;
}

.fab-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background-color: var(--xc-primary-color, #4A6FA5);
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fab-button:hover {
    background-color: var(--xc-primary-color-hover, #3d5a80);
    transform: scale(1.1);
}

.fab-icon-rotate {
    display: inline-block;
    transform: rotate(45deg);
    transition: transform 0.3s ease;
}

.fab-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.fab-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: var(--xc-background-color-hover, #2a2a2a);
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.fab-menu-item:hover {
    background-color: var(--xc-primary-color, #4A6FA5);
    color: white;
}

.fab-menu-icon {
    font-size: 16px;
}

.fab-menu-text {
    font-size: 14px;
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
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 400px;
}

.dialog-content h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: var(--xc-text-color);
}

.current-path {
    margin: 10px 0;
    padding: 8px;
    background-color: var(--xc-background-color-hover);
    border-radius: 4px;
    font-size: 14px;
    color: var(--xc-text-color-secondary);
    word-break: break-all;
}

.folder-name-input {
    width: 100%;
    padding: 8px 12px;
    border: var(--xc-border);
    border-radius: 4px;
    background-color: var(--xc-input-bg-color);
    color: var(--xc-text-color);
    margin-bottom: 15px;
    box-sizing: border-box;
    font-size: 14px;
}

.folder-name-input:focus {
    outline: none;
    border-color: var(--xc-primary-color);
}

.dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.confirm-btn {
    background-color: var(--xc-primary-color);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.confirm-btn:hover:not(:disabled) {
    background-color: var(--xc-primary-color-hover);
}

.confirm-btn:disabled {
    background-color: var(--xc-button-bg-color-disabled);
    cursor: not-allowed;
}

.cancel-btn {
    background-color: var(--xc-button-bg-color);
    color: var(--xc-text-color);
    border: var(--xc-border);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}
</style>