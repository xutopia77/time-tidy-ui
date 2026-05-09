<template>
    <div class="settings-page">
        <div class="page-header">
            <h1>基本设置</h1>
            <p class="page-desc">程序的基本设置</p>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Theme size="20" />
                <h2>主题</h2>
            </div>
            
            <div class="settings-card">
                <div class="form-item">
                    <label class="form-label">主题模式</label>
                    <div class="form-control theme-options">
                        <button 
                            v-for="theme in themes" 
                            :key="theme.id"
                            class="theme-option"
                            :class="{ 'active': selectedTheme === theme.id }"
                            @click="selectedTheme = theme.id"
                        >
                            <div class="theme-preview" :style="{ background: theme.preview }"></div>
                            <span>{{ theme.name }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Earth size="20" />
                <h2>语言</h2>
            </div>
            
            <div class="settings-card">
                <div class="form-item">
                    <label class="form-label">界面语言</label>
                    <div class="form-control">
                        <select class="select-field" v-model="form.language">
                            <option value="zh-CN">简体中文</option>
                            <option value="zh-TW">繁體中文</option>
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="ja-JP">日本語</option>
                            <option value="ko-KR">한국어</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-actions">
            <button class="btn btn-secondary">取消</button>
            <button class="btn btn-primary">保存设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Theme, Earth } from '@icon-park/vue-next';
import '@/assets/common.css';

const selectedTheme = ref('dark');

const themes = [
    { id: 'light', name: '浅色', preview: 'linear-gradient(to right, #f5f5f5 50%, #ffffff 50%)' },
    { id: 'dark', name: '深色', preview: 'linear-gradient(to right, #1a1a2e 50%, #16213e 50%)' },
    { id: 'system', name: '跟随系统', preview: 'linear-gradient(to right, #4a4a4a 50%, #2d2d2d 50%)' },
];

const form = reactive({
    language: 'zh-CN'
});
</script>

<style scoped>
.settings-page {
    width: 100%;
}

.page-header {
    margin-bottom: var(--xc-spacing-xl);
}

.page-header h1 {
    font-size: var(--xc-font-size-xl);
    font-weight: 600;
    color: var(--xc-text-color);
    margin: 0 0 var(--xc-spacing-xs) 0;
}

.page-desc {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color-secondary);
    margin: 0;
}

.settings-section {
    margin-bottom: var(--xc-spacing-xl);
}

.section-header {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
    margin-bottom: var(--xc-spacing-md);
    color: var(--xc-text-color);
}

.section-header h2 {
    font-size: var(--xc-font-size-lg);
    font-weight: 500;
    margin: 0;
}

.settings-card {
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    padding: var(--xc-spacing-lg);
}

.form-item {
    margin-bottom: var(--xc-spacing-lg);
}

.form-item:last-child {
    margin-bottom: 0;
}

.form-label {
    display: block;
    font-size: var(--xc-font-size-md);
    font-weight: 500;
    color: var(--xc-text-color);
    margin-bottom: var(--xc-spacing-sm);
}

.form-control {
    width: 100%;
}

.select-field {
    width: 100%;
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    font-size: var(--xc-font-size-md);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    box-sizing: border-box;
    transition: border-color var(--xc-transition-normal);
}

.select-field:focus {
    outline: none;
    border-color: var(--xc-primary-color);
}

.theme-options {
    display: flex;
    gap: var(--xc-spacing-md);
}

.theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-md);
    border: 2px solid transparent;
    border-radius: var(--xc-border-radius-md);
    background-color: var(--xc-background-color);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
    min-width: 100px;
}

.theme-option:hover {
    border-color: var(--xc-border-color);
}

.theme-option.active {
    border-color: var(--xc-primary-color);
    background-color: rgba(74, 111, 165, 0.08);
}

.theme-preview {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--xc-border-color);
}

.theme-option span {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color);
}

.settings-actions {
    display: flex;
    gap: var(--xc-spacing-md);
    justify-content: flex-end;
    margin-top: var(--xc-spacing-xl);
}

.btn {
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    font-size: var(--xc-font-size-md);
    border-radius: var(--xc-border-radius-sm);
    border: none;
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.btn-secondary {
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border: 1px solid var(--xc-border-color);
}

.btn-secondary:hover {
    background-color: var(--xc-background-color-hover);
}

.btn-primary {
    background-color: var(--xc-primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: var(--xc-primary-color-hover);
}
</style>
