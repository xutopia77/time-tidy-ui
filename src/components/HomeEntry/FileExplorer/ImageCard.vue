<template>
    <div class="xc-card" :class="{ 'checked': isChecked }" :style="{
        width: `${cardWidth}px`
    }">
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
                <p class="xc-card-name xc-card-filename">{{ item.name }}</p>
                <div class="xc-card-meta">
                    <span class="xc-card-size">{{ Utils.gen_size_str(item.size) }}</span>
                    <span class="xc-card-time">{{ item.time }}</span>
                </div>
                <div class="xc-card-tags" v-if="item.tags && item.tags.length > 0">
                    <span v-for="(tag, index) in item.tags" :key="index" class="xc-tag" :style="{
                        backgroundColor: tag.color
                    }">{{ Utils.tagName2Display(tag.name) }}</span>
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
    height: auto;
}

.xc-card.checked {
    border-color: var(--xc-primary-color);
    background-color: rgba(74, 111, 165, 0.1);
}

.xc-card-content {
    height: auto;
}

.xc-card-icon {
    position: relative;
}

.xc-card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity var(--xc-transition-fast);
    border-radius: var(--xc-border-radius-sm);
}

.xc-card:hover .xc-card-overlay {
    opacity: 1;
}

.xc-card-overlay-icon {
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.xc-card-desc {
    height: auto;
    padding: var(--xc-spacing-sm);
}

.xc-card-filename {
    font-weight: 500;
    margin-bottom: var(--xc-spacing-xs);
    color: var(--xc-text-color);
}

.xc-card-meta {
    display: flex;
    gap: var(--xc-spacing-sm);
    margin-bottom: var(--xc-spacing-xs);
    font-size: var(--xc-font-size-xs);
}

.xc-card-size {
    color: var(--xc-text-color-secondary);
}

.xc-card-time {
    color: var(--xc-text-color-secondary);
}

.xc-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    height: auto;
    margin-top: var(--xc-spacing-xs);
}

.xc-tag {
    display: inline-block;
    padding: 2px var(--xc-spacing-xs);
    border-radius: var(--xc-border-radius-sm);
    font-size: var(--xc-font-size-xs);
    color: white;
    transition: all var(--xc-transition-fast);
}

.xc-tag:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>