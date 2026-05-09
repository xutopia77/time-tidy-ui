<template>
    <div class="footer-container">
        <div class="footer-info">
            <span>{{ footerInfo }}</span>
        </div>
        <div class="operate-container">
            <button @click="btnclk_set_file_level()" class="xc-button op-button">设置等级</button>
            <select v-model="sltLevel" class="xc-select op-select">
                <option value="sys_score1">1☆</option>
                <option value="sys_score2">2☆</option>
                <option value="sys_score3">3☆</option>
                <option value="sys_score4">4☆</option>
                <option value="sys_score5">5☆</option>
                <option value="sys_score6">6☆</option>
                <option value="sys_score7">7☆</option>
                <option value="sys_score8">8☆</option>
                <option value="sys_score9">9☆</option>
                <option value="sys_score10">10☆</option>
            </select>
            <button @click="btnclk_operate_file" class="xc-button op-button">移动</button>
            <button @click="btnclk_operate_file" class="xc-button op-button">复制</button>
            <button @click="btnclk_delete_file" class="xc-button op-button">删除</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';

const appStore = useAppStore();
import '@/assets/common.css';

const footerInfo = computed(() => {
    if (appStore.curFiles == null) {
        return '';
    }
    let checkedNum = 0;
    appStore.curFiles.forEach((file) => {
        if (file.checked) {
            checkedNum++;
        }
    });
    if (checkedNum == 0) {
        return '';
    }
    return `选中数量: ${checkedNum}`;
});

function btnclk_operate_file() {
    appStore.bPageFileTransfer = true;
}

function btnclk_delete_file() {
    const req: DatType.FileDeleteReq = {
        fileIds: [],
        dirIds: [],
        bRemoveToDtrash: true,
    };
    for (const item of appStore.curFiles) {
        if (item.checked) {
            req.fileIds.push(item.id);
        }
    }
    for (const item of appStore.curDirs) {
        if (item.checked) {
            req.dirIds.push(item.id);
        }
    }
    if (req.fileIds.length == 0 && req.dirIds.length == 0) {
        Utils.addToast('请选择要操作的文件');
        return;
    }
    Utils.files_delete(req);
}

const sltLevel = ref("sys_score3");

function btnclk_set_file_level() {
    const req: DatType.FilesTagSetReq = {
        fileIds: [],
        tagName: ''
    };
    if (sltLevel.value == '') {
        Utils.addToast('请选择要设置的等级');
    }
    req.tagName = sltLevel.value;
    Utils.files_tag_set(req);
}
</script>
<style scoped>
.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
    border-top: var(--xc-border);
    gap: var(--xc-spacing-md);
}

.footer-info {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.operate-container {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
}

.op-button {
    height: var(--xc-normal-height);
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    font-size: var(--xc-font-size-sm);
}

.op-select {
    height: var(--xc-normal-height);
    font-size: var(--xc-font-size-sm);
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
}
</style>