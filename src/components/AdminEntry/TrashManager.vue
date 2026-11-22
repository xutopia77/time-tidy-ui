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
                <n-popconfirm @positive-click="restoreSelected">
                    <template #trigger>
                        <button :disabled="selectedFiles.length === 0" class="action-btn primary">
                            <Undo theme="outline" size="16" :strokeWidth="3" />
                            <span>{{ t('trash.restoreSelected') }} ({{ selectedFiles.length }})</span>
                        </button>
                    </template>
                    {{ t('trash.confirmRestoreSelected') }} {{ selectedFiles.length }} {{ t('trash.totalFiles') }}?
                </n-popconfirm>
                <n-popconfirm @positive-click="deleteSelectedPermanently">
                    <template #trigger>
                        <button :disabled="selectedFiles.length === 0" class="action-btn danger">
                            <Delete theme="outline" size="16" :strokeWidth="3" />
                            <span>{{ t('trash.deletePermanently') }} ({{ selectedFiles.length }})</span>
                        </button>
                    </template>
                    {{ t('trash.confirmDeleteSelectedPermanently') }} {{ selectedFiles.length }} {{ t('trash.totalFiles') }}?
                    {{ t('trash.permanentDeleteWarning') }}
                </n-popconfirm>
                <n-popconfirm @positive-click="emptyTrash">
                    <template #trigger>
                        <button :disabled="trashFiles.length === 0" class="action-btn danger">
                            <Clear theme="outline" size="16" :strokeWidth="3" />
                            <span>{{ t('trash.emptyTrash') }}</span>
                        </button>
                    </template>
                    {{ t('trash.confirmEmptyTrash') }}
                </n-popconfirm>
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

        <div class="trash-content">
            <n-data-table :columns="columns" :data="trashFiles" :row-key="rowKey"
                :checked-row-keys="checkedRowKeys" @update:checked-row-keys="onCheckedRowKeys"
                :loading="loading" :scroll-x="720" flex-height remote
                :pagination="pagination"
                :row-props="rowProps" class="trash-table" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { h, ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/AppStore';
import { logger } from '@/common/logger';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import '@/assets/common.css';
import { NDataTable, NPopconfirm, NButton, NIcon } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { DeleteThemes, Refresh, Undo, Delete, Clear, ViewList, FileDoc } from '@icon-park/vue-next';

const { t } = useI18n();
const appStore = useAppStore();

const trashFiles = ref<DatType.File[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);
const totalFiles = ref(0);
const totalSize = ref(0);
const checkedRowKeys = ref<Array<string | number>>([]);

const selectedFiles = computed(() => {
    return trashFiles.value.filter(f => checkedRowKeys.value.includes(f.id));
});

const loadTrashFiles = async (page = 1) => {
    try {
        loading.value = true;
        const req = new DatType.FilesGetReq();
        req.page = page - 1;
        req.pageSize = pageSize.value;
        req.statuss = [2]; // FileStatus_Trash = 2

        const response = await Utils.files_get(req, false);

        if (response.code === 0 && response.data) {
            const data = response.data as { files?: { records?: DatType.File[]; total?: number } };

            if (data.files && data.files.records) {
                trashFiles.value = data.files.records;
                totalFiles.value = data.files.total || 0;
            } else {
                trashFiles.value = [];
                totalFiles.value = 0;
            }

            calculateTotalSize();
            currentPage.value = page;
            checkedRowKeys.value = [];
        } else {
            Utils.addToast(response.status || t('trash.loadTrashFailed'));
        }
    } catch (error) {
        logger.error('加载回收站失败:', error);
        Utils.addToast(t('trash.loadTrashFailed'));
    } finally {
        loading.value = false;
    }
};

const calculateTotalSize = () => {
    totalSize.value = trashFiles.value.reduce((sum, file) => sum + file.size, 0);
};

const previewFile = (file: DatType.File) => {
    appStore.curSltFile = file;
    appStore.curFiles = [file];
    appStore.bPageImgView = true;
};

const restoreFile = async (file: DatType.File) => {
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

    const response = await Utils.files_restore(files.map(f => f.id));

    if (response.code === 0) {
        await loadTrashFiles(currentPage.value);
        Utils.addToast(`${t('trash.restoreSuccessCount')} ${files.length} ${t('trash.totalFiles')}`);
    }
};

const deleteFilePermanently = async (file: DatType.File) => {
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
        logger.error('清空回收站失败:', error);
        Utils.addToast(t('trash.emptyTrashFailed'));
    }
};

// ---- table ----
const rowKey = (row: DatType.File): string | number => row.id;

// server-side pagination: data is fetched per page from the backend
const pagination = computed<PaginationProps>(() => ({
    page: currentPage.value,
    pageSize: pageSize.value,
    itemCount: totalFiles.value,
    pageSizes: [50, 100, 200],
    showSizePicker: true,
    onChange: (page: number) => {
        loadTrashFiles(page);
    },
    onUpdatePageSize: (size: number) => {
        pageSize.value = size;
        loadTrashFiles(1);
    },
}));

const onCheckedRowKeys = (keys: Array<string | number>) => {
    checkedRowKeys.value = keys;
};

// keep the legacy e2e hooks: each row carries data-testid="trash-file-card",
// action buttons keep .file-action-btn classes and title attributes
const rowProps = (row: DatType.File): Record<string, unknown> => ({
    'data-testid': 'trash-file-card',
    'data-file-id': row.id,
    title: row.name,
});

function renderActionIcon(icon: unknown) {
    return () => h(NIcon, null, { default: () => h(icon as Parameters<typeof h>[0], { theme: 'outline', size: 16 }) });
}

const columns = computed<DataTableColumns<DatType.File>>(() => [
    { type: 'selection' },
    {
        title: t('trash.colName'),
        key: 'name',
        minWidth: 200,
        render(row) {
            const isMedia = row.type === DatType.FileType.image || row.type === DatType.FileType.video;
            const thumb = h('img', {
                src: Utils.get_thumbnail_url(row.id),
                alt: row.name,
                class: 'trash-thumb',
            });
            const icon = h(NIcon, { size: 32 }, { default: () => h(FileDoc as Parameters<typeof h>[0], { theme: 'outline' }) });
            return h('div', { class: 'trash-name-cell' }, [
                h('div', { class: 'trash-thumb-box' }, [isMedia ? thumb : icon]),
                h('span', { class: 'trash-name-text', title: row.name }, row.name),
            ]);
        },
    },
    {
        title: t('trash.colSize'),
        key: 'size',
        width: 100,
        render(row) {
            return Utils.gen_size_str(row.size);
        },
    },
    {
        title: t('trash.colTime'),
        key: 'create_time',
        width: 160,
        render(row) {
            return row.create_time;
        },
    },
    {
        title: t('trash.colPath'),
        key: 'path',
        minWidth: 180,
        ellipsis: { tooltip: true },
        render(row) {
            return row.path;
        },
    },
    {
        title: t('trash.colActions'),
        key: 'actions',
        width: 130,
        render(row) {
            return h('div', { class: 'trash-actions-cell' }, [
                h(
                    NPopconfirm,
                    { onPositiveClick: () => restoreFile(row) },
                    {
                        trigger: () => h(NButton, {
                            size: 'tiny', quaternary: true, class: 'file-action-btn',
                            title: t('trash.restore'), 'aria-label': t('trash.restore'),
                        }, { icon: renderActionIcon(Undo) }),
                        default: () => `${t('trash.confirmRestore')} "${row.name}"?`,
                    },
                ),
                h(
                    NButton,
                    {
                        size: 'tiny', quaternary: true, class: 'file-action-btn',
                        title: t('similarity.preview'), 'aria-label': t('similarity.preview'),
                        onClick: () => previewFile(row),
                    },
                    { icon: renderActionIcon(ViewList) },
                ),
                h(
                    NPopconfirm,
                    { onPositiveClick: () => deleteFilePermanently(row) },
                    {
                        trigger: () => h(NButton, {
                            size: 'tiny', quaternary: true, class: 'file-action-btn danger',
                            title: t('trash.deletePermanently'), 'aria-label': t('trash.deletePermanently'),
                        }, { icon: renderActionIcon(Delete) }),
                        default: () => `${t('trash.confirmDeletePermanently')} "${row.name}"? ${t('trash.permanentDeleteWarning')}`,
                    },
                ),
            ]);
        },
    },
]);

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
    color: var(--xc-text-color-muted, var(--xc-text-color));
    font-size: var(--xc-font-size-sm);
}

.status-value {
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
}

.trash-content {
    flex: 1;
    min-height: 0;
    padding: var(--xc-spacing-md) var(--xc-spacing-xl);
}

.trash-table {
    height: 100%;
}

:deep(.trash-name-cell) {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

:deep(.trash-thumb-box) {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background-color: var(--xc-background-color-hover, #1f1f1f);
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.trash-thumb) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

:deep(.trash-name-text) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

:deep(.trash-actions-cell) {
    display: flex;
    align-items: center;
    gap: 4px;
}

:deep(.file-action-btn) {
    padding: 4px;
}
</style>
