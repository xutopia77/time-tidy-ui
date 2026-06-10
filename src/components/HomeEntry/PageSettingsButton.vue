<template>
    <button 
        @click="openPageSettings" 
        class="flex items-center justify-center w-9 h-9 p-0 bg-bg-elevated border border-border rounded-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:border-border-dark"
        title="界面设置"
    >
        <span class="text-base leading-none">⚙️</span>
    </button>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore';

const appStore = useAppStore();

const openPageSettings = () => {
    appStore.bPageSet = true;
};
</script>
