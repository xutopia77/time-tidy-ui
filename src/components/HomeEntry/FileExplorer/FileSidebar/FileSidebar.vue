<template>
    <transition name="sidebar-slide">
        <div v-if="visible" class="w-[280px] bg-bg-secondary border-l border-border overflow-y-auto flex-shrink-0 xc-scrollbar">
            <div class="flex justify-between items-center py-3 px-3 border-b border-border sticky top-0 bg-bg-secondary z-10">
                <h3 class="m-0 text-lg text-text-primary">{{ t('sidebar.infoPanel') }}</h3>
                <button class="w-7 h-7 border-none bg-transparent text-text-secondary text-xl cursor-pointer rounded-sm flex items-center justify-center transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary" @click="$emit('close')">×</button>
            </div>

            <div class="px-3">
                <FileInfoSection :selected-files="displayFiles" v-model:collapsed="sectionCollapsed.fileInfo" />
                
                <FileTagSection :selected-files="displayFiles" v-model:collapsed="sectionCollapsed.fileTag" />
                
                <FolderListSection
                    :dirs="dirs"
                    v-model:collapsed="sectionCollapsed.folderList"
                    @enter-folder="$emit('enter-folder', $event)"
                />

                <TagPanelSection 
                    :tags="allTags"
                    v-model:collapsed="sectionCollapsed.tagPanel"
                    @tag-click="onTagClick"
                />
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
import FileInfoSection from './FileInfoSection.vue'
import FileTagSection from './FileTagSection.vue'
import FolderListSection from './FolderListSection.vue'
import TagPanelSection from './TagPanelSection.vue'

const { t } = useI18n();
const appStore = useAppStore();

const props = defineProps<{
    visible: boolean;
    selectedFiles: DatType.File[];
    dirs: DatType.DirItem[];
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

const allTags = computed(() => appStore.allTags);

// collapse state: fileInfo and fileTag default expanded, folderList and tagPanel default collapsed
const sectionCollapsed = reactive({
    fileInfo: false,
    fileTag: false,
    folderList: true,
    tagPanel: true,
});

function onTagClick(tag: DatType.TagItem) {
    appStore.searchCon.tags = [tag.name];
    Utils.files_get();
}
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
