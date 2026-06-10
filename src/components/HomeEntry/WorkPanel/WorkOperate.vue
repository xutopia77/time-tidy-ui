<template>
    <div class="flex gap-2">
        <button @click="btnclk_file_transfer" class="py-1.5 px-3 bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:border-border-dark">移动</button>
        <button @click="btnclk_file_transfer" class="py-1.5 px-3 bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:border-border-dark">复制</button>
        <button @click="btnclk_delete_file" class="py-1.5 px-3 bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:border-border-dark">删除</button>
        <button @click="btnclk_similarity_file" class="py-1.5 px-3 bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:border-border-dark">{{ fileSimilarityBtnName }}</button>
        <button @click="btnclk_search_setting" class="py-1.5 px-3 bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:border-border-dark">搜索筛选</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()


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
        Utils.message_notify({ content: '请选择要操作的文件', type: 'success' })
        return;
    }
    Utils.files_delete(req)
}

const fileSimilarityBtnName = computed(() => appStore.fileShowType == "fileSimilarity" ? "正常文件查看" : "相似文件查看")

function btnclk_similarity_file() {
    if (appStore.fileShowType == "fileSimilarity") {
        appStore.fileShowType = ""
        Utils.files_get(null)
    }
    else {
        Utils.file_similarity_get()
    }
}

function btnclk_search_setting() {
    appStore.bPageSearchSetting = true
}

function btnclk_file_transfer() {
    appStore.bPageFileTransfer = true
}
</script>
