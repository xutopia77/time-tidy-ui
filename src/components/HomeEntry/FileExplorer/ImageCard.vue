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
        <div class="xc-card-content">
            <div class="xc-card-icon" @click="btnclk_handleClickImage">
                <img :src="item.icon" alt="icon" />
            </div>
            <div class="xc-card-desc" @click="btnclk_handleClickItemMsg">{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'

const props = defineProps<{ item: DatType.FileItem; }>();

const cardWidth = computed(() => {
    return appStore.cardWidth;
});

const cardHeight = computed(() => {
    return appStore.cardWidth;
});

const isChecked = ref(false);
const handleCheckboxChange = () => {
    appStore.curFiles.forEach((file) => {
        if (file.id == props.item.id) {
            file.checked = isChecked.value;
        }
    })
};

const btnclk_handleClickImage = () => {
    if (appStore.envMode == DatType.EnvModeType.pro) {
        if (appStore.platform != DatType.PlatformType.electron) {
            if (props.item.type != DatType.FileType.image) {
                Utils.message_notify({ content: ` 当前文件不是图片类型，无法查看` })
                return;
            }
        }
    }
    console.log('click image', props.item);
    appStore.curSltFile = props.item;
    Utils.page_show({ page: 'imageView', bShow: true })
};

const btnclk_handleClickItemMsg = () => {
    appStore.curSltFile = props.item;
};
</script>

<style scoped></style>