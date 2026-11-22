<template>
    <div class="py-3 px-4 bg-bg-secondary rounded-lg mb-4">
        <div class="flex items-center flex-wrap gap-1 text-base text-text-primary">
            <span
                v-for="(part, index) in pathParts"
                :key="index"
                class="flex items-center gap-1"
                :class="{ 'is-current': index === pathParts.length - 1 }"
            >
                <span
                    @click="navigateToPath(part.path)"
                    class="flex items-center py-1.5 px-2.5 rounded-sm transition-all duration-200 cursor-default select-none"
                    :class="{
                        'cursor-pointer hover:bg-bg-tertiary hover:text-primary active:scale-[0.98]': index < pathParts.length - 1,
                        'font-medium text-text-primary': index === pathParts.length - 1
                    }"
                >
                    <HardDisk v-if="part.name == ''" size="16" />
                    <span v-else>{{ part.name }}</span>
                </span>
                <span v-if="index < pathParts.length - 1" class="flex items-center text-text-secondary opacity-50 mx-1">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                </span>
            </span>
            <span class="ml-auto text-text-secondary text-sm">{{ appStore.curFileTotal }} {{ t('sidebar.files') }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
const { t } = useI18n();
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

// navigate via breadcrumb; root ('/') means show all files
const navigateToPath = (path: string) => {
    Utils.dir_slt_update(path);
};
</script>
