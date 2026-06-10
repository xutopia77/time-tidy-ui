<template>
    <div class="w-full h-full flex flex-col bg-bg-secondary">
        <div class="flex justify-between items-center px-5 py-4 border-b border-border bg-bg-secondary">
            <div class="flex items-center gap-2">
                <TagOne theme="outline" size="24" fill="currentColor" />
                <h2 class="m-0 text-lg font-semibold text-text-primary">标签管理</h2>
            </div>
            <button @click="btn_showAddDialog" 
                class="flex items-center gap-1 py-2 px-3 bg-primary text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-primary-hover hover:-translate-y-px hover:shadow-md">
                <Plus theme="outline" size="18" :strokeWidth="3" />
                <span>新建标签</span>
            </button>
        </div>

        <div class="flex-1 flex flex-wrap gap-3 p-4 content-start overflow-y-auto">
            <div v-for="(item, index) in allTags" :key="index" 
                class="flex w-[calc(33.333%-12px)] min-w-[280px] bg-bg-secondary border border-border rounded-xl cursor-pointer transition-all duration-200 overflow-hidden relative hover:-translate-y-0.5 hover:shadow-lg hover:border-border-dark"
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
                                {{ item.fileCount || 0 }} 个文件
                            </span>
                        </div>
                        <div class="flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                            <button @click.stop="btn_showEditDialog(item)" 
                                class="flex items-center justify-center w-7 h-7 p-0 bg-bg-elevated border border-border rounded text-text-primary cursor-pointer transition-all duration-150 hover:bg-bg-tertiary hover:text-primary hover:border-primary"
                                title="编辑">
                                <Edit theme="outline" size="16" :strokeWidth="3" />
                            </button>
                            <button @click.stop="btn_deletetag(item)" 
                                class="flex items-center justify-center w-7 h-7 p-0 bg-bg-elevated border border-border rounded text-text-primary cursor-pointer transition-all duration-150 hover:bg-error/10 hover:text-error hover:border-error"
                                title="删除">
                                <Close theme="outline" size="16" :strokeWidth="3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="allTags.length === 0" 
                class="w-full flex flex-col items-center justify-center p-16 text-text-secondary">
                <TagOne theme="outline" size="64" fill="currentColor" class="opacity-30 mb-3" />
                <p class="text-base font-medium m-0 mb-1">暂无标签</p>
                <p class="text-sm m-0 opacity-70">点击右上角"新建标签"按钮创建您的第一个标签</p>
            </div>
        </div>

        <div v-if="isEditDialogVisible" 
            class="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] backdrop-blur-sm"
            @click="closeDialog">
            <div class="bg-bg-secondary rounded-xl shadow-lg w-[90%] max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden"
                @click.stop>
                <div class="flex justify-between items-center px-4 py-4 border-b border-border">
                    <h3 class="m-0 text-base font-semibold text-text-primary">{{ isNewTag ? '新建标签' : '编辑标签' }}</h3>
                    <button @click="closeDialog" 
                        class="w-8 h-8 p-0 bg-none border-none text-text-secondary text-2xl leading-none cursor-pointer rounded transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary">
                        ×
                    </button>
                </div>

                <div class="flex-1 p-4 overflow-y-auto">
                    <div class="mb-4">
                        <label for="tagName" class="flex items-center gap-1 mb-2 text-sm font-medium text-text-primary">
                            <span>标签名称</span>
                            <span class="text-error">*</span>
                        </label>
                        <input id="tagName" v-model="editingTag.name" placeholder="请输入标签名称"
                            class="w-full py-2 px-3 bg-bg-tertiary border border-border rounded-lg text-text-primary text-sm outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" />
                    </div>

                    <div class="mb-4">
                        <label for="tagColor" class="flex items-center gap-1 mb-2 text-sm font-medium text-text-primary">
                            <span>标签颜色</span>
                            <span class="text-error">*</span>
                        </label>
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-10 h-10 rounded-lg border-2 border-border flex-shrink-0" 
                                :style="{ backgroundColor: editingTag.color }"></div>
                            <input type="color" v-model="editingTag.color" 
                                class="w-10 h-10 p-0.5 border border-border rounded-lg cursor-pointer bg-none" />
                            <input type="text" v-model="editingTag.color" placeholder="#000000"
                                maxlength="7" 
                                class="flex-1 py-2 px-3 bg-bg-tertiary border border-border rounded-lg text-text-primary text-sm font-mono outline-none transition-all duration-200 focus:border-primary" />
                        </div>
                        <div class="flex flex-wrap gap-1">
                            <button v-for="color in colorPresets" :key="color"
                                @click="editingTag.color = color"
                                class="w-8 h-8 p-0 border-2 border-transparent rounded cursor-pointer transition-all duration-150 hover:scale-110"
                                :class="{ 'border-text-primary shadow-[0_0_0_2px_rgba(0,0,0,0.1)]': editingTag.color === color }"
                                :style="{ backgroundColor: color }">
                            </button>
                        </div>
                    </div>

                    <div class="mb-0">
                        <label for="tagDescription" class="flex items-center gap-1 mb-2 text-sm font-medium text-text-primary">
                            <span>标签描述</span>
                            <span class="text-text-secondary font-normal">（可选）</span>
                        </label>
                        <textarea id="tagDescription" v-model="editingTag.description"
                            placeholder="请输入标签描述（可选）" rows="3" 
                            class="w-full py-2 px-3 bg-bg-tertiary border border-border rounded-lg text-text-primary text-sm outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] resize-y min-h-[80px]"></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-2 px-4 py-4 border-t border-border">
                    <button @click="closeDialog" 
                        class="py-2 px-4 border border-border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 bg-bg-elevated text-text-primary hover:bg-bg-tertiary">
                        取消
                    </button>
                    <button @click="submitEdit" 
                        class="py-2 px-4 border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 bg-primary text-white hover:bg-primary-hover">
                        {{ isNewTag ? '创建' : '保存' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore();
import '@/assets/common.css';
import { TagOne, Edit, Close, Plus, FileDoc } from '@icon-park/vue-next';

const allTags = computed(() => {
    return appStore.allTags;
});

const selectedTagItem = ref<DatType.TagItem | null>(null);
function selectTag(item: DatType.TagItem) {
    selectedTagItem.value = item;
}

onBeforeMount(() => {
    Utils.tags_get();
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
    if (confirm(`确定要删除标签 "${Utils.tagName2Display(item.name)}" 吗？`)) {
        Utils.tag_delete(item);
    }
}

function submitEdit() {
    if (!editingTag.value.name.trim()) {
        Utils.addToast('请输入标签名称');
        return;
    }
    if (!editingTag.value.color) {
        Utils.addToast('请选择标签颜色');
        return;
    }

    Utils.tags_set(editingTag.value);
    closeDialog();
}
</script>
