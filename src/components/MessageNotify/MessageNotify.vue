<template>
    <div class="message-show">
        <div v-for="(message, index) in messages" :key="index" class="message-item">
            {{ message.content }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue';

// import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

const messages = ref<DatType.Message[]>([]);

// 1 秒定时器 ID
let timerId: number | null = null;

// 检查消息是否到期的函数
const checkMessages = () => {
    const now = Date.now();
    const srcMsg = appStore.messageNotify;
    messages.value = srcMsg.filter(message => {
        return now - message.startTime < message.durationMs;
    });
};

// 监听 appStore.messageNotify 的变化
watch(() => appStore.messageNotify, () => {
    checkMessages();
}, { deep: true });

// 启动 1 秒定时器
timerId = window.setInterval(checkMessages, 1000);

// 组件卸载时清除定时器
onUnmounted(() => {
    if (timerId) {
        window.clearInterval(timerId);
    }
});
</script>

<style scoped>
.message-show {
    position: fixed;
    /* 固定定位，显示在所有内容之上 */
    top: 10px;
    right: 10px;
    z-index: 9999;
    /* 设置较高的 z-index 值 */
    max-width: 300px;
}

.message-item {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px;
    margin-bottom: 5px;
    border-radius: 4px;
}
</style>