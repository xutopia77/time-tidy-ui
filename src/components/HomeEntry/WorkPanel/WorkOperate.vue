<template>
    <div>
        <button @click="btnclk_operate_file('files_move')">移动</button>
        <button @click="btnclk_operate_file('files_cpy')">复制</button>
        <button @click="btnclk_delete_file">删除</button>
    </div>
</template>
<script setup lang="ts">
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
function btnclk_operate_file(op: string) {
    appStore.bShowSetting = !appStore.bShowSetting
    appStore.setOperateType = op
}

function btnclk_delete_file() {
    const req: DatType.FileDeleteReq = {
        fileIds: [],
        bRemoveToDtrash: true,
    };
    for (const item of appStore.curFiles) {
        if (item.checked) {
            req.fileIds.push(item.id)
        }
    }
    if (req.fileIds.length == 0) {
        Utils.message_notify({ content: '请选择要操作的文件' })
        return;
    }
    Utils.files_delete(req)
}

</script>
<style scoped></style>