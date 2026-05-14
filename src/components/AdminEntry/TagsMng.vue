<template>
    <div class="tags-mng">
        <div class="tags-header">
            <div class="header-title">
                <TagOne theme="outline" size="24" fill="currentColor" />
                <h2>标签管理</h2>
            </div>
            <button @click="btn_showAddDialog" class="add-tag-btn">
                <Plus theme="outline" size="18" :strokeWidth="3" />
                <span>新建标签</span>
            </button>
        </div>

        <div class="tags-cloud xc-scrollbar">
            <div v-for="(item, index) in allTags" :key="index" class="tag-card"
                :class="{ 'selected': selectedTagItem?.name === item.name }" @click="selectTag(item)">
                <div class="tag-color-bar" :style="{ backgroundColor: item.color }"></div>
                <div class="tag-content">
                    <div class="tag-header">
                        <div class="tag-icon" :style="{ color: item.color }">
                            <TagOne theme="filled" size="20" fill="currentColor" />
                        </div>
                        <div class="tag-info">
                            <div class="tag-name">{{ Utils.tagName2Display(item.name) }}</div>
                            <div class="tag-description" v-if="item.description">{{ item.description }}</div>
                        </div>
                    </div>
                    <div class="tag-footer">
                        <div class="tag-stats">
                            <span class="stat-item">
                                <FileDoc theme="outline" size="14" />
                                {{ item.fileCount || 0 }} 个文件
                            </span>
                        </div>
                        <div class="tag-actions">
                            <button @click.stop="btn_showEditDialog(item)" class="action-btn edit-btn" title="编辑">
                                <Edit theme="outline" size="16" :strokeWidth="3" />
                            </button>
                            <button @click.stop="btn_deletetag(item)" class="action-btn delete-btn" title="删除">
                                <Close theme="outline" size="16" :strokeWidth="3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="allTags.length === 0" class="no-tags">
                <TagOne theme="outline" size="64" fill="currentColor" class="empty-icon" />
                <p class="empty-title">暂无标签</p>
                <p class="empty-desc">点击右上角"新建标签"按钮创建您的第一个标签</p>
            </div>
        </div>

        <div v-if="isEditDialogVisible" class="dialog-overlay" @click="closeDialog">
            <div class="dialog-content" @click.stop>
                <div class="dialog-header">
                    <h3>{{ isNewTag ? '新建标签' : '编辑标签' }}</h3>
                    <button @click="closeDialog" class="close-btn">×</button>
                </div>

                <div class="dialog-body">
                    <div class="form-group">
                        <label for="tagName">
                            <span class="label-text">标签名称</span>
                            <span class="required">*</span>
                        </label>
                        <input id="tagName" v-model="editingTag.name" placeholder="请输入标签名称"
                            class="form-input" />
                    </div>

                    <div class="form-group">
                        <label for="tagColor">
                            <span class="label-text">标签颜色</span>
                            <span class="required">*</span>
                        </label>
                        <div class="color-picker-container">
                            <div class="color-preview" :style="{ backgroundColor: editingTag.color }"></div>
                            <input type="color" v-model="editingTag.color" class="color-input" />
                            <input type="text" v-model="editingTag.color" placeholder="#000000"
                                maxlength="7" class="color-text-input" />
                        </div>
                        <div class="color-presets">
                            <button v-for="color in colorPresets" :key="color"
                                @click="editingTag.color = color"
                                class="color-preset-btn"
                                :style="{ backgroundColor: color }"
                                :class="{ 'active': editingTag.color === color }">
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="tagDescription">
                            <span class="label-text">标签描述</span>
                            <span class="optional">（可选）</span>
                        </label>
                        <textarea id="tagDescription" v-model="editingTag.description"
                            placeholder="请输入标签描述（可选）" rows="3" class="form-textarea"></textarea>
                    </div>
                </div>

                <div class="dialog-footer">
                    <button @click="closeDialog" class="btn btn-secondary">取消</button>
                    <button @click="submitEdit" class="btn btn-primary">
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

<style scoped>
.tags-mng {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--xc-background-color);
}

.tags-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-lg) var(--xc-spacing-xl);
    border-bottom: var(--xc-border);
    background-color: var(--xc-background-color);
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

.add-tag-btn {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-primary-color);
    color: white;
    border: none;
    border-radius: var(--xc-border-radius-md);
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.add-tag-btn:hover {
    background-color: var(--xc-primary-color-hover);
    transform: translateY(-1px);
    box-shadow: var(--xc-shadow-md);
}

.tags-cloud {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-md);
    padding: var(--xc-spacing-lg);
    align-content: flex-start;
    overflow-y: auto;
}

.tag-card {
    display: flex;
    width: calc(33.333% - var(--xc-spacing-md));
    min-width: 280px;
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-lg);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
    overflow: hidden;
    position: relative;
}

.tag-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--xc-shadow-lg);
    border-color: var(--xc-border-hover);
}

.tag-card.selected {
    border-color: var(--xc-primary-color);
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
}

.tag-color-bar {
    width: 4px;
    flex-shrink: 0;
}

.tag-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--xc-spacing-md);
}

.tag-header {
    display: flex;
    align-items: flex-start;
    gap: var(--xc-spacing-sm);
    margin-bottom: var(--xc-spacing-sm);
}

.tag-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var(--xc-background-color-hover);
    border-radius: var(--xc-border-radius-sm);
}

.tag-info {
    flex: 1;
    min-width: 0;
}

.tag-name {
    font-size: var(--xc-font-size-md);
    font-weight: 600;
    color: var(--xc-text-color);
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tag-description {
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tag-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--xc-spacing-sm);
    border-top: 1px solid var(--xc-border-color);
}

.tag-stats {
    display: flex;
    gap: var(--xc-spacing-sm);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
}

.tag-actions {
    display: flex;
    gap: var(--xc-spacing-xs);
    opacity: 0;
    transition: opacity var(--xc-transition-fast);
}

.tag-card:hover .tag-actions {
    opacity: 1;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
}

.action-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.edit-btn:hover {
    color: var(--xc-primary-color);
    border-color: var(--xc-primary-color);
}

.delete-btn:hover {
    color: var(--xc-error-color);
    border-color: var(--xc-error-color);
    background-color: rgba(245, 34, 45, 0.1);
}

.no-tags {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--xc-spacing-xxl);
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

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.dialog-content {
    background-color: var(--xc-background-color);
    border-radius: var(--xc-border-radius-lg);
    box-shadow: var(--xc-shadow-lg);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-lg);
    border-bottom: var(--xc-border);
}

.dialog-header h3 {
    margin: 0;
    font-size: var(--xc-font-size-lg);
    font-weight: 600;
    color: var(--xc-text-color);
}

.close-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    background: none;
    border: none;
    color: var(--xc-text-color-secondary);
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    border-radius: var(--xc-border-radius-sm);
    transition: all var(--xc-transition-fast);
}

.close-btn:hover {
    background-color: var(--xc-background-color-hover);
    color: var(--xc-text-color);
}

.dialog-body {
    flex: 1;
    padding: var(--xc-spacing-lg);
    overflow-y: auto;
}

.form-group {
    margin-bottom: var(--xc-spacing-lg);
}

.form-group:last-child {
    margin-bottom: 0;
}

.form-group label {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: var(--xc-spacing-sm);
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    color: var(--xc-text-color);
}

.label-text {
    color: var(--xc-text-color);
}

.required {
    color: var(--xc-error-color);
}

.optional {
    color: var(--xc-text-color-secondary);
    font-weight: 400;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-input-bg-color);
    border: 1px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    outline: none;
    transition: all var(--xc-transition-normal);
}

.form-input:focus,
.form-textarea:focus {
    border-color: var(--xc-input-border-color-focus);
    box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.color-picker-container {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
    margin-bottom: var(--xc-spacing-sm);
}

.color-preview {
    width: 40px;
    height: 40px;
    border-radius: var(--xc-border-radius-md);
    border: 2px solid var(--xc-border-color);
    flex-shrink: 0;
}

.color-input {
    width: 40px;
    height: 40px;
    padding: 2px;
    border: 1px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-md);
    cursor: pointer;
    background: none;
}

.color-text-input {
    flex: 1;
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-input-bg-color);
    border: 1px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    font-family: monospace;
    outline: none;
    transition: all var(--xc-transition-normal);
}

.color-text-input:focus {
    border-color: var(--xc-input-border-color-focus);
}

.color-presets {
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-xs);
}

.color-preset-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    border: 2px solid transparent;
    border-radius: var(--xc-border-radius-sm);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
}

.color-preset-btn:hover {
    transform: scale(1.1);
}

.color-preset-btn.active {
    border-color: var(--xc-text-color);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--xc-spacing-sm);
    padding: var(--xc-spacing-lg);
    border-top: var(--xc-border);
}

.btn {
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    border: none;
    border-radius: var(--xc-border-radius-md);
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.btn-secondary {
    background-color: var(--xc-button-bg-color);
    color: var(--xc-text-color);
    border: 1px solid var(--xc-border-color);
}

.btn-secondary:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.btn-primary {
    background-color: var(--xc-primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: var(--xc-primary-color-hover);
}
</style>
