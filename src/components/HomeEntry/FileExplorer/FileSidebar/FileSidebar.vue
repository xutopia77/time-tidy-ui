<template>
    <transition name="sidebar-slide">
        <div v-if="visible" class="w-[280px] bg-bg-secondary border-l border-border overflow-y-auto flex-shrink-0">
            <div class="flex justify-between items-center py-3 px-3 border-b border-border sticky top-0 bg-bg-secondary z-10">
                <h3 class="m-0 text-lg text-text-primary">信息面板</h3>
                <button class="w-7 h-7 border-none bg-transparent text-text-secondary text-xl cursor-pointer rounded-sm flex items-center justify-center transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary" @click="$emit('close')">×</button>
            </div>

            <FileInfoSection :selected-files="displayFiles" />
            
            <FileTagSection :selected-files="displayFiles" />
            
            <FolderListSection 
                :dirs="dirs"
                :is-all-path-search="isAllPathSearch"
                @enter-folder="$emit('enter-folder', $event)"
            />
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
import FileInfoSection from './FileInfoSection.vue'
import FileTagSection from './FileTagSection.vue'
import FolderListSection from './FolderListSection.vue'

const appStore = useAppStore();

const props = defineProps<{
    visible: boolean;
    selectedFiles: DatType.File[];
    dirs: DatType.DirItem[];
    isAllPathSearch: boolean;
}>();

defineEmits<{
    (e: 'close'): void;
    (e: 'enter-folder', dir: DatType.DirItem): void;
}>();

const displayFiles = computed(() => {
    if (appStore.hoverFile && props.visible) {
        return [appStore.hoverFile];
    }
    return props.selectedFiles;
});
</script>

<style scoped>
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
    transition: all 200ms;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
