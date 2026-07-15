<template>
    <div class="w-full">
        <div class="mb-5">
            <h1 class="text-xl font-semibold text-text-primary m-0 mb-1">{{ t('settings.general') }}</h1>
            <p class="text-base text-text-secondary m-0">{{ t('settings.generalDesc') }}</p>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Theme size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('settings.theme') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('settings.themeMode') }}</label>
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
                <h2 class="text-lg font-medium m-0">{{ t('settings.language') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('settings.interfaceLanguage') }}</label>
                    <div class="w-full">
                        <select
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.language"
                        >
                            <option value="zh-CN">简体中文</option>
                            <option value="en-US">English</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex gap-3 justify-end mt-5">
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-bg-secondary text-text-primary border border-border hover:bg-bg-tertiary">{{ t('common.cancel') }}</button>
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-primary text-white hover:bg-primary-hover">{{ t('settings.save') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import { Theme, Earth } from '@icon-park/vue-next';
import { useI18n } from 'vue-i18n';
import { setLocale } from '@/locales';

const { t } = useI18n();

const selectedTheme = ref('dark');

const themes = computed(() => [
    { id: 'light', name: t('settings.themeLight'), preview: 'linear-gradient(to right, #f5f5f5 50%, #ffffff 50%)' },
    { id: 'dark', name: t('settings.themeDark'), preview: 'linear-gradient(to right, #1a1a2e 50%, #16213e 50%)' },
    { id: 'system', name: t('settings.themeSystem'), preview: 'linear-gradient(to right, #4a4a4a 50%, #2d2d2d 50%)' },
]);

const savedLocale = localStorage.getItem('locale') || 'zh-CN';

const form = reactive({
    language: savedLocale
});

watch(() => form.language, (newLocale) => {
    setLocale(newLocale);
});
</script>
