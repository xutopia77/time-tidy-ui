<template>
  <div class="fixed top-8 right-5 z-[9999] flex flex-col gap-2.5">
    <transition-group name="toast" tag="div">
      <div 
        v-for="toast in appStore.toasts" 
        :key="toast.id" 
        class="flex items-center py-0.5 px-1 rounded-md shadow-lg text-sm font-medium min-w-[250px] backdrop-blur-sm"
        :class="{
          'bg-success/90 text-white border border-success/50': toast.type === 'success',
          'bg-error/90 text-white border border-error/50': toast.type === 'error',
          'bg-warning/90 text-zinc-900 border border-warning/50': toast.type === 'warning',
          'bg-info/90 text-white border border-info/50': toast.type === 'info'
        }"
      >
        <span class="mr-0.5 text-xs">{{ getIcon(toast.type) }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore'
const appStore = useAppStore()
import * as DatType from '@/utils/dataTypedef';

// 获取图标
const getIcon = (type: DatType.MessageShowType) => {
  switch (type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    case 'info': return 'ℹ️'
    default: return 'ℹ️'
  }
}
</script>

<style scoped>
/* 进入和离开动画 */
.toast-enter-active {
  animation: toast-in 0.3s ease-out forwards;
}

.toast-leave-active {
  animation: toast-out 0.3s ease-in forwards;
}

@keyframes toast-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-out {
  0% {
    transform: translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
