<template>
    <div class="py-3 border-b border-border">
        <h4 class="flex items-center gap-1 m-0 mb-3 text-base text-text-primary font-medium">
            <span class="text-base">📷</span>
            文件信息
            <span class="text-text-secondary font-normal text-sm" v-if="selectedFiles.length > 0">({{ selectedFiles.length }})</span>
        </h4>
        <div class="flex flex-col gap-2" v-if="selectedFiles.length > 0">
            <template v-if="selectedFiles.length === 1">
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">名称：</span>
                    <span class="text-sm text-text-primary break-all">{{ selectedFiles[0].name }}</span>
                </div>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">路径：</span>
                    <span class="text-sm text-text-primary break-all" :title="selectedFiles[0].path">{{ selectedFiles[0].path }}</span>
                </div>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">大小：</span>
                    <span class="text-sm text-text-primary">{{ formatFileSize(selectedFiles[0].size) }}</span>
                </div>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">时间：</span>
                    <span class="text-sm text-text-primary">{{ selectedFiles[0].time }}</span>
                </div>
                <div class="gap-px" v-if="selectedFiles[0].duration > 0">
                    <span class="text-sm text-text-secondary">时长：</span>
                    <span class="text-sm text-text-primary">{{ formatDuration(selectedFiles[0].duration) }}</span>
                </div>
            </template>
            <template v-else>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">已选中：</span>
                    <span class="text-sm text-text-primary">{{ selectedFiles.length }} 个文件</span>
                </div>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">总大小：</span>
                    <span class="text-sm text-text-primary">{{ formatFileSize(totalSelectedSize) }}</span>
                </div>
            </template>
        </div>
        <div class="flex flex-col gap-2" v-else>
            <div class="text-sm text-text-secondary text-center py-2">选择文件查看详细信息</div>
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
