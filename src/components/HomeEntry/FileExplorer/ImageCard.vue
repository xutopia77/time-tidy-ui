<template>
    <div class="file-card common-card" :style="{ backgroundColor: isChecked ? '#e0f7fa' : 'transparent' }">
        <!-- 左上角的 checkbox -->
        <div class="checkbox-container">
            <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" />
        </div>
        <div class="file-content">
            <div class="file-icon" @click="btnclk_handleClickImage">
                <img :src="item.icon" alt="icon" />
            </div>
            <div class="file-name" @click="btnclk_handleClickItemMsg">{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'

const props = defineProps<{ item: DatType.FileItem; }>();

const isChecked = ref(false);
const handleCheckboxChange = () => {
    appStore.curFiles.forEach((file) => {
        if (file.id == props.item.id) {
            file.checked = isChecked.value;
        }
    })
};

const btnclk_handleClickImage = () => {


    // if (appStore.platform != DatType.PlatformType.electron) {
    //     if (props.item.type != DatType.FileType.image) {
    //         Utils.message_notify({ content: ` 当前文件不是图片类型，无法查看` })
    //         return;
    //     }
    // }
    console.log('click image', props.item);
    appStore.curSltFile = props.item;
    Utils.page_show({ page: 'imageView', bShow: true })
};

const btnclk_handleClickItemMsg = () => {
    appStore.curSltFile = props.item;
};
</script>

<style scoped>
.file-card {
    text-align: center;
    position: relative;
    /* 为 checkbox 定位做准备 */
    transition: background-color 0.3s;
    /* 添加过渡效果 */
}

.file-card:hover {
    background-color: #f0f0f0;
}

.checkbox-container {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
    /* 确保 checkbox 在图片上方 */
}

.file-content {
    cursor: pointer;
}

.file-icon img {
    width: 360px;
    height: 360px;
    margin: 2px;
    object-fit: contain;
    /* 可选 cover/none/scale-down */
}

.file-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: small;
}
</style>