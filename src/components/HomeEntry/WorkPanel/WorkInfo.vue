<template>
    <div class="work-info">
        <p class="info-item">名称:{{ fileinfo.name }}</p>
        <p class="info-item">大小:{{ fileinfo.size }}</p>
        <p class="info-item">时间:{{ fileinfo.createTime }}</p>
        <p class="info-item">路径:{{ fileinfo.path }}</p>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

const fileinfo = computed(() => {
    const fileInfo = { name: '', size: '0KB', createTime: '', path: '' }
    fileInfo.name = appStore.curSltFile?.name || ''
    if (appStore.curSltFile?.size) {
        const sizeKb = appStore.curSltFile.size / 1024;
        if (sizeKb < 1024) {
            fileInfo.size = sizeKb.toFixed(2) + 'KB'
        }
        else if (sizeKb < 1024 * 1024) {
            const sizeMb = sizeKb / 1024;
            fileInfo.size = sizeMb.toFixed(2) + 'MB'
        } else {
            const sizeGb = sizeKb / (1024 * 1024);
            fileInfo.size = sizeGb.toFixed(2) + 'GB'
        }
    }
    fileInfo.createTime = appStore.curSltFile?.time || ''
    fileInfo.path = appStore.curSltFile?.path || ''
    return fileInfo
})


</script>
<style scoped>
.work-info {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
}

.info-item {
    padding: 0px;
    margin: 0px;
    font-size: small;
    white-space: nowrap;
}
</style>