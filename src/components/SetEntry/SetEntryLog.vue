<template>
    <div class="main-container">
        <textarea class="log-textarea" v-model="logContent" readonly placeholder="暂无日志内容"></textarea>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// import Utils from '@/utils/utils'
// import * as DatTypes from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
const logContent = computed(() => {
    return appStore.logInfo || '';
});

</script>

<style scoped>
.main-container {
    width: 100%;
    flex: 1;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.log-textarea {
    flex: 1;
    margin: 10px;
    padding: 10px;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
    border: var(--xc-border);
    outline: none;
    border-radius: 4px;
    resize: none;
    min-height: 0;
}

.log-textarea:hover {
    background-color: var(--xc-background-color);
    border: var(--xc-border-hover);
}
</style>