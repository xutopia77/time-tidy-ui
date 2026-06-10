<template>
    <div class="p-0 m-0 w-full h-full bg-bg-secondary text-text-primary">
        <p class="p-0 m-0 text-xs whitespace-nowrap">名称:{{ fileinfo.name }}</p>
        <p class="p-0 m-0 text-xs whitespace-nowrap">大小:{{ fileinfo.size }}</p>
        <p class="p-0 m-0 text-xs whitespace-nowrap">时间:{{ fileinfo.createTime }}</p>
        <p class="p-0 m-0 text-xs whitespace-nowrap">路径:{{ fileinfo.path }}</p>
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
