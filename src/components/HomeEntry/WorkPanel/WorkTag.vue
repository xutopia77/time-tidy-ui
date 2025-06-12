<template>
    <div>
        <input v-model="newTag" @keyup.enter="addTag" placeholder="输入新标签并按回车键添加" class="tag-input" />
        <div v-for="(tag, index) in fileTags" :key="index" class="xc-tag" :style="{
            backgroundColor: tag.color
        }">
            {{ tag.name }}
            <button @click="removeTag(tag)" class="delete-btn">
                <XIcon style="padding: 0;" />
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

const fileTags = computed(() => {
    if (appStore.curSltFile == null) return []
    return appStore.curSltFile.tags
});

// 添加标签方法
const addTag = () => {
    const req: DatType.FilesTagSetReq = {
        fileIds: [],
        tagName: ''
    };
    if (newTag.value.trim()) {
        req.tagName = newTag.value.trim()
        newTag.value = '';
    }
    for (const item of appStore.curFiles) {
        if (item.checked)
            req.fileIds.push(item.id)
    }
    if (req.fileIds.length > 0) {
        Utils.files_tag_set(req)
        return
    }
    if (appStore.curSltFile == null) return;
    req.fileIds.push(appStore.curSltFile.id)
    Utils.files_tag_set(req)
}

const removeTag = (tag: DatType.FileItemTag) => {
    if (appStore.curSltFile?.id == null) return
    const req: DatType.FilesTagSetReq = {
        fileIds: [appStore.curSltFile.id],
        tagName: tag.name
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
    /* 设置鼠标悬停时的背景颜色 */
    border: var(--xc-border-hover);
}

.delete-btn {
    margin-left: 0px;
    padding: 0px;
    border: none;
    background: none;
    cursor: pointer;
    color: #ff4444;
    font-weight: bold;
}

.delete-btn:hover {
    color: #cc0000;
}
</style>