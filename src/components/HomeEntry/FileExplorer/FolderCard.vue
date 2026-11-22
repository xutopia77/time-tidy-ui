<template>
    <div class="xc-card" :class="{ 'checked': isChecked, 'no-info': !showCardInfo }" :style="{
        width: `${cardWidth}px`
    }">
        <div class="xc-card-checkbox-container">
            <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" class="xc-checkbox" />
        </div>
        <div class="xc-card-content" @click="btnclk_dir">
            <div 
                class="flex items-center justify-center transition-transform duration-200"
                :class="{ 'tile-mode': isTileMode, 'group-hover:scale-105': true }"
                :style="{ height: `${cardHeight}px` }"
            >
                <FolderClose :size="cardWidth - 80" :strokeWidth=1 color="#333" />
            </div>
            <div v-if="showCardInfo" class="flex items-center justify-center py-2">
                <p class="font-medium text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-full">{{ item.name }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
import { logger } from '@/common/logger';
const appStore = useAppStore()
import Utils from '@/utils/utils';
import { FolderClose } from '@icon-park/vue-next'

const props = defineProps<{
    item: DatType.DirItem;
    checked?: boolean;
}>();

const cardWidth = computed(() => {
    return appStore.cardWidth;
});

const cardHeight = computed(() => {
    return appStore.cardHeight;
});

const showCardInfo = computed(() => {
    return appStore.cardViewMode === 'card';
});

const isTileMode = computed(() => {
    return appStore.cardViewMode === 'tile' || appStore.cardViewMode === 'adaptive';
});

const isChecked = ref(props.checked || false);

const handleCheckboxChange = () => {
    appStore.curDirs.forEach((folder) => {
        if (folder.id == props.item.id) {
            folder.checked = isChecked.value;
        }
    })
};

function btnclk_dir() {
    if (appStore.searchCon.pathType === 'allPath') {
        Utils.message_notify({ 
            content: '当前为全部文件搜索模式，无法跳转文件夹', 
            type: 'warning' 
        });
        return;
    }
    logger.debug('click', props.item);
    appStore.searchCon.pathType = 'curPath';
    Utils.dir_slt_update(props.item.path)
};
</script>

<style scoped>
.xc-card.checked {
    border-color: var(--color-primary);
    background-color: rgba(99, 102, 241, 0.1);
}

.xc-card.no-info {
    height: auto;
}

.tile-mode {
    overflow: hidden;
}

.tile-mode :deep(svg) {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
