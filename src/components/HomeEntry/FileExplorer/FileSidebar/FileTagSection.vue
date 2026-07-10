<template>
    <div class="py-3 border-b border-border">
        <h4 class="flex items-center gap-1 m-0 mb-3 text-base text-text-primary font-medium cursor-pointer select-none" @click="$emit('update:collapsed', !collapsed)">
            <span class="text-base transition-transform duration-200" :class="{ 'rotate-[-90deg]': collapsed }">▾</span>
            <span class="text-base">🏷️</span>
            标签信息
        </h4>
        <div class="flex flex-col gap-2" v-if="!collapsed && selectedFiles.length > 0 && selectedFiles[0].tags.length > 0">
            <div class="flex flex-wrap gap-1">
                <span 
                    v-for="tag in selectedFiles[0].tags" 
                    :key="tag.id" 
                    class="py-0.5 px-2 rounded-sm text-xs text-white inline-flex items-center gap-1 cursor-pointer transition-all duration-150"
                    :class="[`tag-source-${tag.source}`, { 'ring-2 ring-white ring-offset-1 ring-offset-bg-secondary scale-110': isActiveTag(tag.name) }]"
                    :style="{ backgroundColor: tag.color }"
                    @click="onTagClick(tag.name)"
                >
                    {{ tag.name }}
                    <span v-if="tag.source === 'ai'" class="text-[10px] opacity-90 font-medium">
                        🤖 {{ (tag.confidence * 100).toFixed(0) }}%
                    </span>
                    <span v-else class="text-xs opacity-90">👤</span>
                </span>
            </div>
        </div>
        <div class="flex flex-col gap-2" v-if="!collapsed && !(selectedFiles.length > 0 && selectedFiles[0].tags.length > 0)">
            <div class="text-sm text-text-secondary text-center py-2">选择文件查看标签信息</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';

const appStore = useAppStore();

defineProps<{
    selectedFiles: DatType.File[];
    collapsed: boolean;
}>();

defineEmits<{
    (e: 'update:collapsed', value: boolean): void;
}>();

function isActiveTag(name: string): boolean {
    return appStore.searchCon.tags.includes(name);
}

function onTagClick(name: string) {
    appStore.searchCon.tags = [name];
    Utils.files_get();
}
</script>

<style scoped>
.tag-source-ai {
    border-left: 3px solid rgba(255, 255, 255, 0.8);
}

.tag-source-manual {
    border-left: 3px solid rgba(255, 255, 255, 0.5);
}
</style>
