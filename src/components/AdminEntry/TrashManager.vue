<template>
    <div class="trash-manager">
        <div class="manager-header">
            <div class="header-title">
                <DeleteThemes theme="outline" size="24" fill="currentColor" />
                <h2>{{ t('trash.manage') }}</h2>
            </div>
            <div class="header-actions">
                <button @click="loadTrashFiles()" class="action-btn">
                    <Refresh theme="outline" size="16" :strokeWidth="3" />
                    <span>{{ t('trash.refresh') }}</span>
                </button>
                <button @click="restoreSelected" :disabled="selectedFiles.length === 0" class="action-btn primary">
                    <Undo theme="outline" size="16" :strokeWidth="3" />
                    <span>{{ t('trash.restoreSelected') }} ({{ selectedFiles.length }})</span>
                </button>
                <button @click="deleteSelectedPermanently" :disabled="selectedFiles.length === 0" class="action-btn danger">
                    <Delete theme="outline" size="16" :strokeWidth="3" />
                    <span>{{ t('trash.deletePermanently') }} ({{ selectedFiles.length }})</span>
                </button>
                <button @click="emptyTrash" :disabled="trashFiles.length === 0" class="action-btn danger">
                    <Clear theme="outline" size="16" :strokeWidth="3" />
                    <span>{{ t('trash.emptyTrash') }}</span>
                </button>
            </div>
        </div>

        <div class="manager-status">
            <div class="status-item">
                <span class="status-label">{{ t('trash.trashFiles') }}:</span>
                <span class="status-value">{{ totalFiles }} {{ t('trash.totalFiles') }}</span>
            </div>
            <div class="status-item">
                <span class="status-label">{{ t('trash.occupiedSpace') }}:</span>
                <span class="status-value">{{ Utils.gen_size_str(totalSize) }}</span>
            </div>
            <div class="status-item">
                <span class="status-label">{{ t('trash.selected') }}:</span>
                <span class="status-value">{{ selectedFiles.length }} {{ t('trash.totalFiles') }}</span>
            </div>
        </div>

        <div class="trash-content xc-scrollbar">
            <div v-if="trashFiles.length === 0" class="empty-state">
                <DeleteThemes theme="outline" size="64" fill="currentColor" class="empty-icon" />
                <p class="empty-title">{{ t('trash.empty') }}</p>
                <p class="empty-desc">{{ t('trash.deletedFilesShow') }}</p>
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
                        <button @click="restoreFile(file)" class="file-action-btn" :title="t('trash.restore')">
                            <Undo theme="outline" size="16" />
                        </button>
                        <button @click="previewFile(file)" class="file-action-btn" :title="t('similarity.preview')">
                            <ViewList theme="outline" size="16" />
                        </button>
                        <button @click="deleteFilePermanently(file)" class="file-action-btn danger" :title="t('trash.deletePermanently')">
                            <Delete theme="outline" size="16" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="totalFiles > 0" class="pagination-section">
            <div class="pagination-info">
                {{ t('common.all') }} {{ totalFiles }} {{ t('trash.totalFiles') }}
            </div>
            <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
                    {{ t('trash.prevPage') }}
                </button>
                <span class="pagination-current">{{ t('trash.page') }} {{ currentPage }} {{ t('similarity.page') }}</span>
                <button @click="nextPage" :disabled="currentPage * pageSize >= totalFiles" class="pagination-btn">
                    {{ t('trash.nextPage') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import '@/assets/common.css';
import { DeleteThemes, Refresh, Undo, Delete, Clear, ViewList, FileDoc } from '@icon-park/vue-next';

const { t } = useI18n();
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
            Utils.addToast(response.status || t('trash.loadTrashFailed'));
        }
    } catch (error) {
        console.error('加载回收站失败:', error);
        Utils.addToast(t('trash.loadTrashFailed'));
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
    if (!confirm(`${t('trash.confirmRestore')} "${file.name}"?`)) {
        return;
    }

    const response = await Utils.files_restore([file.id]);

    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast(t('trash.restoreSuccess'));
    }
};

const restoreSelected = async () => {
    const files = selectedFiles.value;
    if (files.length === 0) {
        Utils.addToast(t('trash.selectFilesToRestore'));
        return;
    }

    if (!confirm(`${t('trash.confirmRestoreSelected')} ${files.length} ${t('trash.totalFiles')}?`)) {
        return;
    }

    const response = await Utils.files_restore(files.map(f => f.id));

    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast(`${t('trash.restoreSuccessCount')} ${files.length} ${t('trash.totalFiles')}`);
    }
};

const deleteFilePermanently = async (file: DatType.File) => {
    if (!confirm(`${t('trash.confirmDeletePermanently')} "${file.name}"? ${t('trash.permanentDeleteWarning')}`)) {
        return;
    }

    const req = new DatType.FileDeleteReq();
    req.fileIds = [file.id];
    req.bRemoveToDtrash = false;

    const response = await Utils.files_delete(req);

    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast(t('trash.fileDeletedPermanently'));
    }
};

const deleteSelectedPermanently = async () => {
    const files = selectedFiles.value;
    if (files.length === 0) {
        Utils.addToast(t('trash.selectFilesToDelete'));
        return;
    }

    if (!confirm(`${t('trash.confirmDeleteSelectedPermanently')} ${files.length} ${t('trash.totalFiles')}? ${t('trash.permanentDeleteWarning')}`)) {
        return;
    }

    const req = new DatType.FileDeleteReq();
    req.fileIds = files.map(f => f.id);
    req.bRemoveToDtrash = false;

    const response = await Utils.files_delete(req);

    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast(`${t('trash.deleteSuccessCount')} ${files.length} ${t('trash.totalFiles')}`);
    }
};

const emptyTrash = async () => {
    if (!confirm(t('trash.confirmEmptyTrash'))) {
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
                Utils.addToast(t('trash.trashAlreadyEmpty'));
                return;
            }

            const deleteReq = new DatType.FileDeleteReq();
            deleteReq.fileIds = allFileIds;
            deleteReq.bRemoveToDtrash = false;

            const deleteResponse = await Utils.files_delete(deleteReq);

            if (deleteResponse.code === 0) {
                await loadTrashFiles(1);
                Utils.addToast(t('trash.trashEmptied'));
            }
        }
    } catch (error) {
        console.error('清空回收站失败:', error);
        Utils.addToast(t('trash.emptyTrashFailed'));
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
