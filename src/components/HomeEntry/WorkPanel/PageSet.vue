<template>
    <div class="page-view">
        <div class="page-header">
            <h3>设置界面</h3>
            <button @click="btn_page_close" class="xc-button close-btn">×</button>
        </div>

        <div class="page-content">
            <div class="setting-section">
                <label class="setting-label">卡片大小</label>
                <div class="setting-row">
                    <input 
                        type="range" 
                        v-model="cardWidth" 
                        min="100" 
                        max="800" 
                        step="10"
                        @input="handleWidthChange"
                        class="width-slider"
                    />
                    <button @click="btn_adjustWidth(-10)" class="xc-button adjust-btn">-</button>
                    <span class="width-value">{{ cardWidth }}px</span>
                    <button @click="btn_adjustWidth(10)" class="xc-button adjust-btn">+</button>
                </div>
            </div>

            <div class="setting-section">
                <label class="setting-label">分组依据</label>
                <select v-model="fileShowType" class="xc-select">
                    <option value="">无</option>
                    <option value="time">按时间分组</option>
                </select>
            </div>

            <div class="setting-section">
                <label class="setting-label">卡片视图模式</label>
                <div class="view-mode-options">
                    <label class="view-mode-option">
                        <input type="radio" v-model="cardViewMode" value="card" class="xc-radio" />
                        <span class="view-mode-label">卡片视图</span>
                    </label>
                    <label class="view-mode-option">
                        <input type="radio" v-model="cardViewMode" value="tile" class="xc-radio" />
                        <span class="view-mode-label">平铺视图</span>
                    </label>
                    <label class="view-mode-option">
                        <input type="radio" v-model="cardViewMode" value="adaptive" class="xc-radio" />
                        <span class="view-mode-label">自适应视图</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <button @click="btn_page_save" class="xc-button save-btn">确定</button>
            <button @click="btn_page_close" class="xc-button cancel-btn">取消</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import '@/assets/common.css'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

const cardWidth = computed({
    get: () => appStore.cardWidth,
    set: (value: number) => {
        value = Number(value);
        appStore.cardWidth = value;
        handleWidthChange();
    }
});

function handleWidthChange() {
    console.log(`卡片宽度已更新为 ${cardWidth.value}px`);
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
}

const btn_page_close = () => {
    appStore.bPageSet = false
}

onMounted(() => {
})
</script>

<style scoped>
.page-view {
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border-radius: var(--xc-border-radius-lg);
    box-shadow: var(--xc-shadow-lg);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-lg);
    border-bottom: var(--xc-border);
}

.page-header h3 {
    margin: 0;
    font-size: var(--xc-font-size-lg);
    color: var(--xc-text-color);
}

.close-btn {
    padding: 0;
    width: 30px;
    height: 30px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.page-content {
    padding: var(--xc-spacing-lg);
    flex: 1;
    overflow-y: auto;
}

.setting-section {
    margin-bottom: var(--xc-spacing-xl);
}

.setting-label {
    display: block;
    font-size: var(--xc-font-size-md);
    font-weight: 500;
    color: var(--xc-text-color);
    margin-bottom: var(--xc-spacing-sm);
}

.setting-row {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.width-slider {
    flex: 1;
    height: 6px;
    background: var(--xc-input-bg-color);
    border-radius: var(--xc-border-radius-sm);
    outline: none;
    -webkit-appearance: none;
}

.width-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: var(--xc-primary-color);
    border-radius: 50%;
    cursor: pointer;
}

.width-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--xc-primary-color);
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.width-value {
    min-width: 60px;
    text-align: center;
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.adjust-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    min-width: 32px;
}

.view-mode-options {
    display: flex;
    flex-direction: row;
    gap: var(--xc-spacing-sm);
}

.view-mode-option {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-input-bg-color);
    border: var(--xc-border);
    border-radius: var(--xc-border-radius-sm);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
    flex: 1;
    justify-content: center;
}

.view-mode-option:hover {
    background-color: var(--xc-background-color-hover);
    border: var(--xc-border-hover);
}

.view-mode-option input[type="radio"] {
    margin: 0;
}

.xc-radio {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background-color: var(--xc-input-bg-color);
    border: 2px solid var(--xc-border-color);
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    transition: all var(--xc-transition-fast);
}

.xc-radio:hover {
    border-color: var(--xc-primary-color);
}

.xc-radio:checked {
    background-color: var(--xc-primary-color);
    border-color: var(--xc-primary-color);
}

.xc-radio:checked::after {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    margin: 3px;
}

.view-mode-label {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    font-weight: 500;
}

.page-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--xc-spacing-sm);
    padding: var(--xc-spacing-lg);
    border-top: var(--xc-border);
}

.save-btn,
.cancel-btn {
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    font-size: var(--xc-font-size-md);
}

.save-btn {
    background-color: var(--xc-success-color);
    color: white;
    border: none;
}

.save-btn:hover {
    opacity: 0.9;
}

.cancel-btn {
    background-color: var(--xc-button-bg-color);
    color: var(--xc-button-text-color);
}
</style>
