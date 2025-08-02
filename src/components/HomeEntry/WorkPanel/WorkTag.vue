<template>
    <div>
        <input v-model="newTag" @keyup.enter="btn_addTag" placeholder="输入新标签并按回车键添加" class="tag-input"
            list="tagSuggestions" />
        <datalist id="tagSuggestions" class="input-suggestions">
            <option v-for="tag in tagSuggestions" :key="tag" :value="tag"></option>
        </datalist>
        <div v-for="(tag, index) in fileTags" :key="index" class="xc-tag" :style="{
            backgroundColor: tag.color
        }">
            {{ tag.name }}
            <button @click="btn_removeTag(tag)" class="delete-btn">
                <XIcon width="12" height="12" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils';
import '@/assets/common.css';
import { XIcon } from '@/components/Icon'
// 新标签输入值
const newTag = ref('');

// 联想标签集合，这里假设从 appStore.allTags 获取
const tagSuggestions = computed(() => appStore.allTags.map(tag => tag.name));

const fileTags = computed(() => {
    const fSlt: DatType.File[] = [];
    for (const item of appStore.curFiles) {
        if (item.checked)
            fSlt.push(item)
    }
    if (fSlt.length > 0) {
        const allTags: DatType.FileItemTag[] = [];
        for (const item of fSlt) {
            for (const tag of item.tags) {
                if (!allTags.some(t => t.name === tag.name)) {
                    allTags.push(tag);
                }
            }
        }
        return allTags;
    }

    if (appStore.curSltFile == null) return []
    return appStore.curSltFile.tags
});

// 添加标签方法
const btn_addTag = () => {
    const req: DatType.FilesTagSetReq = {
        fileIds: [],
        tagName: ''
    };
    if (newTag.value.trim()) {
        req.tagName = newTag.value.trim()
        newTag.value = '';
    }
    Utils.files_tag_set(req)
}

const btn_removeTag = (tag: DatType.FileItemTag) => {
    if (appStore.curSltFile?.id == null) return
    const req: DatType.FilesTagSetReq = {
        tagName: tag.name,
        fileIds: []
    };
    Utils.files_tag_delete(req)
};
</script>

<style scoped>
.tag-input {
    width: 160px;
    height: var(--xc-normal-height);
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border: var(--xc-border);
    border-radius: 4px;
    outline: none;
    padding: var(--xc-normal-padding);
    margin: var(--xc-normal-margin);
}

.tag-input:hover {
    background-color: var(--xc-background-color);
    border: var(--xc-border-hover);
}

.input-suggestions {
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
}

/* 尝试设置 option 样式 */
.input-suggestions option {
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
}

/* 针对 Chrome 和 Safari */
.tag-input::-webkit-calendar-picker-indicator {
    background-color: var(--xc-background-color);
}

/* 针对 Firefox */
.tag-input::-moz-list-bullet {
    background-color: var(--xc-background-color);
}

.delete-btn {
    margin-left: 0px;
    padding: 0px;
    border: none;
    background: none;
    cursor: pointer;
    color: #ff4444;
    font-weight: bold;
    border-radius: 4px;
}

.delete-btn:hover {
    border: var(--xc-border-hover);
    color: #cc0000;
}
</style>