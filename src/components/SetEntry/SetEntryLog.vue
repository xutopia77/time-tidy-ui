<template>
    <div class="w-full flex-1 m-0 p-0 flex flex-col min-h-0">
        <textarea 
            class="flex-1 m-2.5 p-2.5 text-text-primary bg-bg-secondary border border-border outline-none rounded resize-none min-h-0 hover:bg-bg-secondary hover:border-border-dark"
            v-model="logContent" 
            readonly 
            placeholder="暂无日志内容"
        ></textarea>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/AppStore';

const appStore = useAppStore()
const logContent = computed(() => {
    return appStore.logInfo || '';
});
</script>
