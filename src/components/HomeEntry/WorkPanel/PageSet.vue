<template>
    <div class="bg-bg-secondary text-text-primary rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden">
        <div class="flex justify-between items-center py-4 px-4 border-b border-border">
            <h3 class="m-0 text-lg text-text-primary">{{ t('page.settings') }}</h3>
            <button @click="btn_page_close" class="p-0 w-[30px] h-[30px] text-xl flex items-center justify-center bg-bg-elevated border border-border rounded-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary">×</button>
        </div>

        <div class="p-4 flex-1 overflow-y-auto">
            <div class="mb-6">
                <label class="block text-base font-medium text-text-primary mb-2">{{ t('page.cardSize') }}</label>
                <div class="flex items-center gap-2">
                    <input
                        type="range"
                        v-model="cardWidth"
                        min="100"
                        max="800"
                        step="10"
                        @input="handleWidthChange"
                        class="flex-1 h-1.5 bg-bg-tertiary rounded-sm outline-none appearance-none"
                    />
                    <button @click="btn_adjustWidth(-10)" class="py-1 px-2 min-w-[32px] bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary">-</button>
                    <span class="min-w-[60px] text-center text-sm text-text-secondary">{{ cardWidth }}px</span>
                    <button @click="btn_adjustWidth(10)" class="py-1 px-2 min-w-[32px] bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary">+</button>
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-base font-medium text-text-primary mb-2">{{ t('page.groupBy') }}</label>
                <select v-model="fileShowType" class="w-full h-10 py-2 px-3 bg-bg-elevated border border-border rounded-sm text-text-primary text-base cursor-pointer outline-none transition-all duration-200 focus:border-primary">
                    <option value="">{{ t('page.noGroup') }}</option>
                    <option value="time">{{ t('page.groupByTime') }}</option>
                </select>
            </div>

            <div class="mb-6">
                <label class="block text-base font-medium text-text-primary mb-2">{{ t('page.viewMode') }}</label>
                <div class="flex flex-row gap-2">
                    <label class="flex items-center gap-1 py-2 px-3 bg-bg-tertiary border border-border rounded-sm cursor-pointer transition-all duration-150 flex-1 justify-center hover:bg-bg-elevated hover:border-border-dark">
                        <input type="radio" v-model="cardViewMode" value="card" class="w-4 h-4 bg-bg-elevated border-2 border-border rounded-full cursor-pointer outline-none transition-all duration-150 hover:border-primary" />
                        <span class="text-base text-text-primary font-medium">{{ t('page.cardView') }}</span>
                    </label>
                    <label class="flex items-center gap-1 py-2 px-3 bg-bg-tertiary border border-border rounded-sm cursor-pointer transition-all duration-150 flex-1 justify-center hover:bg-bg-elevated hover:border-border-dark">
                        <input type="radio" v-model="cardViewMode" value="tile" class="w-4 h-4 bg-bg-elevated border-2 border-border rounded-full cursor-pointer outline-none transition-all duration-150 hover:border-primary" />
                        <span class="text-base text-text-primary font-medium">{{ t('page.tileView') }}</span>
                    </label>
                    <label class="flex items-center gap-1 py-2 px-3 bg-bg-tertiary border border-border rounded-sm cursor-pointer transition-all duration-150 flex-1 justify-center hover:bg-bg-elevated hover:border-border-dark">
                        <input type="radio" v-model="cardViewMode" value="adaptive" class="w-4 h-4 bg-bg-elevated border-2 border-border rounded-full cursor-pointer outline-none transition-all duration-150 hover:border-primary" />
                        <span class="text-base text-text-primary font-medium">{{ t('page.adaptiveView') }}</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="flex justify-end gap-2 p-4 border-t border-border">
            <button @click="btn_page_save" class="py-2 px-4 text-base bg-success text-white border-none rounded-sm cursor-pointer transition-all duration-200 hover:opacity-90">{{ t('common.confirm') }}</button>
            <button @click="btn_page_close" class="py-2 px-4 text-base bg-bg-elevated text-text-primary border border-border rounded-sm cursor-pointer transition-all duration-200 hover:bg-bg-tertiary">{{ t('common.cancel') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
import { logger } from '@/common/logger';
const appStore = useAppStore()
const { t } = useI18n()

const cardWidth = computed({
    get: () => appStore.cardWidth,
    set: (value: number) => {
        value = Number(value);
        appStore.cardWidth = value;
        handleWidthChange();
    }
});

function handleWidthChange() {
    logger.debug(`卡片宽度已更新为 ${cardWidth.value}px`);
}

function btn_adjustWidth(step: number) {
    const newValue: number = appStore.cardWidth + step;
    if (newValue >= 100 && newValue <= 800) {
        appStore.cardWidth = newValue;
    }
}

const fileShowType = computed({
    get: () => appStore.fileShowType,
    set: (newValue) => {
        appStore.fileShowType = newValue;
    }
});

const cardViewMode = computed({
    get: () => appStore.cardViewMode,
    set: (newValue) => {
        appStore.cardViewMode = newValue;
    }
});

const btn_page_save = () => {
    appStore.bPageSet = false
    Utils.files_get();
}

const btn_page_close = () => {
    appStore.bPageSet = false
}

onMounted(() => {
})
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

input[type="radio"]:checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
}

input[type="radio"]:checked::after {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    margin: 3px;
}
</style>
