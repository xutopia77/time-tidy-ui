<template>
    <div class="trash-manager">
        <div class="manager-header">
            <div class="header-title">
                <DeleteThemes theme="outline" size="24" fill="currentColor" />
                <h2>回收站管理</h2>
            </div>
            <div class="header-actions">
                <button @click="loadTrashFiles()" class="action-btn">
                    <Refresh theme="outline" size="16" :strokeWidth="3" />
                    <span>刷新</span>
                </button>
                <button @click="restoreSelected" :disabled="selectedFiles.length === 0" class="action-btn primary">
                    <Undo theme="outline" size="16" :strokeWidth="3" />
                    <span>恢复选中 ({{ selectedFiles.length }})</span>
                </button>
                <button @click="deleteSelectedPermanently" :disabled="selectedFiles.length === 0" class="action-btn danger">
                    <Delete theme="outline" size="16" :strokeWidth="3" />
                    <span>永久删除 ({{ selectedFiles.length }})</span>
                </button>
                <button @click="emptyTrash" :disabled="trashFiles.length === 0" class="action-btn danger">
                    <Clear theme="outline" size="16" :strokeWidth="3" />
                    <span>清空回收站</span>
                </button>
            </div>
        </div>

        <div class="manager-status">
            <div class="status-item">
                <span class="status-label">回收站文件:</span>
                <span class="status-value">{{ totalFiles }} 个</span>
            </div>
            <div class="status-item">
                <span class="status-label">占用空间:</span>
                <span class="status-value">{{ Utils.gen_size_str(totalSize) }}</span>
            </div>
            <div class="status-item">
                <span class="status-label">已选中:</span>
                <span class="status-value">{{ selectedFiles.length }} 个</span>
            </div>
        </div>

        <div class="trash-content xc-scrollbar">
            <div v-if="trashFiles.length === 0" class="empty-state">
                <DeleteThemes theme="outline" size="64" fill="currentColor" class="empty-icon" />
                <p class="empty-title">回收站为空</p>
                <p class="empty-desc">删除的文件将显示在这里</p>
            </div>

            <div v-else class="file-grid">
                <div v-for="file in trashFiles" :key="file.id" class="file-card"
                    :class="{ 'selected': file.checked }">
                    <div class="file-checkbox">
                        <input type="checkbox" v-model="file.checked" @change="updateSelection" />
                    </div>
                    <div class="file-thumbnail-container" @click="previewFile(file)">
                        <img v-if="file.type === 'image' || file.type === 'video'" 
                            :src="Utils.get_thumbnail_url(file.id)" :alt="file.name" class="file-thumbnail" />
                        <div v-else class="file-icon-container">
                            <FileDoc theme="outline" size="48" fill="currentColor" />
                        </div>
                    </div>
                    <div class="file-info">
                        <div class="file-name" :title="file.name">{{ file.name }}</div>
                        <div class="file-meta">
                            <span>{{ Utils.gen_size_str(file.size) }}</span>
                            <span>{{ file.create_time }}</span>
                        </div>
                        <div class="file-path" :title="file.path">{{ file.path }}</div>
                    </div>
                    <div class="file-actions">
                        <button @click="restoreFile(file)" class="file-action-btn" title="恢复">
                            <Undo theme="outline" size="16" />
                        </button>
                        <button @click="previewFile(file)" class="file-action-btn" title="预览">
                            <ViewList theme="outline" size="16" />
                        </button>
                        <button @click="deleteFilePermanently(file)" class="file-action-btn danger" title="永久删除">
                            <Delete theme="outline" size="16" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="totalFiles > 0" class="pagination-section">
            <div class="pagination-info">
                共 {{ totalFiles }} 个文件
            </div>
            <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
                    上一页
                </button>
                <span class="pagination-current">第 {{ currentPage }} 页</span>
                <button @click="nextPage" :disabled="currentPage * pageSize >= totalFiles" class="pagination-btn">
                    下一页
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import '@/assets/common.css';
import { DeleteThemes, Refresh, Undo, Delete, Clear, ViewList, FileDoc } from '@icon-park/vue-next';

const appStore = useAppStore();

const trashFiles = ref<DatType.File[]>([]);
const currentPage = ref(1);
const pageSize = ref(50);
const totalFiles = ref(0);
const totalSize = ref(0);

const selectedFiles = computed(() => {
    return trashFiles.value.filter(f => f.checked);
});

const loadTrashFiles = async (page = 1) => {
    try {
        const req = new DatType.FilesGetReq();
        req.page = page - 1;
        req.pageSize = pageSize.value;
        req.statuss = [2]; // FileStatus_Trash = 2

        const response = await Utils.files_get(req, false);
        
        if (response.code === 0 && response.data) {
            const data = response.data as { files?: { records?: DatType.File[]; total?: number } };
            
            if (data.files && data.files.records) {
                trashFiles.value = data.files.records.map((file: DatType.File) => ({
                    ...file,
                    checked: false
                }));
                totalFiles.value = data.files.total || 0;
            } else {
                trashFiles.value = [];
                totalFiles.value = 0;
            }
            
            calculateTotalSize();
            currentPage.value = page;
        } else {
            Utils.addToast(response.status || '加载回收站失败');
        }
    } catch (error) {
        console.error('加载回收站失败:', error);
        Utils.addToast('加载回收站失败');
    }
};

const calculateTotalSize = () => {
    totalSize.value = trashFiles.value.reduce((sum, file) => sum + file.size, 0);
};

const updateSelection = () => {
    // Selection is automatically updated through computed property
};

const previewFile = (file: DatType.File) => {
    appStore.curSltFile = file;
    appStore.curFiles = [file];
    appStore.bPageImgView = true;
};

const restoreFile = async (file: DatType.File) => {
    if (!confirm(`确定要恢复文件 "${file.name}" 吗？`)) {
        return;
    }

    const response = await Utils.files_restore([file.id]);
    
    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast('文件恢复成功');
    }
};

const restoreSelected = async () => {
    const files = selectedFiles.value;
    if (files.length === 0) {
        Utils.addToast('请选择要恢复的文件');
        return;
    }

    if (!confirm(`确定要恢复选中的 ${files.length} 个文件吗？`)) {
        return;
    }

    const response = await Utils.files_restore(files.map(f => f.id));
    
    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast(`成功恢复 ${files.length} 个文件`);
    }
};

const deleteFilePermanently = async (file: DatType.File) => {
    if (!confirm(`确定要永久删除文件 "${file.name}" 吗？此操作不可恢复！`)) {
        return;
    }

    const req = new DatType.FileDeleteReq();
    req.fileIds = [file.id];
    req.bRemoveToDtrash = false;

    const response = await Utils.files_delete(req);
    
    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast('文件已永久删除');
    }
};

const deleteSelectedPermanently = async () => {
    const files = selectedFiles.value;
    if (files.length === 0) {
        Utils.addToast('请选择要删除的文件');
        return;
    }

    if (!confirm(`确定要永久删除选中的 ${files.length} 个文件吗？此操作不可恢复！`)) {
        return;
    }

    const req = new DatType.FileDeleteReq();
    req.fileIds = files.map(f => f.id);
    req.bRemoveToDtrash = false;

    const response = await Utils.files_delete(req);
    
    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast(`成功删除 ${files.length} 个文件`);
    }
};

const emptyTrash = async () => {
    if (!confirm('确定要清空回收站吗？此操作将永久删除所有文件，不可恢复！')) {
        return;
    }

    try {
        const req = new DatType.FilesGetReq();
        req.page = 0;
        req.pageSize = 10000;
        req.statuss = [2];

        const response = await Utils.files_get(req, false);
        
        if (response.code === 0 && response.data) {
            const data = response.data as { files?: { records?: DatType.File[] } };
            const allFileIds = data.files?.records?.map((f: DatType.File) => f.id) || [];
            
            if (allFileIds.length === 0) {
                Utils.addToast('回收站已为空');
                return;
            }

            const deleteReq = new DatType.FileDeleteReq();
            deleteReq.fileIds = allFileIds;
            deleteReq.bRemoveToDtrash = false;

            const deleteResponse = await Utils.files_delete(deleteReq);
            
            if (deleteResponse.code === 0) {
                await loadTrashFiles(1);
                Utils.addToast('回收站已清空');
            }
        }
    } catch (error) {
        console.error('清空回收站失败:', error);
        Utils.addToast('清空回收站失败');
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        loadTrashFiles(currentPage.value - 1);
    }
};

const nextPage = () => {
    if (currentPage.value * pageSize.value < totalFiles.value) {
        loadTrashFiles(currentPage.value + 1);
    }
};

onMounted(() => {
    loadTrashFiles();
});
</script>

<style scoped>
.trash-manager {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--xc-background-color);
}

.manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-lg) var(--xc-spacing-xl);
    border-bottom: var(--xc-border);
    background-color: var(--xc-background-color);
    flex-wrap: wrap;
    gap: var(--xc-spacing-sm);
}

.header-title {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.header-title h2 {
    margin: 0;
    font-size: var(--xc-font-size-xl);
    font-weight: 600;
    color: var(--xc-text-color);
}

.header-actions {
    display: flex;
    gap: var(--xc-spacing-sm);
    flex-wrap: wrap;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.action-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.action-btn.primary {
    background-color: var(--xc-primary-color);
    border-color: var(--xc-primary-color);
    color: white;
}

.action-btn.primary:hover {
    background-color: var(--xc-primary-color-hover);
}

.action-btn.danger {
    background-color: var(--xc-danger-color);
    border-color: var(--xc-danger-color);
    color: white;
}

.action-btn.danger:hover {
    background-color: var(--xc-danger-color-hover);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.manager-status {
    display: flex;
    gap: var(--xc-spacing-lg);
    padding: var(--xc-spacing-md) var(--xc-spacing-xl);
    border-bottom: var(--xc-border);
    background-color: var(--xc-background-color);
    flex-wrap: wrap;
}

.status-item {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
}

.status-label {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.status-value {
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    color: var(--xc-text-color);
}

.trash-content {
    flex: 1;
    padding: var(--xc-spacing-lg);
    overflow-y: auto;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--xc-text-color-secondary);
}

.empty-icon {
    opacity: 0.3;
    margin-bottom: var(--xc-spacing-md);
}

.empty-title {
    font-size: var(--xc-font-size-lg);
    font-weight: 500;
    margin: 0 0 var(--xc-spacing-xs) 0;
}

.empty-desc {
    font-size: var(--xc-font-size-sm);
    margin: 0;
    opacity: 0.7;
}

.file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--xc-spacing-md);
}

.file-card {
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    overflow: hidden;
    transition: all var(--xc-transition-normal);
    position: relative;
}

.file-card:hover {
    border-color: var(--xc-primary-color);
    box-shadow: var(--xc-shadow-sm);
}

.file-card.selected {
    border-color: var(--xc-primary-color);
    background-color: var(--xc-primary-color-light);
}

.file-checkbox {
    position: absolute;
    top: var(--xc-spacing-xs);
    left: var(--xc-spacing-xs);
    z-index: 10;
}

.file-checkbox input {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.file-thumbnail-container {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--xc-background-color-hover);
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.file-thumbnail {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.file-icon-container {
    color: var(--xc-text-color-secondary);
}

.file-info {
    padding: var(--xc-spacing-sm);
}

.file-name {
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    color: var(--xc-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: var(--xc-spacing-xs);
}

.file-meta {
    display: flex;
    justify-content: space-between;
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
    margin-bottom: var(--xc-spacing-xs);
}

.file-path {
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm) var(--xc-spacing-sm);
    border-top: 1px solid var(--xc-border-color);
}

.file-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.file-action-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.file-action-btn.danger:hover {
    background-color: var(--xc-danger-color);
    border-color: var(--xc-danger-color);
    color: white;
}

.pagination-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-md) var(--xc-spacing-xl);
    border-top: var(--xc-border);
    background-color: var(--xc-background-color);
}

.pagination-info {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.pagination-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.pagination-btn:hover:not(:disabled) {
    background-color: var(--xc-button-bg-color-hover);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-current {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color);
}
</style>
