<template>
    <div class="xc-card" :style="{
        backgroundColor: isChecked ? '#e0f7fa' : 'transparent',
        width: `${cardWidth}px`,
        height: `${cardHeight}px`
    }">
        <!-- 左上角的 checkbox -->
        <div class="xc-card-checkbox-container">
            <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" />
        </div>
        <div class="xc-card-content" @click="btnclk_dir">
            <div class="xc-card-icon">
                <img src="/assets/images/folders.svg" alt="icon" />
                <!-- <img :src="item.icon" alt="icon" /> -->
            </div>
            <div class="xc-card-desc">{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import '@/assets/common.css'
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
const appStore = useAppStore()
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

// 记录 checkbox 的状态
const isChecked = ref(props.checked || false);

// 处理 checkbox 状态变化
const handleCheckboxChange = () => {
};

function btnclk_dir() {
    appStore.curPath = props.item.path;
    console.log('click', props.item);
    appStore.searchCon.pathType = 'curPath';
    Utils.files_get(null)
};
</script>

<style scoped></style>