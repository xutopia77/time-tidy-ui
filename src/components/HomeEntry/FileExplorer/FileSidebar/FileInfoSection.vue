<template>
    <div class="py-3 border-b border-border">
        <h4 class="flex items-center gap-1 m-0 mb-3 text-base text-text-primary font-medium cursor-pointer select-none" @click="$emit('update:collapsed', !collapsed)">
            <span class="text-base transition-transform duration-200" :class="{ 'rotate-[-90deg]': collapsed }">▾</span>
            <span class="text-base">📷</span>
            {{ t('sidebar.fileInfo') }}
            <span class="text-text-secondary font-normal text-sm" v-if="selectedFiles.length > 0">({{ selectedFiles.length }})</span>
        </h4>
        <div class="flex flex-col gap-2" v-if="!collapsed">
            <template v-if="selectedFiles.length === 1">
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">{{ t('sidebar.name') }}：</span>
                    <span class="text-sm text-text-primary break-all">{{ selectedFiles[0].name }}</span>
                </div>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">{{ t('sidebar.path') }}：</span>
                    <span class="text-sm text-text-primary break-all" :title="selectedFiles[0].path">{{ selectedFiles[0].path }}</span>
                </div>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">{{ t('sidebar.size') }}：</span>
                    <span class="text-sm text-text-primary">{{ formatFileSize(selectedFiles[0].size) }}</span>
                </div>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">{{ t('sidebar.time') }}：</span>
                    <span class="text-sm text-text-primary">{{ selectedFiles[0].time }}</span>
                </div>
                <div class="gap-px" v-if="selectedFiles[0].duration > 0">
                    <span class="text-sm text-text-secondary">{{ t('sidebar.duration') }}：</span>
                    <span class="text-sm text-text-primary">{{ formatDuration(selectedFiles[0].duration) }}</span>
                </div>
            </template>
            <template v-else>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">{{ t('sidebar.selected') }}：</span>
                    <span class="text-sm text-text-primary">{{ selectedFiles.length }} {{ t('sidebar.files') }}</span>
                </div>
                <div class="gap-px">
                    <span class="text-sm text-text-secondary">{{ t('sidebar.totalSize') }}：</span>
                    <span class="text-sm text-text-primary">{{ formatFileSize(totalSelectedSize) }}</span>
                </div>
            </template>
        </div>
        <div class="flex flex-col gap-2" v-if="!collapsed && selectedFiles.length === 0">
            <div class="text-sm text-text-secondary text-center py-2">{{ t('sidebar.selectFileToViewDetail') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import * as DatType from '@/utils/dataTypedef'

const { t } = useI18n();

const props = defineProps<{
    selectedFiles: DatType.File[];
    collapsed: boolean;
}>();

defineEmits<{
    (e: 'update:collapsed', value: boolean): void;
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
