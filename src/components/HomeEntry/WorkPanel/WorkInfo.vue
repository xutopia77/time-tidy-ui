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
import Utils from '@/utils/utils'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

const fileinfo = computed(() => {
    const fileInfo = { name: '', size: '0KB', createTime: '', path: '' }
    fileInfo.name = appStore.curSltFile?.name || ''
    fileInfo.size = Utils.gen_size_str(appStore.curSltFile?.size || 0)
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
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
}

.info-item {
    padding: 0px;
    margin: 0px;
    font-size: small;
    white-space: nowrap;
}
</style>