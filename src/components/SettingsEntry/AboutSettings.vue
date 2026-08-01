<template>
    <div class="w-full">
        <div class="mb-5">
            <h1 class="text-xl font-semibold text-text-primary m-0 mb-1">{{ t('about.title') }}</h1>
            <p class="text-base text-text-secondary m-0">{{ t('about.desc') }}</p>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-4 bg-gradient-to-br from-primary to-primary-hover border-none rounded-lg p-4">
                <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                     <img src="/assets/images/icon.png" alt="logo" width="64" height="64" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold text-white m-0 mb-1">{{ t('about.appName') }}</h2>
                    <p class="text-sm text-white/80 m-0 mb-2">{{ t('about.version') }} {{ appVersion }}</p>
                    <p class="text-base text-white/90 m-0 max-w-[500px] leading-relaxed">
                        {{ t('about.appDesc') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Info size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('about.versionInfo') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-0">
                <div class="flex justify-between py-2 px-4 border-b border-border last:border-b-none">
                    <span class="text-base text-text-secondary">{{ t('about.version') }}</span>
                    <span class="text-base text-text-primary font-medium">{{ appVersion }}</span>
                </div>
                <div class="flex justify-between py-2 px-4 border-b border-border last:border-b-none">
                    <span class="text-base text-text-secondary">{{ t('about.updateDate') }}</span>
                    <span class="text-base text-text-primary font-medium">{{ updateDate }}</span>
                </div>
                <div class="flex justify-between py-2 px-4 border-b border-border last:border-b-none">
                    <span class="text-base text-text-secondary">{{ t('about.buildNumber') }}</span>
                    <span class="text-base text-text-primary font-medium">{{ buildNumber }}</span>
                </div>
                <div class="flex justify-between py-2 px-4 border-b border-border last:border-b-none">
                    <span class="text-base text-text-secondary">{{ t('about.runtime') }}</span>
                    <span class="text-base text-text-primary font-medium">Vue 3 + TypeScript</span>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Shield size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('about.license') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <p class="text-base text-text-primary leading-relaxed m-0 mb-2 last:mb-0">
                    {{ t('about.licenseDesc1') }}
                </p>
                <p class="text-base text-text-primary leading-relaxed m-0 mb-2 last:mb-0">
                    {{ t('about.licenseDesc2') }}
                </p>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Mail size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('about.contact') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-0">
                <div class="flex items-center gap-3 py-2 px-4 border-b border-border last:border-b-none">
                    <Globe size="16" />
                    <span class="text-base text-text-primary w-20">{{ t('about.website') }}</span>
                    <a href="https://xutopia.top/project/timetidy" target="_blank" class="text-base text-primary no-underline flex-1 hover:underline">xutopia.top/project/timetidy</a>
                </div>
                <div class="flex items-center gap-3 py-2 px-4 border-b border-border last:border-b-none">
                    <Mail size="16" />
                    <span class="text-base text-text-primary w-20">{{ t('about.email') }}</span>
                    <a href="mailto:xutopiaf@gmail.com" class="text-base text-primary no-underline flex-1 hover:underline">xutopiaf@gmail.com</a>
                </div>
                <div class="flex items-center gap-3 py-2 px-4 border-b border-border last:border-b-none">
                    <Bug size="16" />
                    <span class="text-base text-text-primary w-20">{{ t('about.feedback') }}</span>
                    <a href="https://github.com/xutopia77/timetidy-prj/issues" target="_blank" class="text-base text-primary no-underline flex-1 hover:underline">GitHub Issues</a>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Heart size="20" />
                <h2 class="text-lg font-medium m-0">{{ t('about.thanks') }}</h2>
            </div>

            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <p class="text-base text-text-primary leading-relaxed m-0 mb-3">
                    {{ t('about.thanksDesc') }}
                </p>
                <ul class="m-0 pl-4">
                    <li class="text-base text-text-primary mb-2 last:mb-0">
                        <a href="https://vuejs.org/" target="_blank" class="text-primary no-underline hover:underline">Vue.js</a> - {{ t('about.vueDesc') }}
                    </li>
                    <li class="text-base text-text-primary mb-2 last:mb-0">
                        <a href="https://www.typescriptlang.org/" target="_blank" class="text-primary no-underline hover:underline">TypeScript</a> - {{ t('about.tsDesc') }}
                    </li>
                    <li class="text-base text-text-primary mb-2 last:mb-0">
                        <a href="https://iconpark.bytedance.net/" target="_blank" class="text-primary no-underline hover:underline">IconPark</a> - {{ t('about.iconparkDesc') }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="flex gap-3 justify-end mt-5">
            <button class="flex items-center gap-1 py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-primary text-white hover:bg-primary-hover" @click="checkUpdate">
                <Refresh size="16" />
                {{ t('about.checkUpdate') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Info, Shield, Mail, Globe, Bug, Heart, Refresh } from '@icon-park/vue-next';

declare const __APP_VERSION__: string;
declare const __APP_UPDATE_DATE__: string;
declare const __APP_BUILD_NUMBER__: string;

const { t } = useI18n();

const appVersion = __APP_VERSION__;
const updateDate = __APP_UPDATE_DATE__;
const buildNumber = __APP_BUILD_NUMBER__;

function checkUpdate() {
    alert(t('about.checkingUpdate') + '\n' + t('about.latestVersion'));
}
</script>
