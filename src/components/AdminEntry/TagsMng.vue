<template>
    <div class="w-full h-full flex flex-col bg-bg-secondary">
        <div class="flex justify-between items-center px-5 py-4 border-b border-border bg-bg-secondary">
            <div class="flex items-center gap-2">
                <TagOne theme="outline" size="24" fill="currentColor" />
                <h2 class="m-0 text-lg font-semibold text-text-primary">{{ t('tag.manage') }}</h2>
            </div>
            <button @click="btn_showAddDialog"
                class="flex items-center gap-1 py-2 px-3 bg-primary text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-primary-hover hover:-translate-y-px hover:shadow-md">
                <Plus theme="outline" size="18" :strokeWidth="3" />
                <span>{{ t('tag.create') }}</span>
            </button>
        </div>

        <div class="flex-1 flex flex-wrap gap-3 p-4 content-start overflow-y-auto">
            <div v-for="(item, index) in allTags" :key="index"
                class="group flex w-[calc(33.333%-12px)] min-w-[280px] bg-bg-secondary border border-border rounded-xl cursor-pointer transition-all duration-200 overflow-hidden relative hover:-translate-y-0.5 hover:shadow-lg hover:border-border-dark"
                :class="{ 'border-primary shadow-[0_0_0_2px_rgba(99,102,241,0.2)]': selectedTagItem?.name === item.name }"
                @click="selectTag(item)">
                <div class="w-1 flex-shrink-0" :style="{ backgroundColor: item.color }"></div>
                <div class="flex-1 flex flex-col p-3">
                    <div class="flex items-start gap-2 mb-2">
                        <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-bg-elevated rounded"
                            :style="{ color: item.color }">
                            <TagOne theme="filled" size="20" fill="currentColor" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-semibold text-text-primary mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                                {{ Utils.tagName2Display(item.name) }}
                            </div>
                            <div class="text-xs text-text-secondary overflow-hidden text-ellipsis whitespace-nowrap"
                                v-if="item.description">{{ item.description }}</div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-border">
                        <div class="flex gap-2">
                            <span class="flex items-center gap-1 text-xs text-text-secondary">
                                <FileDoc theme="outline" size="14" />
                                {{ item.fileCount || 0 }} {{ t('sidebar.files') }}
                            </span>
                        </div>
                        <div class="flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                            <button @click.stop="btn_showEditDialog(item)"
                                class="flex items-center justify-center w-7 h-7 p-0 bg-bg-elevated border border-border rounded text-text-primary cursor-pointer transition-all duration-150 hover:bg-bg-tertiary hover:text-primary hover:border-primary"
                                :title="t('common.edit')">
                                <Edit theme="outline" size="16" :strokeWidth="3" />
                            </button>
                            <n-popconfirm @positive-click="btn_deletetag(item)">
                                <template #trigger>
                                    <button @click.stop
                                        class="flex items-center justify-center w-7 h-7 p-0 bg-bg-elevated border border-border rounded text-text-primary cursor-pointer transition-all duration-150 hover:bg-error/10 hover:text-error hover:border-error"
                                        :title="t('common.delete')">
                                        <Close theme="outline" size="16" :strokeWidth="3" />
                                    </button>
                                </template>
                                {{ t('tag.confirmDeleteTag') }} "{{ Utils.tagName2Display(item.name) }}"?
                            </n-popconfirm>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="allTags.length === 0"
                class="w-full flex flex-col items-center justify-center p-16 text-text-secondary">
                <TagOne theme="outline" size="64" fill="currentColor" class="opacity-30 mb-3" />
                <p class="text-base font-medium m-0 mb-1">{{ t('tag.noTags') }}</p>
                <p class="text-sm m-0 opacity-70">{{ t('tag.createFirst') }}</p>
            </div>
        </div>

        <n-modal v-model:show="isEditDialogVisible" preset="card" class="w-[500px] max-w-[90vw]"
            :title="isNewTag ? t('tag.create') : t('tag.edit')">
            <div class="mb-4">
                <label for="tagName" class="flex items-center gap-1 mb-2 text-sm font-medium text-text-primary">
                    <span>{{ t('file.tagName') }}</span>
                    <span class="text-error">*</span>
                </label>
                <n-input id="tagName" v-model:value="editingTag.name" :placeholder="t('tag.enterName')" />
            </div>

            <div class="mb-4">
                <label for="tagColor" class="flex items-center gap-1 mb-2 text-sm font-medium text-text-primary">
                    <span>{{ t('file.tagColor') }}</span>
                    <span class="text-error">*</span>
                </label>
                <div class="flex items-center gap-2 mb-2">
                    <n-color-picker id="tagColor" v-model:value="editingTag.color" :show-alpha="false"
                        :modes="['hex']" :swatches="colorPresets" class="w-full" />
                </div>
            </div>

            <div class="mb-0">
                <label for="tagDescription" class="flex items-center gap-1 mb-2 text-sm font-medium text-text-primary">
                    <span>{{ t('file.tagDesc') }}</span>
                    <span class="text-text-secondary font-normal">{{ t('tag.optional') }}</span>
                </label>
                <n-input id="tagDescription" v-model:value="editingTag.description" :placeholder="t('tag.enterDesc')"
                    type="textarea" rows="3" />
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <n-button @click="closeDialog">{{ t('common.cancel') }}</n-button>
                    <n-button type="primary" @click="submitEdit">
                        {{ isNewTag ? t('common.create') : t('common.save') }}</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore();
import '@/assets/common.css';
import { NInput, NModal, NButton, NColorPicker, NPopconfirm } from 'naive-ui';
import { TagOne, Edit, Close, Plus, FileDoc } from '@icon-park/vue-next';

const { t } = useI18n();

const allTags = computed(() => {
    return appStore.allTags;
});

const selectedTagItem = ref<DatType.TagItem | null>(null);
function selectTag(item: DatType.TagItem) {
    selectedTagItem.value = item;
}

onBeforeMount(() => {
    Utils.tags_get(true);
});

const isEditDialogVisible = ref(false);
const isNewTag = ref(false);
const editingTag = ref<DatType.TagItem>({ name: '', color: '#e6475e', id: 0, description: '', fileCount: 0 });

const colorPresets = [
    '#e6475e', '#f5a623', '#f8e71c', '#7ed321', '#4a90e2',
    '#9013fe', '#bd10e0', '#50e3c2', '#b8e986', '#9b9b9b'
];

function btn_showAddDialog() {
    isNewTag.value = true;
    editingTag.value = { name: '', color: '#e6475e', id: 0, description: '', fileCount: 0 };
    isEditDialogVisible.value = true;
}

function btn_showEditDialog(item: DatType.TagItem) {
    isNewTag.value = false;
    editingTag.value = { ...item };
    isEditDialogVisible.value = true;
}

function closeDialog() {
    isEditDialogVisible.value = false;
}

function btn_deletetag(item: DatType.TagItem) {
    Utils.tag_delete(item);
}

function submitEdit() {
    if (!editingTag.value.name.trim()) {
        Utils.addToast(t('tag.enterName'));
        return;
    }
    if (!editingTag.value.color) {
        Utils.addToast(t('tag.selectColor'));
        return;
    }

    Utils.tags_set(editingTag.value);
    closeDialog();
}
</script>
