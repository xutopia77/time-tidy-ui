<template>
    <div class="move-file-container">
        <div class="table-content xc-scrollbar">
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
        </div>
        <div class="operate-content">
            <p class="info-content">选择目标路径:{{ selectedPathItem != null ? selectedPathItem.path : "" }}</p>
            <button class="xc-button" @click="confirmMove" :disabled="!selectedPathItem">
                确认
            </button>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
// import axios from 'axios';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'
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
    if (req.fileIds.length == 0) {
        Utils.message_notify({ content: '请选择要操作的文件' })
        return;
    }
    if (appStore.setOperateType == 'files_move') {
        req.type = 'move'
        appStore.setOperateType = ''
    }
    else if (appStore.setOperateType == 'files_cpy') {
        req.type = 'copy'
        appStore.setOperateType = ''
    }
    else {
        Utils.message_notify({ content: '请选择操作类型' })
        return;
    }
    Utils.files_path_chg(req)
};
</script>

<style scoped>
.move-file-container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
}

.operate-content {
    width: 100%;
    height: 40px;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-end;
    background-color: var(--xc-background-color-hover);
    border-radius: 14px;
}

.info-content {
    margin: 0px;
    padding: 0px;
    padding-right: 16px;
}

/* ------ table */

.table-content {
    width: 100%;
    height: calc(100% - 40px);
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
</style>