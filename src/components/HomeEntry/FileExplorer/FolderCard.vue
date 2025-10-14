<template>
    <div class="xc-card" :style="{
        backgroundColor: isChecked ? 'var(--xc-background-color-hover)' : 'transparent',
        width: `${cardWidth}px`,
        height: `${cardHeight}px`
    }">
        <!-- 左上角的 checkbox -->
        <div class="xc-card-checkbox-container">
            <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" class="xc-checkbox" />
        </div>
        <div class="xc-card-content" @click="btnclk_dir">
            <div class="xc-card-icon">
                <FolderClose v-bind="iconProps" :size="cardWidth - 64" :strokeWidth=1 color="#333" />
            </div>
            <div class="xc-card-desc">{{ item.name }}</div>
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
const iconProps = computed(() => (appStore.iconProps))

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
    console.log('click', props.item);
    appStore.searchCon.pathType = 'curPath';
    Utils.dir_slt_update(props.item.path)
};
</script>

<style scoped></style>