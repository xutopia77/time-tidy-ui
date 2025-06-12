<template>
    <div class="tags-mng">
        <div class="table-content xc-scrollbar">
            <table class="path-table">
                <thead>
                    <tr>
                        <th class="index-col">序号</th>
                        <th>名称</th>
                        <th>颜色</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in allTags" :key="index"
                        :class="{ 'selected': selectedTagItem?.name === item.name }" @click="selectTag(item)">
                        <td class="index-col">{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>
                            <div :style="{ backgroundColor: item.color, width: '20px', height: '20px' }"></div>
                        </td>
                        <td>
                            <button @click.stop="showEditDialog(item)" class="xc-button"
                                style="margin-right: 10px;">编辑</button>
                            <button @click="btn_deletetag(item)" class="xc-button">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 编辑弹窗 -->
        <div v-if="isEditDialogVisible" class="edit-dialog">
            <div class="dialog-content">
                <h3>编辑标签</h3>
                <div>
                    <label for="tagName">标签名称：</label>
                    <input id="tagName" v-model="editingTag.name" />
                </div>
                <div>
                    <label for="tagColor">标签颜色：</label>
                    <input id="tagColor" type="color" v-model="editingTag.color" />
                </div>
                <button @click="submitEdit" class="xc-button">提交</button>
                <button @click="isEditDialogVisible = false" class="xc-button">取消</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'

const allTags = computed(() => {
    return appStore.allTags
})

const selectedTagItem = ref<DatType.TagItem | null>(null);
function selectTag(item: DatType.TagItem) {
    selectedTagItem.value = item;
}

onBeforeMount(() => {
    Utils.tags_get()
})

// 控制编辑弹窗的显示与隐藏
const isEditDialogVisible = ref(false);
// 存储正在编辑的标签
const editingTag = ref<DatType.TagItem>({ name: '', color: '', id: 0 });

// 显示编辑弹窗
function showEditDialog(item: DatType.TagItem) {
    editingTag.value = { ...item };
    isEditDialogVisible.value = true;
}

function btn_deletetag(item: DatType.TagItem) {
    Utils.tag_delete(item)
}

// 提交编辑
function submitEdit() {
    try {
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
    padding: 0;
}

/* ------ table */

.table-content {
    width: 100%;
    height: calc(100% - 0px);
    margin: 0;
    padding: 0;
    overflow: auto;
    text-align: center;
}

.path-table {
    width: 100%;
    border-collapse: collapse;
    /* margin-bottom: 2px; */
    border: var(--xc-border);
    color: var(--xc-text-color);
}

.path-table th,
.path-table td {
    border: var(--xc-border);
    /* 设置单元格边框 */
    padding: 2px;
    text-align: left;
}

.path-table thead th {
    background-color: #232430;
}

/* 为序号列添加特定宽度 */
.path-table th.index-col,
.path-table td.index-col {
    width: 50px;
    /* 可根据需要调整宽度 */
    text-align: center;
    /* 让序号居中显示 */
}

.path-table tr:hover {
    background-color: #232430;
    /* 设置行悬停背景色 */
    cursor: pointer;
}

.path-table tr.selected {
    background-color: #232430;
    /* 设置选中行背景色 */
}

/* 编辑弹窗样式 */
.edit-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.dialog-content {
    background-color: var(--xc-background-color-hover);
    padding: 20px;
    border-radius: 5px;
    color: var(--xc-text-color);
}

.dialog-content h3 {
    margin-top: 0;
}

.dialog-content div {
    margin-bottom: 10px;
}

.dialog-content label {
    display: inline-block;
    width: 80px;
}

.dialog-content input {
    padding: 5px;
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border: var(--xc-border);
    border-radius: 3px;
}

.dialog-content button {
    margin-right: 10px;
    padding: 5px 10px;
}
</style>
