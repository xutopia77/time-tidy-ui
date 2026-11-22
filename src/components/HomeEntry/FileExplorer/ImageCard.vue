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
                <n-dropdown trigger="click" placement="bottom-end" :options="menuOptions"
                    @select="onMenuSelect" @update:show="(v: boolean) => menuOpen = v">
                    <button class="xc-card-kebab" data-testid="file-card-menu" aria-label="file actions"
                        :class="{ 'menu-open': menuOpen }" @click.stop>⋮</button>
                </n-dropdown>
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
import { NDropdown } from 'naive-ui';
import type { DropdownOption } from 'naive-ui';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils'
import { formatUtcToLocal, tag_text_color as tagTextColor } from '@/common/format';
import { useAppStore } from '@/stores/AppStore';
import { logger } from '@/common/logger';
const appStore = useAppStore()
const { t } = useI18n();

const props = defineProps<{ item: DatType.File; }>();

const emit = defineEmits<{
    (e: 'cardAction', action: DatType.CardMenuAction): void;
}>();

// ==================== kebab menu ====================
const menuOpen = ref(false);

const menuOptions = computed<DropdownOption[]>(() => [
    {
        key: 'score',
        label: t('actionBar.score'),
        children: [1, 2, 3, 4, 5].map(score => ({
            key: `score-${score}`,
            label: `${score}☆`,
        })),
    },
    { key: 'tag', label: t('actionBar.tag') },
    { key: 'move', label: t('actionBar.move') },
    { key: 'copy', label: t('actionBar.copy') },
    { key: 'delete', label: t('actionBar.delete') },
    { key: 'imageSearch', label: t('actionBar.imageSearch') },
]);

const fileScore = computed(() => {
    const scoreTag = props.item.tags.find(tag => /^\d☆$/.test(tag.name));
    return scoreTag ? parseInt(scoreTag.name.replace('☆', '')) : 0;
});

// Make the current card's file the only checked file, so that APIs
// operating on the checked set (files_tag_set/delete, file transfer)
// apply to this card. files_tag_set/delete derive fileIds from the
// checked set and ignore the ids passed in the request.
const selectOnlyThisFile = () => {
    appStore.curFiles.forEach((file) => {
        file.checked = file.id === props.item.id;
    });
    if (appStore.curDirs) {
        appStore.curDirs.forEach((dir) => {
            dir.checked = false;
        });
    }
};

const setFileScore = (score: number) => {
    selectOnlyThisFile();
    const req: DatType.FilesTagSetReq = {
        fileIds: [props.item.id],
        tagName: `${score}☆`
    };
    if (fileScore.value === score) {
        Utils.files_tag_delete(req);
        Utils.message_notify({ content: '已删除评分', type: 'success' });
    } else {
        Utils.files_tag_set(req);
        Utils.message_notify({ content: `已设置评分 ${score}☆`, type: 'success' });
    }
};

const deleteThisFile = () => {
    const req: DatType.FileDeleteReq = {
        fileIds: [props.item.id],
        dirIds: [],
        bRemoveToDtrash: true,
    };
    Utils.files_delete(req);
};

const openFileTransfer = () => {
    selectOnlyThisFile();
    appStore.bPageFileTransfer = true;
};

const onMenuSelect = (key: string | number) => {
    const keyStr = String(key);
    if (keyStr.startsWith('score-')) {
        setFileScore(parseInt(keyStr.slice('score-'.length), 10));
        return;
    }
    switch (keyStr) {
        case 'tag':
            emit('cardAction', { type: 'tag', file: props.item });
            break;
        case 'move':
        case 'copy':
            openFileTransfer();
            break;
        case 'delete':
            deleteThisFile();
            break;
        case 'imageSearch':
            emit('cardAction', { type: 'imageSearch', file: props.item });
            break;
        default:
            logger.warn('unknown card menu key:', keyStr);
            break;
    }
};

// ==================== checkbox ====================
const isChecked = ref(false);

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

/* kebab (three-dot) menu trigger at top-right of card image */
.xc-card-kebab {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 10;
    width: 26px;
    height: 26px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    color: white;
    font-size: 16px;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 150ms;
}

.xc-card:hover .xc-card-kebab,
.xc-card-kebab.menu-open {
    opacity: 1;
}

.xc-card-kebab:hover {
    background: rgba(0, 0, 0, 0.55);
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

/* fixed desc height must match FileExplorer's rowHeight estimate
   (cardHeight + 74) exactly, otherwise absolute-positioned virtual
   scroll rows overlap */
.xc-card-desc {
    height: 74px;
    padding: 6px;
    overflow: hidden;
    box-sizing: border-box;
}

.xc-card-filename {
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--color-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.xc-card-meta {
    display: flex;
    gap: 6px;
    margin-bottom: 4px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
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
    max-height: 26px;
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
