<template>
    <div class="w-full">
        <div class="mb-5">
            <h1 class="text-xl font-semibold text-text-primary m-0 mb-1">基本设置</h1>
            <p class="text-base text-text-secondary m-0">程序的基本设置</p>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Theme size="20" />
                <h2 class="text-lg font-medium m-0">主题</h2>
            </div>
            
            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">主题模式</label>
                    <div class="w-full flex gap-3">
                        <button 
                            v-for="theme in themes" 
                            :key="theme.id"
                            class="flex flex-col items-center gap-1 p-3 border-2 border-transparent rounded-lg bg-bg-secondary cursor-pointer transition-all duration-200 min-w-[100px] hover:border-border"
                            :class="{ 'border-primary bg-primary/5': selectedTheme === theme.id }"
                            @click="selectedTheme = theme.id"
                        >
                            <div class="w-12 h-12 rounded-lg border border-border" :style="{ background: theme.preview }"></div>
                            <span class="text-sm text-text-primary">{{ theme.name }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Earth size="20" />
                <h2 class="text-lg font-medium m-0">语言</h2>
            </div>
            
            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">界面语言</label>
                    <div class="w-full">
                        <select 
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.language"
                        >
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

        <div class="flex gap-3 justify-end mt-5">
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-bg-secondary text-text-primary border border-border hover:bg-bg-tertiary">取消</button>
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-primary text-white hover:bg-primary-hover">保存设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Theme, Earth } from '@icon-park/vue-next';

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
