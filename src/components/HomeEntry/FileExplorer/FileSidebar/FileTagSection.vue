<template>
    <div class="sidebar-section" v-if="selectedFiles.length > 0 && selectedFiles[0].tags.length > 0">
        <h4 class="section-title">
            <span class="section-icon">🏷️</span>
            标签信息
        </h4>
        <div class="section-content">
            <div class="tag-list">
                <span 
                    v-for="tag in selectedFiles[0].tags" 
                    :key="tag.id" 
                    class="tag-item"
                    :style="{ backgroundColor: tag.color }"
                >
                    {{ tag.name }}
                </span>
            </div>
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
}
</style>
