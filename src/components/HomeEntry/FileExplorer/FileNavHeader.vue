<template>
    <div class="file-explorer">
        <div class="path-display">
            <span 
                v-for="(part, index) in pathParts" 
                :key="index" 
                class="path-item"
                :class="{ 'is-current': index === pathParts.length - 1 }"
            >
                <span 
                    @click="navigateToPath(part.path)" 
                    class="path-part"
                    :class="{ 'clickable': index < pathParts.length - 1 }"
                >
                    <HardDisk v-if="part.name == ''" size="16" />
                    <span v-else>{{ part.name }}</span>
                </span>
                <span v-if="index < pathParts.length - 1" class="path-separator">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                </span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import '@/assets/common.css'
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import { HardDisk } from '@icon-park/vue-next'

class PathPart {
    name: string = '';
    path: string = '';
}

const currentPath = computed(() => {
    return appStore.curPath
});

const pathParts: ComputedRef<PathPart[]> = computed(() => {
    const parts = currentPath.value.split('/').filter(part => part !== '');
    const re = parts.map((part, index) => {
        const pathElements = parts.slice(0, index + 1);
        const path = '/' + pathElements.join('/');
        const pathPart = new PathPart();
        pathPart.name = part;
        pathPart.path = path;
        return pathPart;
    });
    const rootPart = new PathPart();
    rootPart.name = '';
    rootPart.path = '/';
    re.unshift(rootPart);
    return re;
});

const navigateToPath = (path: string) => {
    appStore.searchCon.pathType = 'curPath';
    Utils.dir_slt_update(path);
};
</script>

<style scoped>
.file-explorer {
    padding: var(--xc-spacing-md) var(--xc-spacing-lg);
    background-color: var(--xc-background-color);
    border-radius: var(--xc-border-radius-md);
    margin-bottom: var(--xc-spacing-lg);
}

.path-display {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--xc-spacing-xs);
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
}

.path-item {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
}

.path-part {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: var(--xc-border-radius-sm);
    transition: all var(--xc-transition-normal);
    cursor: default;
    user-select: none;
}

.path-part.clickable {
    cursor: pointer;
}

.path-part.clickable:hover {
    background-color: var(--xc-background-color-hover);
    color: var(--xc-primary-color);
}

.path-part.clickable:active {
    transform: scale(0.98);
}

.path-item.is-current .path-part {
    font-weight: 500;
    color: var(--xc-text-color);
}

.path-separator {
    display: flex;
    align-items: center;
    color: var(--xc-text-color-secondary);
    opacity: 0.5;
    margin: 0 var(--xc-spacing-xs);
}

.path-separator svg {
    display: block;
}
</style>