<template>
    <div class="file-explorer">
        <!-- 路径显示区域 -->
        <div class="path-display">

            <span v-for="(part, index) in pathParts" :key="index" @click="navigateToPath(part.path)" class="path-part">
                {{ part.name }}
                <HardDiskIcon v-if="part.name == ''" />
                <span v-if="index < pathParts.length - 1">/</span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'
import { HardDiskIcon } from '@/components/Icon'
class PathPart {
    name: string = '';
    path: string = '';
}

const currentPath = computed(() => {
    return appStore.curPath
});

// 解析路径为可点击的部分
const pathParts: ComputedRef<PathPart[]> = computed(() => {
    // 处理空路径和首尾 /，过滤空元素
    const parts = currentPath.value.split('/').filter(part => part !== '');
    const re = parts.map((part, index) => {
        const pathElements = parts.slice(0, index + 1);
        const path = '/' + pathElements.join('/'); // 确保路径以 / 开头
        const pathPart = new PathPart();
        pathPart.name = part;
        pathPart.path = path;
        return pathPart;
    });
    // 在 re 的前面加一个 root
    const rootPart = new PathPart();
    rootPart.name = '';
    rootPart.path = '/';
    re.unshift(rootPart);
    return re;
});

// 导航到指定路径
const navigateToPath = (path: string) => {
    appStore.searchCon.pathType = 'curPath';
    Utils.dir_slt_update(path);
};
</script>

<style scoped>
.file-explorer {
    padding: 0px;
}

/* 路径显示样式 */
.path-display {
    margin-bottom: 20px;
    font-size: 16px;
    background-color: var(--xc-background-color-hover);
    color: var(--xc-text-color);
    border-radius: 10px;
    border: var(--xc-border);
}

.path-display:hover {
    border: var(--xc-border-hover);
}

.path-part {
    cursor: pointer;
    color: #030c14;
    text-decoration: underline;
    color: var(--xc-text-color);
}

.path-part:hover {
    color: #0056b3;
}
</style>