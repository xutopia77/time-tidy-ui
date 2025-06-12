<template>
    <ul>
        <li v-for="(item, index) in dirTrees" :key="index">
            <!-- 根据是否有子项和展开状态显示对应图标，并添加点击事件切换展开状态 -->
            <span @click="toggleExpand(item)" class="folder-icon">
                <FolderCloseIcon v-if="!item.expanded" />
                <FolderOpenIcon v-if="item.expanded" />
                {{ item.name }}
            </span>
            <!-- 仅在文件夹有子项且展开时渲染子项的 ul -->
            <ul v-if="item.children && item.children.length > 0 && item.expanded" class="sub-folder-list">
                <DirTreeItem :data="item.children" />
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { defineProps, watch, ref } from 'vue'
import '@/assets/common.css'
import { FolderCloseIcon, FolderOpenIcon } from '@/components/Icon'
// import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'

const prop = defineProps<{
    data: DatType.DirTreeItem[];
}>();


const dirTrees = ref<DatType.DirTreeItem[]>(prop.data)

watch(prop, (newVal) => {
    dirTrees.value = newVal.data;
}, { deep: true })

// const dirTrees = computed(() => {
//     return prop.data;
// })


// 切换文件夹展开状态的方法
const toggleExpand = (item: DatType.DirTreeItem) => {
    item.expanded = !item.expanded;
    console.log("==================", item.expanded)
    console.log("==================", dirTrees.value)
};
</script>

<style scoped>
ul {
    list-style: none;
    /* 去掉列表项前面的标识 */
    padding-left: 10px;
    /* 设置左侧内边距实现缩进效果 */
}

/* .folder-icon {
    cursor: pointer;
    margin-right: 4px;
} */

/* .sub-folder-list {
    padding-left: 20px;
} */
</style>