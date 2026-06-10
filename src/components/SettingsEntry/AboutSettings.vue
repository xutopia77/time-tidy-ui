<template>
    <div class="w-full">
        <div class="mb-5">
            <h1 class="text-xl font-semibold text-text-primary m-0 mb-1">关于</h1>
            <p class="text-base text-text-secondary m-0">了解 Time Tidy 应用信息</p>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-4 bg-gradient-to-br from-primary to-primary-hover border-none rounded-lg p-4">
                <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                    <WindmillTwo size="64" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold text-white m-0 mb-1">Time Tidy</h2>
                    <p class="text-sm text-white/80 m-0 mb-2">版本 {{ appVersion }}</p>
                    <p class="text-base text-white/90 m-0 max-w-[500px] leading-relaxed">
                        Time Tidy 是一款强大的图片视频文件管理系统，帮助您高效管理和整理您的数字资产。
                    </p>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Info size="20" />
                <h2 class="text-lg font-medium m-0">版本信息</h2>
            </div>
            
            <div class="bg-bg-secondary border border-border rounded-lg p-0">
                <div class="flex justify-between py-2 px-4 border-b border-border last:border-b-none">
                    <span class="text-base text-text-secondary">版本号</span>
                    <span class="text-base text-text-primary font-medium">{{ appVersion }}</span>
                </div>
                <div class="flex justify-between py-2 px-4 border-b border-border last:border-b-none">
                    <span class="text-base text-text-secondary">更新日期</span>
                    <span class="text-base text-text-primary font-medium">{{ updateDate }}</span>
                </div>
                <div class="flex justify-between py-2 px-4 border-b border-border last:border-b-none">
                    <span class="text-base text-text-secondary">构建号</span>
                    <span class="text-base text-text-primary font-medium">{{ buildNumber }}</span>
                </div>
                <div class="flex justify-between py-2 px-4 border-b border-border last:border-b-none">
                    <span class="text-base text-text-secondary">运行环境</span>
                    <span class="text-base text-text-primary font-medium">Vue 3 + TypeScript</span>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Shield size="20" />
                <h2 class="text-lg font-medium m-0">许可协议</h2>
            </div>
            
            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <p class="text-base text-text-primary leading-relaxed m-0 mb-2 last:mb-0">
                    Time Tidy 是一款开源软件，基于 MIT 许可证发布。
                </p>
                <p class="text-base text-text-primary leading-relaxed m-0 mb-2 last:mb-0">
                    您可以自由使用、修改和分发本软件，但需保留原始版权声明。
                </p>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Mail size="20" />
                <h2 class="text-lg font-medium m-0">联系我们</h2>
            </div>
            
            <div class="bg-bg-secondary border border-border rounded-lg p-0">
                <div class="flex items-center gap-3 py-2 px-4 border-b border-border last:border-b-none">
                    <Globe size="16" />
                    <span class="text-base text-text-primary w-20">官方网站</span>
                    <a href="#" class="text-base text-primary no-underline flex-1 hover:underline">https://www.timetidy.com</a>
                </div>
                <div class="flex items-center gap-3 py-2 px-4 border-b border-border last:border-b-none">
                    <Mail size="16" />
                    <span class="text-base text-text-primary w-20">邮箱</span>
                    <a href="mailto:support@timetidy.com" class="text-base text-primary no-underline flex-1 hover:underline">support@timetidy.com</a>
                </div>
                <div class="flex items-center gap-3 py-2 px-4 border-b border-border last:border-b-none">
                    <Bug size="16" />
                    <span class="text-base text-text-primary w-20">反馈问题</span>
                    <a href="#" class="text-base text-primary no-underline flex-1 hover:underline">提交反馈</a>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <div class="flex items-center gap-2 mb-3 text-text-primary">
                <Heart size="20" />
                <h2 class="text-lg font-medium m-0">致谢</h2>
            </div>
            
            <div class="bg-bg-secondary border border-border rounded-lg p-4">
                <p class="text-base text-text-primary leading-relaxed m-0 mb-3">
                    感谢以下开源项目和工具：
                </p>
                <ul class="m-0 pl-4">
                    <li class="text-base text-text-primary mb-2 last:mb-0">
                        <a href="https://vuejs.org/" target="_blank" class="text-primary no-underline hover:underline">Vue.js</a> - 渐进式 JavaScript 框架
                    </li>
                    <li class="text-base text-text-primary mb-2 last:mb-0">
                        <a href="https://www.typescriptlang.org/" target="_blank" class="text-primary no-underline hover:underline">TypeScript</a> - JavaScript 的超集
                    </li>
                    <li class="text-base text-text-primary mb-2 last:mb-0">
                        <a href="https://iconpark.bytedance.net/" target="_blank" class="text-primary no-underline hover:underline">IconPark</a> - 高质量图标库
                    </li>
                </ul>
            </div>
        </div>

        <div class="flex gap-3 justify-end mt-5">
            <button class="flex items-center gap-1 py-2 px-4 text-base rounded-sm border-none cursor-pointer transition-all duration-200 bg-primary text-white hover:bg-primary-hover" @click="checkUpdate">
                <Refresh size="16" />
                检查更新
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { WindmillTwo, Info, Shield, Mail, Globe, Bug, Heart, Refresh } from '@icon-park/vue-next';

const appVersion = '1.0.0';
const updateDate = '2026-05-09';
const buildNumber = '20260509001';

function checkUpdate() {
    alert('正在检查更新...\n当前已是最新版本。');
}
</script>
