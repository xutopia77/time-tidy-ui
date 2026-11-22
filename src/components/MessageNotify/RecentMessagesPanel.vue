<template>
    <n-drawer v-model:show="show" placement="right" :width="360">
        <n-drawer-content closable>
            <template #header>
                <div class="flex items-center justify-between w-full">
                    <span>最近消息</span>
                    <n-button size="tiny" quaternary type="error" @click="btn_clear_all_msg">清空所有</n-button>
                </div>
            </template>
            <n-list :show-divider="false" class="recent-message-list">
                <n-list-item v-for="message in recentMessages" :key="message.id" class="recent-message-item">
                    <div class="flex items-start gap-2 py-1">
                        <n-tag size="small" :type="tagType(message.type)" :bordered="false" class="flex-shrink-0">
                            {{ typeLabel(message.type) }}
                        </n-tag>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs text-text-primary break-words">{{ message.message }}</div>
                            <div class="text-xs text-text-secondary mt-1">{{ formatTime(message.timestamp) }}</div>
                        </div>
                    </div>
                </n-list-item>
            </n-list>
            <div v-if="recentMessages.length === 0" class="py-8 text-center text-text-secondary text-sm">
                暂无消息
            </div>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import * as DatType from '@/utils/dataTypedef';
import { NDrawer, NDrawerContent, NList, NListItem, NTag, NButton } from 'naive-ui'

const show = computed({
    get: () => appStore.bPageResentMsg,
    set: (v: boolean) => { appStore.bPageResentMsg = v; },
});

// latest 5 messages from history, newest first
const recentMessages = computed(() => {
    return appStore.historyToasts.slice(-5).reverse()
})

// clear all historical messages
const btn_clear_all_msg = () => {
    Utils.clearHistoryToasts()
}

const tagType = (type: DatType.MessageShowType) => {
    switch (type) {
        case 'success': return 'success'
        case 'error': return 'error'
        case 'warning': return 'warning'
        default: return 'info'
    }
}

const typeLabel = (type: DatType.MessageShowType) => {
    switch (type) {
        case 'success': return '成功'
        case 'error': return '错误'
        case 'warning': return '警告'
        default: return '信息'
    }
}

// relative time display
const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}小时前`

    const days = Math.floor(hours / 24)
    return `${days}天前`
}
</script>

<style scoped>
.recent-message-list {
    padding: 0;
}

.recent-message-item {
    padding: 4px 0;
}
</style>
