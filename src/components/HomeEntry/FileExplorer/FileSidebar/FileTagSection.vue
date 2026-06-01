<template>
    <div class="sidebar-section">
        <h4 class="section-title">
            <span class="section-icon">🏷️</span>
            标签信息
        </h4>
        <div class="section-content" v-if="selectedFiles.length > 0 && selectedFiles[0].tags.length > 0">
            <div class="tag-list">
                <span 
                    v-for="tag in selectedFiles[0].tags" 
                    :key="tag.id" 
                    class="tag-item"
                    :class="`tag-source-${tag.source}`"
                    :style="{ backgroundColor: tag.color }"
                >
                    {{ tag.name }}
                    <span v-if="tag.source === 'ai'" class="tag-badge ai-badge">
                        🤖 {{ (tag.confidence * 100).toFixed(0) }}%
                    </span>
                    <span v-else class="tag-badge manual-badge">👤</span>
                </span>
            </div>
        </div>
        <div class="section-content" v-else>
            <div class="empty-hint">选择文件查看标签信息</div>
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

.section-content {
    display: flex;
    flex-direction: column;
    gap: var(--xc-spacing-sm);
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-xs);
}

.tag-item {
    padding: 2px 8px;
    border-radius: var(--xc-border-radius-sm);
    font-size: var(--xc-font-size-sm);
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.tag-source-ai {
    border-left: 3px solid rgba(255, 255, 255, 0.8);
}

.tag-source-manual {
    border-left: 3px solid rgba(255, 255, 255, 0.5);
}

.tag-badge {
    font-size: 10px;
    opacity: 0.9;
}

.ai-badge {
    font-weight: 500;
}

.manual-badge {
    font-size: 12px;
}

.empty-hint {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    text-align: center;
    padding: var(--xc-spacing-sm) 0;
}
</style>
