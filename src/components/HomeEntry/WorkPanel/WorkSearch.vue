<template>
    <div>
        <label> 排序依据: </label>
        <select v-model="sortBy" class="xc-select">
            <option value="">默认</option>
            <option value="name">名称</option>
            <option value="size">大小</option>
            <option value="time">时间</option>
            <option value="type">类型</option>
        </select>
        <label> 排序顺序: </label>
        <select v-model="sortOrder" class="xc-select">
            <option value="asc">升序</option>
            <option value="desc">降序</option>
        </select>
        <br>
        <label>文件夹:</label>
        <select v-model="pathType" class="xc-select">
            <option value="curPath">当前路径</option>
            <option value="allPath">所有路径</option>
        </select>
        <div class="tags-panel">
            <label> 文件标签({{ curSltTagNum }}): </label>
            <input type="checkbox" v-model="bReverseSltTag" class="xc-checkbox" /> 反选
            <!-- 动态绑定 selected 类 -->
            <div v-for="(tag, index) in fileTags" :key="index" class="xc-tag" :class="{ selected: isTagSelected(tag) }"
                :style="{ backgroundColor: tag.color }" @click="btnclk_tag(tag)">
                {{ tag.name }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils';
import { computed } from 'vue';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'

// 排序依据
const sortBy = computed({
    get: () => appStore.searchCon.sortBy,
    set: (newValue) => {
        appStore.searchCon.sortBy = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});

// 搜索排序
const sortOrder = computed({
    get: () => appStore.searchCon.sortOrder,
    set: (newValue) => {
        appStore.searchCon.sortOrder = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});

// 按照文件夹搜索
const pathType = computed({
    get: () => appStore.searchCon.pathType,
    set: (newValue) => {
        appStore.searchCon.pathType = newValue;
        Utils.files_get(null);
    }
});

// 判断标签是否被选中
const isTagSelected = (tag: DatType.FileItemTag) => {
    return appStore.searchCon.tags.includes(tag.name);
};

const curSltTagNum = computed(() => {
    return appStore.searchCon.tags.length;
});

// ------------------------------------ tag
const bReverseSltTag = computed({
    get: () => appStore.searchCon.bReverseSltTag,
    set: (newValue) => {
        appStore.searchCon.bReverseSltTag = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});

// 点击标签处理方法
function btnclk_tag(tag: DatType.FileItemTag) {
    const tags = appStore.searchCon.tags;
    const tagIndex = tags.indexOf(tag.name);
    if (tagIndex === -1) {
        // 标签不存在则添加
        appStore.searchCon.tags.push(tag.name);
    } else {
        // 标签已存在则移除
        appStore.searchCon.tags.splice(tagIndex, 1);
    }
    // 触发文件重新获取以应用新的标签过滤条件
    Utils.files_get(null);
}

const fileTags = computed(() => {
    const bGetAllTag = true
    if (bGetAllTag) {
        const uniqueTags: DatType.FileItemTag[] = [];
        for (const item of appStore.allTags) {
            uniqueTags.push({ name: item.name, color: item.color });
        }
        return uniqueTags;
    }
    else { // 只是根据当前的文件来获取标签
        // 初始化一个 Set 用于存储不重复标签的唯一标识
        const uniqueTagKeys = new Set<string>();
        const uniqueTags: DatType.FileItemTag[] = [];

        // 遍历 appStore.curFiles
        for (const item of appStore.curFiles) {
            if (item.tags && Array.isArray(item.tags)) {
                // 遍历每个文件的 tags 数组
                for (const tag of item.tags) {
                    // 简单类型检查，确保 tag 符合 DatType.FileItemTag 基本结构
                    if (tag && typeof tag === 'object' && 'name' in tag && 'color' in tag) {
                        // 生成标签的唯一标识
                        const tagKey = `${tag.name}-${tag.color}`;
                        if (!uniqueTagKeys.has(tagKey)) {
                            uniqueTagKeys.add(tagKey);
                            uniqueTags.push(tag as DatType.FileItemTag);
                        }
                    }
                }
            }
        }
        return uniqueTags;
    }
});

</script>

<style scoped>
label {
    margin-left: 2px;
    color: var(--xc-text-color);
    font-size: small;
}

.tags-panel {
    display: flex;
    flex-wrap: wrap;
}
</style>