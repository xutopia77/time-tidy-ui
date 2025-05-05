<template>
    <div class="move-file-container">
        <p>选择目标路径</p>
        <table class="path-table">
            <thead>
                <tr>
                    <th class="index-col">序号</th>
                    <th>路径</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in allDirs" :key="index"
                    :class="{ 'selected': selectedPathItem?.path === item.path }" @click="selectPath(item)">
                    <td class="index-col">{{ index + 1 }}</td>
                    <td>{{ item.path }}</td>
                </tr>
            </tbody>
        </table>
        <div v-if="selectedPathItem != null" class="selected-path-info">
            <p>已选中路径: {{ selectedPathItem.path }}</p>
        </div>
        <button class="confirm-btn" @click="confirmMove" :disabled="!selectedPathItem">
            确认移动
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
// import axios from 'axios';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

const allDirs = computed(() => {
    return appStore.curAllDirs
})
const selectedPathItem = ref<DatType.DirItem | null>(null);
const selectPath = (item: DatType.DirItem) => {
    selectedPathItem.value = item
};

// 确认移动文件的方法
const confirmMove = async () => {
    const selectedPath = selectedPathItem.value?.path;
    if (selectedPathItem.value == null) return;
    if (!selectedPath) return;
    const req: DatType.FilePathChgReq = {
        fileIds: [],
        distPath: selectedPath,
        distRootPathId: selectedPathItem.value.rootPathId,
        srcRootPathId: 0,
        type: 'move',
    };

    for (const item of appStore.curFiles) {
        if (item.checked) {
            req.fileIds.push(item.id)
            req.srcRootPathId = item.rootPathId
        }
    }
    if (req.fileIds.length == 0) return;
    Utils.files_path_chg(req)
};
</script>

<style scoped>
.move-file-container {
    padding: 2px;
    margin: 0px;
    width: 100%;
}

.path-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2px;
}

.path-table th,
.path-table td {
    border: 1px solid #ddd;
    padding: 2px;
    text-align: left;
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
    background-color: #f5f5f5;
    cursor: pointer;
}

.path-table tr.selected {
    background-color: #e0f7fa;
}

.selected-path-info {
    margin-bottom: 2px;
    color: #2196f3;
}

.confirm-btn {
    padding: 2px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.confirm-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>