<template>
    <div class="sidebar-section">
        <h4 class="section-title">
            <span class="section-icon">📷</span>
            文件信息
            <span class="section-count" v-if="selectedFiles.length > 0">({{ selectedFiles.length }})</span>
        </h4>
        <div class="section-content" v-if="selectedFiles.length > 0">
            <template v-if="selectedFiles.length === 1">
                <div class="info-item">
                    <span class="info-label">文件名</span>
                    <span class="info-value">{{ selectedFiles[0].name }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">路径</span>
                    <span class="info-value" :title="selectedFiles[0].path">{{ selectedFiles[0].path }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">大小</span>
                    <span class="info-value">{{ formatFileSize(selectedFiles[0].size) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">时间</span>
                    <span class="info-value">{{ selectedFiles[0].time }}</span>
                </div>
                <div class="info-item" v-if="selectedFiles[0].duration > 0">
                    <span class="info-label">时长</span>
                    <span class="info-value">{{ formatDuration(selectedFiles[0].duration) }}</span>
                </div>
            </template>
            <template v-else>
                <div class="info-item">
                    <span class="info-label">已选中</span>
                    <span class="info-value">{{ selectedFiles.length }} 个文件</span>
                </div>
                <div class="info-item">
                    <span class="info-label">总大小</span>
                    <span class="info-value">{{ formatFileSize(totalSelectedSize) }}</span>
                </div>
            </template>
        </div>
        <div class="section-content" v-else>
            <div class="empty-hint">选择文件查看详细信息</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as DatType from '@/utils/dataTypedef'

const props = defineProps<{
    selectedFiles: DatType.File[];
}>();

const totalSelectedSize = computed(() => {
    return props.selectedFiles.reduce((sum, file) => sum + file.size, 0);
});

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.sidebar-section {
    padding: var(--xc-spacing-md);
    border-bottom: var(--xc-border);
}

.section-title {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    margin: 0 0 var(--xc-spacing-md) 0;
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    font-weight: 500;
}

.section-icon {
    font-size: var(--xc-font-size-md);
}

.section-count {
    color: var(--xc-text-color-secondary);
    font-weight: normal;
    font-size: var(--xc-font-size-sm);
}

.section-content {
    display: flex;
    flex-direction: column;
    gap: var(--xc-spacing-sm);
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.info-label {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.info-value {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    word-break: break-all;
}

.empty-hint {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    text-align: center;
    padding: var(--xc-spacing-sm) 0;
}
</style>
