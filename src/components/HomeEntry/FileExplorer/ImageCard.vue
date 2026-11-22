<template>
    <div class="xc-card" :class="{ 'checked': isChecked, 'no-info': !showCardInfo }" :style="{
        width: `${cardWidth}px`
    }" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div class="xc-card-checkbox-container">
            <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" class="xc-checkbox" />
        </div>
        <div class="xc-card-content">
            <div class="xc-card-icon" :class="{ 'tile-mode': isTileMode }" :style="{
                height: `${cardHeight}px`
            }" @click="btnclk_handleClickImage">
                <img :src="item.icon" alt="icon" />
            </div>
            <div v-if="showCardInfo" class="xc-card-desc" @click="btnclk_handleClickItemMsg">
                <p class="xc-card-name xc-card-filename">{{ item.name }}</p>
                <div class="xc-card-meta">
                    <span class="xc-card-size">{{ Utils.gen_size_str(item.size) }}</span>
                    <span class="xc-card-time">{{ formatUtcToLocal(item.time) }}</span>
                </div>
                <div v-if="showFilePath" class="xc-card-path" :title="item.path">
                    {{ item.path }}
                </div>
                <div class="xc-card-tags" v-if="item.tags && item.tags.length > 0">
                    <span v-for="(tag, index) in item.tags" :key="index" class="xc-tag" :style="{
                        backgroundColor: tag.color,
                        color: tagTextColor(tag.color)
                    }">{{ Utils.tagName2Display(tag.name) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils'
import { formatUtcToLocal, tag_text_color as tagTextColor } from '@/common/format';
import { useAppStore } from '@/stores/AppStore';
import { logger } from '@/common/logger';
const appStore = useAppStore()
const { t } = useI18n();

const props = defineProps<{ item: DatType.File; }>();

const cardWidth = computed(() => {
    return appStore.cardWidth;
});
const cardHeight = computed(() => {
    return appStore.cardHeight;
});

const showFilePath = computed(() => {
    return appStore.searchCon.pathType === 'allPath';
});

const showCardInfo = computed(() => {
    return appStore.cardViewMode === 'card';
});

const isTileMode = computed(() => {
    return appStore.cardViewMode === 'tile' || appStore.cardViewMode === 'adaptive';
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
                Utils.message_notify({ content: t('card.notImageType'), type: 'success' })
                return;
            }
        }
    }
    logger.debug('click image', props.item);
    appStore.curSltFile = props.item;
    appStore.bPageImgView = true
};

const btnclk_handleClickItemMsg = () => {
    appStore.curSltFile = props.item;
};

const handleMouseEnter = () => {
    appStore.hoverFile = props.item;
};

const handleMouseLeave = () => {
    appStore.hoverFile = null;
};
</script>

<style scoped>
.xc-card {
    height: auto;
}

.xc-card.checked {
    border-color: var(--color-primary);
    background-color: rgba(99, 102, 241, 0.1);
}

.xc-card.no-info {
    height: auto;
}

.xc-card-content {
    height: auto;
}

.xc-card-icon {
    position: relative;
}

.xc-card-icon.tile-mode {
    overflow: hidden;
}

.xc-card-icon.tile-mode img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.xc-card-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
    transition: opacity 150ms;
    border-radius: 2px;
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
    padding: 6px;
}

.xc-card-filename {
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--color-text-primary);
}

.xc-card-meta {
    display: flex;
    gap: 6px;
    margin-bottom: 4px;
    font-size: 12px;
}

.xc-card-size {
    color: var(--color-text-secondary);
}

.xc-card-time {
    color: var(--color-text-secondary);
}

.xc-card-path {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.8;
}

.xc-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
    max-height: 60px;
    overflow: hidden;
}

.xc-tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    color: white;
    transition: all 150ms;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.xc-tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
