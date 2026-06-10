<template>
    <div class="w-full">
        <div class="mb-5">
            <h1 class="text-xl font-semibold text-text-primary m-0 mb-1">AI功能设置</h1>
            <p class="text-base text-text-secondary m-0">配置AI智能标签功能</p>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Brain size="20" />
                <h2 class="text-lg font-medium m-0">AI引擎</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">启用AI功能</label>
                    <div class="w-full flex items-center">
                        <label class="relative inline-block w-11 h-6">
                            <input type="checkbox" class="opacity-0 w-0 h-0" v-model="form.enabled" @change="handleEnabledChange" />
                            <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-border rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-300 before:rounded-full" :class="{'bg-primary before:translate-x-5': form.enabled}"></span>
                        </label>
                        <span class="ml-2 text-base text-text-primary">{{ form.enabled ? '已启用' : '已禁用' }}</span>
                    </div>
                </div>

                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">引擎状态</label>
                    <div class="w-full">
                        <span 
                            class="inline-block py-1 px-3 rounded-sm text-sm font-medium"
                            :class="{
                                'bg-success/15 text-success': aiAvailable,
                                'bg-zinc-500/15 text-zinc-500': !aiAvailable
                            }"
                        >{{ statusText }}</span>
                    </div>
                </div>

                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">Python路径</label>
                    <div class="w-full">
                        <input
                            type="text"
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.pythonPath"
                            placeholder="留空则自动检测系统Python"
                        />
                        <p class="text-sm text-text-secondary mt-1 mb-0">指定Python可执行文件路径，留空将自动检测系统Python或使用内置Python</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Tag size="20" />
                <h2 class="text-lg font-medium m-0">标签检测</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">置信度阈值: {{ form.tagThreshold.toFixed(2) }}</label>
                    <div class="w-full">
                        <input
                            type="range"
                            class="w-full h-1.5 appearance-none bg-border rounded-sm outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                            v-model.number="form.tagThreshold"
                            min="0.05"
                            max="1.0"
                            step="0.05"
                        />
                        <div class="flex justify-between text-xs text-text-secondary mt-1">
                            <span>0.05 (更多标签)</span>
                            <span>1.0 (更精确)</span>
                        </div>
                    </div>
                </div>

                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">自动标签</label>
                    <div class="w-full flex items-center">
                        <label class="relative inline-block w-11 h-6">
                            <input type="checkbox" class="opacity-0 w-0 h-0" v-model="form.autoTag" @change="handleAutoTagChange" />
                            <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-border rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-300 before:rounded-full" :class="{'bg-primary before:translate-x-5': form.autoTag}"></span>
                        </label>
                        <span class="ml-2 text-base text-text-primary">{{ form.autoTag ? '已启用' : '已禁用' }}</span>
                        <p class="text-sm text-text-secondary mt-1 mb-0 ml-2">启用后，新扫描的图片将自动进行AI标签检测</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex gap-3 justify-end mt-5">
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-bg-secondary text-text-primary border border-border hover:bg-bg-tertiary" @click="loadStatus">重置</button>
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-primary text-white hover:bg-primary-hover" @click="saveConfig">保存设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { Brain, Tag } from '@icon-park/vue-next';
import { ApiService } from '@/utils/apiService';
import type { AIStatus } from '@/utils/dataTypedef';
import Utils from '@/utils/utils';

const form = reactive({
    enabled: false,
    pythonPath: '',
    tagThreshold: 0.1,
    autoTag: false,
});

const aiAvailable = computed(() => form.enabled);

const statusText = computed(() => {
    if (aiAvailable.value) return 'AI引擎可用';
    if (!form.enabled) return 'AI功能已禁用';
    return 'AI引擎不可用';
});

const loadStatus = async () => {
    try {
        const resp = await ApiService.aiStatus();
        if (resp.code === 0 && resp.data) {
            const status = resp.data as AIStatus;
            form.enabled = status.enabled;
            form.pythonPath = status.pythonPath;
            form.tagThreshold = status.tagThreshold;
            form.autoTag = status.autoTag;
        }
    } catch (e) {
        console.error('Failed to load AI status:', e);
    }
};

const handleEnabledChange = () => {
    saveConfig();
};

const handleAutoTagChange = () => {
    saveConfig();
};

const saveConfig = async () => {
    try {
        const req: Record<string, any> = {};
        req.enabled = form.enabled;
        req.python_path = form.pythonPath;
        req.tag_threshold = form.tagThreshold;
        req.auto_tag = form.autoTag;

        const resp = await ApiService.aiConfigSet(req);
        if (resp.code === 0 && resp.data) {
            const status = resp.data as AIStatus;
            form.enabled = status.enabled;
            form.pythonPath = status.pythonPath;
            form.tagThreshold = status.tagThreshold;
            form.autoTag = status.autoTag;
            Utils.message_notify({ content: 'AI设置已保存', type: 'success' });
        } else {
            Utils.message_notify({ content: '保存失败: ' + (resp.status || '未知错误'), type: 'error' });
        }
    } catch (e) {
        Utils.message_notify({ content: '保存失败', type: 'error' });
    }
};

onMounted(() => {
    loadStatus();
});
</script>
