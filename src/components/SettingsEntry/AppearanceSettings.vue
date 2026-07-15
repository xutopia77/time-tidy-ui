<template>
    <div class="w-full">
        <div class="mb-5">
            <h1 class="text-xl font-semibold text-text-primary m-0 mb-1">{{ t('appearance.title') }}</h1>
            <p class="text-base text-text-secondary m-0">{{ t('appearance.desc') }}</p>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Theme size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('appearance.theme') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('appearance.themeMode') }}</label>
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
                <h2 class="text-lg font-medium m-0">{{ t('appearance.font') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('appearance.fontSize') }}</label>
                    <div class="w-full">
                        <select
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.fontSize"
                        >
                            <option value="small">{{ t('appearance.fontSizeSmall') }}</option>
                            <option value="medium">{{ t('appearance.fontSizeMedium') }}</option>
                            <option value="large">{{ t('appearance.fontSizeLarge') }}</option>
                            <option value="extra-large">{{ t('appearance.fontSizeExtraLarge') }}</option>
                        </select>
                    </div>
                </div>

                <div class="mb-4 last:mb-0">
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('appearance.fontFamily') }}</label>
                    <div class="w-full">
                        <select
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.fontFamily"
                        >
                            <option value="system">{{ t('appearance.fontSystem') }}</option>
                            <option value="sans-serif">{{ t('appearance.fontSans') }}</option>
                            <option value="serif">{{ t('appearance.fontSerif') }}</option>
                            <option value="monospace">{{ t('appearance.fontMono') }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Ladder size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('appearance.interface') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <div class="flex items-center justify-between mb-4 last:mb-0">
                    <div class="flex flex-col">
                        <span class="text-base font-medium text-text-primary">{{ t('appearance.showSidebar') }}</span>
                        <span class="text-sm text-text-secondary mt-0.5">{{ t('appearance.showSidebarDesc') }}</span>
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
                        <span class="text-base font-medium text-text-primary">{{ t('appearance.compactMode') }}</span>
                        <span class="text-sm text-text-secondary mt-0.5">{{ t('appearance.compactModeDesc') }}</span>
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
                    <label class="block text-base font-medium text-text-primary mb-2">{{ t('appearance.animationSpeed') }}</label>
                    <div class="w-full">
                        <select
                            class="w-full py-2 px-3 text-base border border-border rounded-sm bg-bg-secondary text-text-primary box-border transition-colors duration-200 focus:outline-none focus:border-primary"
                            v-model="form.animationSpeed"
                        >
                            <option value="off">{{ t('appearance.animationOff') }}</option>
                            <option value="slow">{{ t('appearance.animationSlow') }}</option>
                            <option value="normal">{{ t('appearance.animationNormal') }}</option>
                            <option value="fast">{{ t('appearance.animationFast') }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex gap-3 justify-end mt-5">
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-bg-secondary text-text-primary border border-border hover:bg-bg-tertiary">{{ t('common.cancel') }}</button>
            <button class="py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-primary text-white hover:bg-primary-hover">{{ t('appearance.save') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Theme, Text, Ladder } from '@icon-park/vue-next';

const { t } = useI18n();

const selectedTheme = ref('dark');

const themes = [
    { id: 'light', name: t('appearance.light'), preview: 'linear-gradient(to right, #f5f5f5 50%, #ffffff 50%)' },
    { id: 'dark', name: t('appearance.dark'), preview: 'linear-gradient(to right, #1a1a2e 50%, #16213e 50%)' },
    { id: 'system', name: t('appearance.followSystem'), preview: 'linear-gradient(to right, #4a4a4a 50%, #2d2d2d 50%)' },
];

const form = reactive({
    fontSize: 'medium',
    fontFamily: 'system',
    showSidebar: true,
    compactMode: false,
    animationSpeed: 'normal'
});
</script>
