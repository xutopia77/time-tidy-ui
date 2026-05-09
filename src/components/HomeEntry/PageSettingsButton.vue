<template>
    <button @click="openPageSettings" class="settings-btn" title="界面设置">
        <span class="settings-icon">⚙️</span>
    </button>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore';

const appStore = useAppStore();

const openPageSettings = () => {
    appStore.bPageSet = true;
};
</script>

<style scoped>
.settings-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--xc-normal-height);
    height: var(--xc-normal-height);
    padding: 0;
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.settings-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
    border-color: var(--xc-border-hover);
}

.settings-icon {
    font-size: var(--xc-font-size-lg);
    line-height: 1;
}
</style>
