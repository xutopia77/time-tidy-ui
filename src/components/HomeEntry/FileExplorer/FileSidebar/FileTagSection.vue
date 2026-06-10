<template>
    <div class="py-3 border-b border-border">
        <h4 class="flex items-center gap-1 m-0 mb-3 text-base text-text-primary font-medium">
            <span class="text-base">🏷️</span>
            标签信息
        </h4>
        <div class="flex flex-col gap-2" v-if="selectedFiles.length > 0 && selectedFiles[0].tags.length > 0">
            <div class="flex flex-wrap gap-1">
                <span 
                    v-for="tag in selectedFiles[0].tags" 
                    :key="tag.id" 
                    class="py-0.5 px-2 rounded-sm text-xs text-white inline-flex items-center gap-1"
                    :class="`tag-source-${tag.source}`"
                    :style="{ backgroundColor: tag.color }"
                >
                    {{ tag.name }}
                    <span v-if="tag.source === 'ai'" class="text-[10px] opacity-90 font-medium">
                        🤖 {{ (tag.confidence * 100).toFixed(0) }}%
                    </span>
                    <span v-else class="text-xs opacity-90">👤</span>
                </span>
            </div>
        </div>
        <div class="flex flex-col gap-2" v-else>
            <div class="text-sm text-text-secondary text-center py-2">选择文件查看标签信息</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as DatType from '@/utils/dataTypedef'

defineProps<{
    selectedFiles: DatType.File[];
}>();
</script>

<style scoped>
.tag-source-ai {
    border-left: 3px solid rgba(255, 255, 255, 0.8);
}

.tag-source-manual {
    border-left: 3px solid rgba(255, 255, 255, 0.5);
}
</style>
