<template>
    <!-- 假设父组件有合适的类名，这里用 parent-container 举例 -->
    <div class="parent-container">
        <div class="message-show">
            <div v-for="(message, index) in messages" :key="index" class="message-item">
                {{ message.content }}
            </div>
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
.parent-container {
    position: relative;
    /* 为子元素的绝对定位提供参考 */
    width: 100%;
    height: 100%;
}

.message-show {
    position: absolute;
    /* 相对于父组件定位 */
    top: 10px;
    /* 距离父组件顶部 10px */
    right: 10px;
    /* 距离父组件右侧 10px */
    z-index: 9999;
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