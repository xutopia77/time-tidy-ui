<template>
  <div v-if="visible" class="fixed top-[70px] right-5 w-[350px] bg-white border border-zinc-300 rounded-lg shadow-lg z-[10000]" @click.stop>
    <div class="flex justify-between items-center p-1.5 border-b border-zinc-200">
      <p class="m-0 text-zinc-700">最近消息</p>
      <button @click="btn_clear_all_msg" class="bg-zinc-500 text-white border-none rounded px-2.5 py-1.5 cursor-pointer text-xs hover:bg-zinc-600">清空所有</button>
      <button @click="appStore.bPageResentMsg = false" class="bg-zinc-500 text-white border-none rounded px-2.5 py-1.5 cursor-pointer text-xs hover:bg-zinc-600">关闭</button>
    </div>
    <div class="max-h-[300px] overflow-y-auto">
      <div 
        v-for="message in recentMessages" 
        :key="message.id" 
        class="flex py-0.5 px-1 border-b border-zinc-100 last:border-b-none"
        :class="{
          'border-l-4 border-l-success': message.type === 'success',
          'border-l-4 border-l-error': message.type === 'error',
          'border-l-4 border-l-warning': message.type === 'warning',
          'border-l-4 border-l-info': message.type === 'info'
        }"
      >
        <span class="text-xs mr-0.5 flex-shrink-0">{{ getIcon(message.type) }}</span>
        <div class="flex-1 text-xs">
          <span class="block mb-1.5 text-zinc-700">{{ message.message }}</span>
          <span class="text-xs text-zinc-400">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
      <div v-if="recentMessages.length === 0" class="py-8 text-center text-zinc-400">
        暂无消息
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import * as DatType from '@/utils/dataTypedef';
const visible = computed(() => appStore.bPageResentMsg)

// 计算最近5条消息（从历史消息中获取）
const recentMessages = computed(() => {
  return appStore.historyToasts.slice(-5).reverse()
})

// 清空所有历史消息
const btn_clear_all_msg = () => {
  Utils.clearHistoryToasts()
}

// 获取消息图标
const getIcon = (type: DatType.MessageShowType) => {
  switch (type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    case 'info': return 'ℹ️'
    default: return 'ℹ️'
  }
}

// 格式化时间
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
