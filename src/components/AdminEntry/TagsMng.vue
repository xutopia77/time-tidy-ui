<template>
    <div class="tags-mng">
        <div class="tags-cloud">
            <div v-for="(item, index) in allTags" :key="index" class="tag-card"
                :class="{ 'selected': selectedTagItem?.name === item.name }" @click="selectTag(item)"
                :style="{ backgroundColor: item.color + '20', borderColor: item.color }">
                <TagOne theme="outline" size="18" fill="currentColor" />
                <div class="tag-info">
                    <div class="tag-name">{{ transformTagName(item.name) }}</div>
                    <div class="tag-description" v-if="item.description">{{ item.description }}</div>
                </div>
                <div class="tag-actions">
                    <button @click.stop="btn_showEditDialog(item)" class="xc-button xc-button-small">
                        <Edit theme="outline" size="14" :strokeWidth="3" />
                    </button>
                    <button @click.stop="btn_deletetag(item)" class="xc-button xc-button-small xc-button-danger">
                        <Close theme="outline" size="14" :strokeWidth="3" />
                    </button>
                </div>
            </div>
            <div v-if="allTags.length === 0" class="no-tags">
                <p>暂无标签</p>
            </div>
        </div>

        <!-- 编辑弹窗 -->
        <div v-if="isEditDialogVisible" class="edit-dialog">
            <div class="dialog-content">
                <h3>编辑标签</h3>
                <div class="form-group">
                    <label for="tagName">标签名称：</label>
                    <input id="tagName" v-model="editingTag.name" placeholder="请输入标签名称" />
                </div>
                <div class="form-group">
                    <label for="tagColor">标签颜色：</label>
                    <div class="color-input-group">
                        <input id="tagColor" type="color" v-model="editingTag.color" />
                        <input type="text" v-model="editingTag.color" placeholder="#000000" maxlength="7" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="tagDescription">标签描述：</label>
                    <textarea id="tagDescription" v-model="editingTag.description" placeholder="请输入标签描述"
                        rows="3"></textarea>
                </div>
                <div class="dialog-actions">
                    <button @click="submitEdit" class="xc-button xc-button-primary">保存</button>
                    <button @click="isEditDialogVisible = false" class="xc-button">取消</button>
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
import { TagOne, Edit, Close } from '@icon-park/vue-next';

const allTags = computed(() => {
    return appStore.allTags;
});

const selectedTagItem = ref<DatType.TagItem | null>(null);
function selectTag(item: DatType.TagItem) {
    selectedTagItem.value = item;
}

// 添加标签名称转换函数
function transformTagName(name: string): string {
    // 检查是否是 sys_score1 到 sys_score10 的标签
    const scoreMatch = name.match(/^sys_score(\d{1,2})$/);
    if (scoreMatch) {
        const score = parseInt(scoreMatch[1]);
        // 确保分数在1-10范围内
        if (score >= 1 && score <= 10) {
            return `${score}☆`;
        }
    }

    // 对于其他标签，可以保留原有的首字母大写或其他转换逻辑
    return name.charAt(0).toUpperCase() + name.slice(1);
}

onBeforeMount(() => {
    Utils.tags_get();
});

// 控制编辑弹窗的显示与隐藏
const isEditDialogVisible = ref(false);
// 存储正在编辑的标签
const editingTag = ref<DatType.TagItem>({ name: '', color: '#e6475e', id: 0, description: '' });

// 显示编辑弹窗
function btn_showEditDialog(item: DatType.TagItem) {
    // 直接使用 item，因为 TagItem 类型已包含 description 字段
    editingTag.value = { ...item };
    isEditDialogVisible.value = true;
}

function btn_deletetag(item: DatType.TagItem) {
    Utils.tag_delete(item);
}

// 提交编辑
function submitEdit() {
    try {
        // 将编辑后的对象传递给后端
        Utils.tags_set(editingTag.value);
        isEditDialogVisible.value = false;
    } catch (error) {
        console.error('编辑标签失败:', error);
    }
}
</script>

<style scoped>
.tags-mng {
    width: 100%;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
}

.tags-cloud {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-content: flex-start;
    overflow-y: auto;
    padding: 8px;
}

.tag-card {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1.5px solid;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 100px;
    max-width: 800px;
    width: fit-content;
    position: relative;
    backdrop-filter: blur(10px);
    box-sizing: border-box;
}

.tag-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.tag-card.selected {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tag-color-preview {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
}

.tag-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    /* 使flex子项能够收缩 */
}

.tag-name {
    font-weight: 500;
    font-size: 13px;
    color: var(--xc-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tag-description {
    font-size: 11px;
    opacity: 0.7;
    color: var(--xc-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tag-id {
    font-size: 11px;
    opacity: 0.6;
    color: var(--xc-text-color);
}

.tag-actions {
    display: flex;
    gap: 4px;
    margin-left: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.tag-card:hover .tag-actions {
    opacity: 1;
}

.xc-button-small {
    padding: 2px 6px;
    min-width: auto;
    border-radius: 4px;
}

.xc-button-danger {
    background-color: #f44336;
    border-color: #f44336;
    color: white;
}

.xc-button-danger:hover {
    background-color: #d32f2f;
    border-color: #d32f2f;
}

.icon {
    font-size: 12px;
    line-height: 1;
}

.no-tags {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--xc-text-color);
    opacity: 0.5;
}

.no-tags p {
    margin-top: 16px;
    font-size: 14px;
}

/* 编辑弹窗样式 */
.edit-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.dialog-content {
    background-color: var(--xc-background-color-hover);
    padding: 20px;
    border-radius: 6px;
    color: var(--xc-text-color);
    min-width: 280px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dialog-content h3 {
    margin-top: 0;
    margin-bottom: 16px;
    text-align: center;
    font-size: 16px;
}

.form-group {
    margin-bottom: 12px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 6px 10px;
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border: var(--xc-border);
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 13px;
}

.form-group textarea {
    width: 100%;
    padding: 6px 10px;
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border: var(--xc-border);
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 13px;
    resize: vertical;
}

.color-input-group {
    display: flex;
    gap: 6px;
}

.color-input-group input[type="color"] {
    width: 50px;
    height: 30px;
    padding: 2px;
    cursor: pointer;
}

.color-input-group input[type="text"] {
    flex: 1;
}

.dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

.dialog-actions .xc-button {
    padding: 6px 12px;
    min-width: 70px;
    font-size: 13px;
}

.xc-button-primary {
    background-color: #2196F3;
    border-color: #2196F3;
    color: white;
}

.xc-button-primary:hover {
    background-color: #1976D2;
    border-color: #1976D2;
}

/* 滚动条样式 */
.tags-cloud::-webkit-scrollbar {
    width: 6px;
}

.tags-cloud::-webkit-scrollbar-track {
    background: var(--xc-background-color);
    border-radius: 3px;
}

.tags-cloud::-webkit-scrollbar-thumb {
    background: var(--xc-border-color);
    border-radius: 3px;
}

.tags-cloud::-webkit-scrollbar-thumb:hover {
    background: var(--xc-text-color);
}
</style>