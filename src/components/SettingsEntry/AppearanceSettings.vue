<template>
    <div class="w-full">
        <div class="mb-5">
            <h1 class="text-xl font-semibold text-text-primary m-0 mb-1">外观</h1>
            <p class="text-base text-text-secondary m-0">自定义应用的视觉样式</p>
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
                <Text size="20" />
                <h2 class="text-lg font-medium m-0">字体</h2>
            </div>
            
            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">字体大小</label>
                    <div class="w-full">
                        <select 
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.fontSize"
                        >
                            <option value="small">小</option>
                            <option value="medium">中</option>
                            <option value="large">大</option>
                            <option value="extra-large">特大</option>
                        </select>
                    </div>
                </div>

                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">字体</label>
                    <div class="w-full">
                        <select 
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.fontFamily"
                        >
                            <option value="system">系统字体</option>
                            <option value="sans-serif">无衬线字体</option>
                            <option value="serif">衬线字体</option>
                            <option value="monospace">等宽字体</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Ladder size="20" />
                <h2 class="text-lg font-medium m-0">界面</h2>
            </div>
            
            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="flex items-center justify-between mb-4 last:mb-0">
                    <div class="flex flex-col">
                        <span class="text-base font-medium text-text-primary">显示侧边栏</span>
                        <span class="text-sm text-text-secondary mt-0.5">在主界面显示导航侧边栏</span>
                    </div>
                    <div 
                        class="w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200"
                        :class="form.showSidebar ? 'bg-primary' : 'bg-border'"
                        @click="form.showSidebar = !form.showSidebar"
                    >
                        <div 
                            class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200"
                            :class="{'translate-x-5': form.showSidebar}"
                        ></div>
                    </div>
                </div>

                <div class="flex items-center justify-between mb-4 last:mb-0">
                    <div class="flex flex-col">
                        <span class="text-base font-medium text-text-primary">紧凑模式</span>
                        <span class="text-sm text-text-secondary mt-0.5">减少界面元素间距</span>
                    </div>
                    <div 
                        class="w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200"
                        :class="form.compactMode ? 'bg-primary' : 'bg-border'"
                        @click="form.compactMode = !form.compactMode"
                    >
                        <div 
                            class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200"
                            :class="{'translate-x-5': form.compactMode}"
                        ></div>
                    </div>
                </div>

                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">动画效果</label>
                    <div class="w-full">
                        <select 
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.animationSpeed"
                        >
                            <option value="off">关闭</option>
                            <option value="slow">慢</option>
                            <option value="normal">正常</option>
                            <option value="fast">快</option>
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
import { Theme, Text, Ladder } from '@icon-park/vue-next';

const selectedTheme = ref('dark');

const themes = [
    { id: 'light', name: '浅色', preview: 'linear-gradient(to right, #f5f5f5 50%, #ffffff 50%)' },
    { id: 'dark', name: '深色', preview: 'linear-gradient(to right, #1a1a2e 50%, #16213e 50%)' },
    { id: 'system', name: '跟随系统', preview: 'linear-gradient(to right, #4a4a4a 50%, #2d2d2d 50%)' },
];

const form = reactive({
    fontSize: 'medium',
    fontFamily: 'system',
    showSidebar: true,
    compactMode: false,
    animationSpeed: 'normal'
});
</script>
