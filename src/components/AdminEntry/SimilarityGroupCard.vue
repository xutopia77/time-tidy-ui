<template>
    <div class="similarity-group">
        <div class="group-header">
            <div class="group-title">
                <input type="checkbox" :checked="group.selected" @change="emit('toggle-group')" />
                <span class="group-name">{{ t('similarity.similarityGroup') }} #{{ index + 1 }}</span>
                <span class="file-count">({{ group.files.length }}{{ t('similarity.files') }})</span>
            </div>
            <div class="group-actions">
                <button @click="emit('select-all')" class="group-action-btn">{{ t('similarity.selectAll') }}</button>
                <button @click="emit('keep-best')" class="group-action-btn">{{ t('similarity.keepBest') }}</button>
                <n-popconfirm @positive-click="emit('delete-selected')">
                    <template #trigger>
                        <button class="group-action-btn danger">{{ t('similarity.deleteSelected') }}</button>
                    </template>
                    {{ t('similarity.confirmDelete') }} {{ selectedCount }} {{ t('similarity.files') }}?
                </n-popconfirm>
            </div>
        </div>

        <n-data-table :columns="columns" :data="group.files" :row-key="rowKey" size="small"
            :checked-row-keys="checkedKeys" @update:checked-row-keys="onCheckedKeys"
            :row-props="rowProps" />
    </div>
</template>

<script setup lang="ts">
// One similarity group: header actions + NDataTable of member files.
// Class names (.file-card / .file-thumbnail / .file-meta / .similarity-badge /
// .file-action-btn) are kept so the e2e selectors stay valid.
import { h, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { NDataTable, NPopconfirm, NButton, NIcon } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { ViewList, Local, Delete, FileDoc } from '@icon-park/vue-next';

export interface SimilarityFile {
    id: number;
    name: string;
    path: string;
    size: number;
    create_time: string;
    type: string;
    extension: string;
    tags: DatType.FileItemTag[];
    selected: boolean;
}

export interface SimilarityGroup {
    groupId: number;
    hash: string;
    fileCount: number;
    totalSize: number;
    createdAt: string;
    selected: boolean;
    files: SimilarityFile[];
}

const props = defineProps<{
    group: SimilarityGroup;
    index: number;
}>();

const emit = defineEmits<{
    (e: 'delete-selected'): void;
    (e: 'delete-file', file: SimilarityFile): void;
    (e: 'locate', file: SimilarityFile): void;
    (e: 'toggle-group'): void;
    (e: 'select-all'): void;
    (e: 'keep-best'): void;
    (e: 'update-selection', keys: Array<string | number>): void;
}>();

const { t } = useI18n();
const appStore = useAppStore();

const selectedCount = computed(() => props.group.files.filter(f => f.selected).length);

const checkedKeys = computed<Array<string | number>>(() => {
    return props.group.files.filter(f => f.selected).map(f => f.id);
});

const onCheckedKeys = (keys: Array<string | number>) => {
    emit('update-selection', keys);
};

const previewFile = (file: SimilarityFile) => {
    const f = new DatType.File();
    Object.assign(f, file);
    appStore.curSltFile = f;
    appStore.curFiles = [f];
    appStore.bPageImgView = true;
};

const rowKey = (row: SimilarityFile): string | number => row.id;

const rowProps = (row: SimilarityFile): Record<string, unknown> => ({
    class: row.selected ? 'file-card selected' : 'file-card',
    'data-testid': 'similarity-file-card',
    'data-file-id': row.id,
});

function renderActionIcon(icon: unknown) {
    return () => h(NIcon, null, { default: () => h(icon as Parameters<typeof h>[0], { theme: 'outline', size: 16 }) });
}

const columns = computed<DataTableColumns<SimilarityFile>>(() => [
    { type: 'selection' },
    {
        title: t('trash.colName'),
        key: 'name',
        minWidth: 320,
        render(row) {
            const isMedia = row.type === DatType.FileType.image || row.type === DatType.FileType.video;
            const thumb = h('img', {
                src: Utils.get_thumbnail_url(row.id),
                alt: row.name,
                class: 'file-thumbnail',
            });
            const fallback = h(NIcon, { size: 40 }, { default: () => h(FileDoc as Parameters<typeof h>[0], { theme: 'outline' }) });
            return h('div', { class: 'similarity-file-cell' }, [
                h('div', { class: 'file-thumbnail-container' }, [
                    isMedia ? thumb : fallback,
                    h('div', { class: 'similarity-badge high' }, '100%'),
                ]),
                h('div', { class: 'file-info' }, [
                    h('div', { class: 'file-name', title: row.name }, row.name),
                    h('div', { class: 'file-meta' }, [
                        h('span', null, Utils.gen_size_str(row.size)),
                        h('span', null, row.create_time),
                    ]),
                    h('div', { class: 'file-path', title: row.path }, row.path),
                ]),
            ]);
        },
    },
    {
        title: t('trash.colActions'),
        key: 'actions',
        width: 130,
        render(row) {
            return h('div', { class: 'file-actions' }, [
                h(NButton, {
                    size: 'tiny', quaternary: true, class: 'file-action-btn',
                    title: t('similarity.preview'), 'aria-label': t('similarity.preview'),
                    onClick: () => previewFile(row),
                }, { icon: renderActionIcon(ViewList) }),
                h(NButton, {
                    size: 'tiny', quaternary: true, class: 'file-action-btn',
                    title: t('similarity.locate'), 'aria-label': t('similarity.locate'),
                    onClick: () => emit('locate', row),
                }, { icon: renderActionIcon(Local) }),
                h(NPopconfirm, { onPositiveClick: () => emit('delete-file', row) }, {
                    trigger: () => h(NButton, {
                        size: 'tiny', quaternary: true, class: 'file-action-btn danger',
                        title: t('similarity.delete'), 'aria-label': t('similarity.delete'),
                    }, { icon: renderActionIcon(Delete) }),
                    default: () => `${t('similarity.confirmDeleteFile')} "${row.name}"?`,
                }),
            ]);
        },
    },
]);
</script>

<style scoped>
.similarity-group {
    margin-bottom: var(--xc-spacing-lg);
    border: var(--xc-border);
    border-radius: var(--xc-border-radius-lg);
    overflow: hidden;
    background-color: var(--xc-background-color);
}

.group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-background-color-hover);
    flex-wrap: wrap;
    gap: var(--xc-spacing-sm);
}

.group-title {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.group-name {
    font-weight: 500;
    color: var(--xc-text-color);
}

.file-count {
    color: var(--xc-text-color-secondary);
    font-size: var(--xc-font-size-sm);
}

.group-actions {
    display: flex;
    gap: var(--xc-spacing-xs);
}

.group-action-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.group-action-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.group-action-btn.danger {
    color: var(--xc-danger-color);
    border-color: var(--xc-danger-color);
}

.group-action-btn.danger:hover {
    background-color: var(--xc-danger-color);
    color: white;
}

:deep(.similarity-file-cell) {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 6px 0;
}

:deep(.file-thumbnail-container) {
    position: relative;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: var(--xc-border-radius-md);
    overflow: hidden;
    background-color: var(--xc-background-color-hover);
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.file-thumbnail) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

:deep(.similarity-badge) {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 1px 6px;
    border-radius: 4px 0 0 0;
    font-size: 10px;
    font-weight: 600;
    color: white;
    background-color: var(--xc-danger-color);
}

:deep(.file-info) {
    min-width: 0;
    flex: 1;
}

:deep(.file-name) {
    font-weight: 500;
    color: var(--xc-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.file-meta) {
    display: flex;
    gap: 8px;
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

:deep(.file-path) {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.8;
}

:deep(.file-actions) {
    display: flex;
    align-items: center;
    gap: 4px;
}

:deep(.file-action-btn) {
    padding: 4px;
}
</style>
