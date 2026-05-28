<template>
    <div class="xc-card" :class="{ 'checked': isChecked }" :style="{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`
    }">
        <div class="xc-card-checkbox-container">
            <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" class="xc-checkbox" />
        </div>
        <div class="xc-card-content" @click="btnclk_dir">
            <div class="xc-card-icon">
                <FolderClose :size="cardWidth - 80" :strokeWidth=1 color="#333" />
            </div>
            <div class="xc-card-desc">
                <p class="xc-card-name xc-card-foldername">{{ item.name }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'
import Utils from '@/utils/utils';
import { FolderClose } from '@icon-park/vue-next'

const props = defineProps<{
    item: DatType.DirItem;
    // 新增：接收是否选中的初始状态
    checked?: boolean;
}>();

const cardWidth = computed(() => {
    return appStore.cardWidth;
});

const cardHeight = computed(() => {
    return appStore.cardWidth;
});

const isChecked = ref(props.checked || false);

// 处理 checkbox 状态变化
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
    console.log('click', props.item);
    appStore.searchCon.pathType = 'curPath';
    Utils.dir_slt_update(props.item.path)
};
</script>

<style scoped>
.xc-card.checked {
    border-color: var(--xc-primary-color);
    background-color: rgba(74, 111, 165, 0.1);
}

.xc-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--xc-transition-normal);
}

.xc-card:hover .xc-card-icon {
    transform: scale(1.05);
}

.xc-card-desc {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--xc-spacing-sm);
}

.xc-card-foldername {
    font-weight: 500;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}
</style>