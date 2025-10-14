<template>
    <div>
        <button @click="btnclk_operate_file('files_move')" class="xc-button op-button">移动</button>
        <button @click="btnclk_operate_file('files_cpy')" class="xc-button op-button">复制</button>
        <button @click="btnclk_delete_file" class="xc-button op-button">删除</button>
        <button @click="btnclk_similarity_file" class="xc-button op-button">相似文件查看</button>
        <button @click="btnclk_search_setting" class="xc-button op-button">搜索筛选</button>
        <button @click="btnclk_file_transfer" class="xc-button op-button">文件转移</button>
        <button @click="btnclk_page_set" class="xc-button op-button">界面设置</button>
    </div>
</template>

<script setup lang="ts">
// import { computed } from 'vue';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css';

function btnclk_operate_file(op: string) {
    appStore.setOperateType = op
    Utils.page_show({ page: 'set', bShow: true })
}

function btnclk_delete_file() {
    const req: DatType.FileDeleteReq = {
        fileIds: [],
        dirIds: [],
        bRemoveToDtrash: true,
    };
    for (const item of appStore.curFiles) {
        if (item.checked) {
            req.fileIds.push(item.id)
        }
    }
    for (const item of appStore.curDirs) {
        if (item.checked) {
            req.dirIds.push(item.id)
        }
    }
    if (req.fileIds.length == 0 && req.dirIds.length == 0) {
        Utils.message_notify({ content: '请选择要操作的文件' })
        return;
    }
    Utils.files_delete(req)
}

function btnclk_similarity_file() {
    Utils.file_similarity_get()
}

function btnclk_search_setting() {
    appStore.bPageSearchSetting = true
}

function btnclk_file_transfer() {
    appStore.bPageFileTransfer = true
}
function btnclk_page_set() {
    appStore.bPageSet = true
}



</script>

<style scoped>
/* 可以添加一些样式来美化选择框 */
span,
label {
    margin-left: 2px;
}

.op-button {
    margin-right: 10px;
}
</style>