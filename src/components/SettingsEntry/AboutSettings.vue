<template>
    <div class="settings-page">
        <div class="page-header">
            <h1>关于</h1>
            <p class="page-desc">了解 Time Tidy 应用信息</p>
        </div>

        <div class="settings-section about-section">
            <div class="about-card">
                <div class="app-icon">
                    <WindmillTwo size="64" />
                </div>
                <div class="app-info">
                    <h2>Time Tidy</h2>
                    <p class="app-version">版本 {{ appVersion }}</p>
                    <p class="app-description">
                        Time Tidy 是一款强大的图片视频文件管理系统，帮助您高效管理和整理您的数字资产。
                    </p>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Info size="20" />
                <h2>版本信息</h2>
            </div>
            
            <div class="settings-card version-info">
                <div class="version-item">
                    <span class="version-label">版本号</span>
                    <span class="version-value">{{ appVersion }}</span>
                </div>
                <div class="version-item">
                    <span class="version-label">更新日期</span>
                    <span class="version-value">{{ updateDate }}</span>
                </div>
                <div class="version-item">
                    <span class="version-label">构建号</span>
                    <span class="version-value">{{ buildNumber }}</span>
                </div>
                <div class="version-item">
                    <span class="version-label">运行环境</span>
                    <span class="version-value">Vue 3 + TypeScript</span>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Shield size="20" />
                <h2>许可协议</h2>
            </div>
            
            <div class="settings-card license-info">
                <p>
                    Time Tidy 是一款开源软件，基于 MIT 许可证发布。
                </p>
                <p>
                    您可以自由使用、修改和分发本软件，但需保留原始版权声明。
                </p>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Mail size="20" />
                <h2>联系我们</h2>
            </div>
            
            <div class="settings-card contact-info">
                <div class="contact-item">
                    <Globe size="16" />
                    <span>官方网站</span>
                    <a href="#" class="contact-link">https://www.timetidy.com</a>
                </div>
                <div class="contact-item">
                    <Mail size="16" />
                    <span>邮箱</span>
                    <a href="mailto:support@timetidy.com" class="contact-link">support@timetidy.com</a>
                </div>
                <div class="contact-item">
                    <Bug size="16" />
                    <span>反馈问题</span>
                    <a href="#" class="contact-link">提交反馈</a>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Heart size="20" />
                <h2>致谢</h2>
            </div>
            
            <div class="settings-card thanks-info">
                <p>
                    感谢以下开源项目和工具：
                </p>
                <ul class="thanks-list">
                    <li><a href="https://vuejs.org/" target="_blank">Vue.js</a> - 渐进式 JavaScript 框架</li>
                    <li><a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> - JavaScript 的超集</li>
                    <li><a href="https://iconpark.bytedance.net/" target="_blank">IconPark</a> - 高质量图标库</li>
                </ul>
            </div>
        </div>

        <div class="settings-actions">
            <button class="btn btn-primary" @click="checkUpdate">
                <Refresh size="16" />
                检查更新
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { WindmillTwo, Info, Shield, Mail, Globe, Bug, Heart, Refresh } from '@icon-park/vue-next';
import '@/assets/common.css';

const appVersion = '1.0.0';
const updateDate = '2026-05-09';
const buildNumber = '20260509001';

function checkUpdate() {
    alert('正在检查更新...\n当前已是最新版本。');
}
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

.about-section {
    margin-bottom: var(--xc-spacing-xl);
}

.about-card {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-lg);
    background: linear-gradient(135deg, var(--xc-primary-color) 0%, var(--xc-primary-color-hover) 100%);
    border: none;
}

.app-icon {
    width: 80px;
    height: 80px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
}

.app-info h2 {
    font-size: var(--xc-font-size-xl);
    font-weight: 600;
    color: white;
    margin: 0 0 var(--xc-spacing-xs) 0;
}

.app-version {
    font-size: var(--xc-font-size-sm);
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 var(--xc-spacing-sm) 0;
}

.app-description {
    font-size: var(--xc-font-size-md);
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    max-width: 500px;
    line-height: 1.6;
}

.version-info {
    padding: 0;
}

.version-item {
    display: flex;
    justify-content: space-between;
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    border-bottom: 1px solid var(--xc-border-color);
}

.version-item:last-child {
    border-bottom: none;
}

.version-label {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color-secondary);
}

.version-value {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    font-weight: 500;
}

.license-info p {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    line-height: 1.6;
    margin: 0 0 var(--xc-spacing-sm) 0;
}

.license-info p:last-child {
    margin-bottom: 0;
}

.contact-info {
    padding: 0;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-md);
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    border-bottom: 1px solid var(--xc-border-color);
}

.contact-item:last-child {
    border-bottom: none;
}

.contact-item span {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    width: 80px;
}

.contact-link {
    font-size: var(--xc-font-size-md);
    color: var(--xc-primary-color);
    text-decoration: none;
    flex: 1;
}

.contact-link:hover {
    text-decoration: underline;
}

.thanks-info p {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    line-height: 1.6;
    margin: 0 0 var(--xc-spacing-md) 0;
}

.thanks-list {
    margin: 0;
    padding-left: var(--xc-spacing-md);
}

.thanks-list li {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    margin-bottom: var(--xc-spacing-sm);
}

.thanks-list li:last-child {
    margin-bottom: 0;
}

.thanks-list a {
    color: var(--xc-primary-color);
    text-decoration: none;
}

.thanks-list a:hover {
    text-decoration: underline;
}

.settings-actions {
    display: flex;
    gap: var(--xc-spacing-md);
    justify-content: flex-end;
    margin-top: var(--xc-spacing-xl);
}

.btn {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
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
