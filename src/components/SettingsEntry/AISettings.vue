<template>
    <div class="w-full">
        <div class="mb-5">
            <h1 class="text-xl font-semibold text-text-primary m-0 mb-1">{{ t('settings.ai') }}</h1>
            <p class="text-base text-text-secondary m-0">{{ t('settings.aiDesc') }}</p>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Brain size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('settings.aiEngine') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('settings.enableAI') }}</label>
                    <div class="w-full flex items-center">
                        <label class="relative inline-block w-11 h-6">
                            <input type="checkbox" class="opacity-0 w-0 h-0" v-model="form.enabled" @change="handleEnabledChange" />
                            <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-border rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-300 before:rounded-full" :class="{'bg-primary before:translate-x-5': form.enabled}"></span>
                        </label>
                        <span class="ml-2 text-base text-text-primary">{{ form.enabled ? t('settings.enabled') : t('settings.disabled') }}</span>
                    </div>
                </div>

                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('settings.engineStatus') }}</label>
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
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('settings.pythonPath') }}</label>
                    <div class="w-full">
                        <input
                            type="text"
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.pythonPath"
                            :placeholder="t('settings.pythonPathPlaceholder')"
                        />
                        <p class="text-sm text-text-secondary mt-1 mb-0">{{ t('settings.pythonPathDesc') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Tag size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('settings.tagDetection') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('settings.confidenceThreshold') }}: {{ form.tagThreshold.toFixed(2) }}</label>
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
                            <span>0.05 ({{ t('settings.moreTags') }})</span>
                            <span>1.0 ({{ t('settings.morePrecise') }})</span>
                        </div>
                    </div>
                </div>

                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('settings.autoTag') }}</label>
                    <div class="w-full flex items-center">
                        <label class="relative inline-block w-11 h-6">
                            <input type="checkbox" class="opacity-0 w-0 h-0" v-model="form.autoTag" @change="handleAutoTagChange" />
                            <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-border rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-300 before:rounded-full" :class="{'bg-primary before:translate-x-5': form.autoTag}"></span>
                        </label>
                        <span class="ml-2 text-base text-text-primary">{{ form.autoTag ? t('settings.enabled') : t('settings.disabled') }}</span>
                        <p class="text-sm text-text-secondary mt-1 mb-0 ml-2">{{ t('settings.autoTagDesc') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex gap-3 justify-end mt-5">
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-bg-secondary text-text-primary border border-border hover:bg-bg-tertiary" @click="loadStatus">{{ t('settings.reset') }}</button>
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-primary text-white hover:bg-primary-hover" @click="saveConfig">{{ t('settings.save') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Brain, Tag } from '@icon-park/vue-next';
import { ApiService } from '@/utils/apiService';
import type { AIStatus } from '@/utils/dataTypedef';
import Utils from '@/utils/utils';

const { t } = useI18n();

const form = reactive({
    enabled: false,
    pythonPath: '',
    tagThreshold: 0.1,
    autoTag: false,
});

const aiAvailable = computed(() => form.enabled);

const statusText = computed(() => {
    if (aiAvailable.value) return t('settings.aiAvailable');
    if (!form.enabled) return t('settings.aiDisabled');
    return t('settings.aiUnavailable');
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
        const req: Record<string, unknown> = {};
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
            Utils.message_notify({ content: t('settings.aiSettingsSaved'), type: 'success' });
        } else {
            Utils.message_notify({ content: t('settings.saveFailed') + ': ' + (resp.status || 'Unknown error'), type: 'error' });
        }
    } catch (_e) {
        Utils.message_notify({ content: t('settings.saveFailed'), type: 'error' });
    }
};

onMounted(() => {
    loadStatus();
});
</script>
