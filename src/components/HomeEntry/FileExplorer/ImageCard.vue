<template>
    <div class="xc-card" :style="{
        backgroundColor: isChecked ? 'var(--xc-background-color-hover)' : 'transparent',
        width: `${cardWidth}px`
        // 移除 height 设置，让高度自适应
    }">
        <!-- 左上角的 checkbox -->
        <div class="xc-card-checkbox-container">
            <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" class="xc-checkbox" />
        </div>
        <div class="xc-card-content">
            <div class="xc-card-icon" :style="{
                height: `${cardHeight}px`
            }" @click="btnclk_handleClickImage">
                <img :src="item.icon" alt="icon" />
            </div>
            <div class="xc-card-desc" @click="btnclk_handleClickItemMsg">
                <p class="xc-card-name">{{ item.name }}</p>
                <p class="xc-card-name"><span style="color: #6c4d4d;">{{ Utils.gen_size_str(item.size) }}</span> <span
                        style="color: #22586f;">{{ item.time }}</span>
                </p>
                <p class="xc-card-name"></p>
                <div class="xc-card-tags">
                    <div v-for="(tag, index) in item.tags" :key="index" class="xc-tag" :style="{
                        backgroundColor: tag.color
                    }">{{ Utils.tagName2Display(tag.name) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'

const props = defineProps<{ item: DatType.File; }>();

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

watch(() => props.item.checked, (newValue) => {
    isChecked.value = newValue;
});

const btnclk_handleClickImage = () => {
    if (appStore.envMode == DatType.EnvModeType.pro) {
        if (appStore.platform != DatType.PlatformType.electron) {
            if (props.item.type != DatType.FileType.image) {
                Utils.message_notify({ content: ` 当前文件不是图片类型，无法查看`, type: 'success' })
                return;
            }
        }
    }
    console.log('click image', props.item);
    appStore.curSltFile = props.item;
    appStore.bPageImgView = true
};

const btnclk_handleClickItemMsg = () => {
    appStore.curSltFile = props.item;
};
</script>

<style scoped>
.xc-card {
    /* 让高度自适应内容 */
    height: auto;
}

.xc-card-content {
    /* 让内容区域高度自适应 */
    height: auto;
}

.xc-card-desc {
    /* 让描述区域高度自适应 */
    height: auto;
}

.xc-card-tags {
    display: flex;
    flex-wrap: wrap;
    /* 允许标签换行 */
    /* 让标签区域高度自适应 */
    height: auto;
}
</style>