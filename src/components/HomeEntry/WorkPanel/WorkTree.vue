<template>
    <div class="folder-tree">
        <DirTreeItem :data="dirTrees" v-model="selectedItem" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import '@/assets/common.css'
// import { FolderCloseIcon, FolderOpenIcon } from '@/components/Icon'
import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

import DirTreeItem from '@/components/HomeEntry/WorkPanel/DirTreeItem.vue'

// // 模拟数据
// const folderSource: DatType.FolderItemInfo[] = [
//     {
//         name: '灵感采集',
//         count: 113,
//         children: [
//             { name: 'AI 咒语', count: 65 },
//             {
//                 name: '插画', count: 275,
//                 children: [
//                     { name: '插画1', count: 275 },
//                     {
//                         name: '插画2', count: 275,
//                         children: [
//                             { name: '插画石头1', count: 1 },
//                             { name: '插画石头2', count: 2 },
//                         ]
//                     },
//                     { name: '插画3', count: 275 },
//                 ]
//             },
//             { name: '摄影', count: 801 },
//             { name: '室内设计', count: 183 },
//             { name: '游戏概念', count: 234 },
//             { name: 'UI 设计', count: 159 },
//             { name: '动画', count: 117 },
//         ],
//     },
//     {
//         name: '设计素材',
//         count: 0,
//         children: [
//             { name: '包装模板', count: 108 },
//             { name: '图标', count: 91 },
//             { name: '字体', count: 85 },
//             { name: '音频', count: 52 },
//         ],
//     },
//     {
//         name: '教程',
//         count: 202,
//         children: [
//             { name: 'Figma', count: 148 },
//         ],
//     },
// ];

// // 递归为文件夹项添加展开状态
// const addExpandedProperty = (items: DatType.FolderItemInfo[]): DatType.DirTreeItem[] => {
//     return items.map((item) => {
//         const newItem: DatType.DirTreeItem = {
//             ...item,
//             children: item.children ? addExpandedProperty(item.children) : [],
//             expanded: true,
//         };
//         if (newItem.children && newItem.children.length > 0) {
//             newItem.children = addExpandedProperty(newItem.children);
//         }
//         return newItem;
//     });
// };

// const selectedItem = computed({
//     get() {
//         return appStore.curSltDirTreeItem;
//     },
//     set(value: DatType.DirTreeItem) {
//         Utils.dir_slt_update(value)
//     }
// });

const selectedItem = ref<DatType.DirTreeItem | null>(null);
watch(selectedItem, (newValue: DatType.DirTreeItem | null) => {
    if (null == newValue) {
        return;
    }
    console.log('选中项已更新:', newValue);
    Utils.dir_slt_update(newValue)
});


// 处理文件夹数据，添加展开状态
const dirTrees = computed(() => {
    // const bT = false
    // if (bT) {
    //     return addExpandedProperty(folderSource);
    // } else 
    {
        return appStore.DirTrees;
    }
});



</script>

<style scoped>
.folder-tree {
    padding-left: 0px;
}

.folder-list {
    list-style: none;
    margin: 0;
    padding: 0;
}
</style>