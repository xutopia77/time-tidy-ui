<template>
    <ul class="folder-list">
        <li v-for="(item, index) in dirTrees" :key="index" class="dir-item-group">
            <!-- 根据是否有子项和展开状态显示对应图标，并添加点击事件切换展开状态 -->
            <div class="dir-item" :class="{ 'selected': curSltDirTreeItem?.dirInfo.id == item.dirInfo.id }">
                <div v-if="!bShowDirIcon(item, 1) && !bShowDirIcon(item, 2)" class="icon-placeholder"></div>
                <CollapsedIcon v-if="bShowDirIcon(item, 1)" width="24" height="24" @click="btn_toggleExpand(item)" />
                <ExpandedIcon v-if="bShowDirIcon(item, 2)" @click="btn_toggleExpand(item)" />

                <div @click="btn_sltTreeItem(item)" class="no-wrap">
                    <FolderClose theme="outline" size="24" fill="#333" />
                    {{ item.name }}
                </div>
            </div>
            <!-- 仅在文件夹有子项且展开时渲染子项的 ul -->
            <ul v-if="item.children && item.children.length > 0 && item.expanded" class="folder-list">
                <DirTreeItem :data="item.children" v-model="curSltDirTreeItem" />
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, computed, ref } from 'vue'
import '@/assets/common.css'
import { CollapsedIcon, ExpandedIcon } from '@/components/Icon'
import { FolderClose } from '@icon-park/vue-next'
// import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'
// import { useAppStore } from '@/stores/AppStore';
// const appStore = useAppStore()
// import Utils from '@/utils/utils';


const props = defineProps<{
    data: DatType.DirTreeItem[];
    modelValue?: DatType.DirTreeItem | null;
}>();

const emit = defineEmits(['update:modelValue']);

const dirTrees = ref<DatType.DirTreeItem[]>(props.data)
watch(props, (newVal) => {
    dirTrees.value = newVal.data;
}, { deep: true })

const curSltDirTreeItem = computed({
    get() {
        return props.modelValue;
    },
    set(value: DatType.DirTreeItem) {
        // Utils.dir_slt_update(value)
        emit('update:modelValue', value);
    }
})

function bShowDirIcon(iteam: DatType.DirTreeItem, type: number): boolean {
    if (!(iteam.children && iteam.children.length > 0)) {
        return false
    }
    if (type == 1) {
        return !iteam.expanded
    }
    if (type == 2) {
        return iteam.expanded
    }
    return false
}

function btn_sltTreeItem(iteam: DatType.DirTreeItem) {
    curSltDirTreeItem.value = iteam;
    console.log("curSltDirTreeItem: ", iteam);
}

// 切换文件夹展开状态的方法
const btn_toggleExpand = (item: DatType.DirTreeItem) => {
    item.expanded = !item.expanded;
};
</script>

<style scoped>
ul {
    width: calc(100% - 0px);
    list-style: none;
    /* 去掉列表项前面的标识 */
    padding-left: 10px;
    /* 设置左侧内边距实现缩进效果 */
}

.dir-item-group {
    border: none;
    border-radius: 4px;
    width: 100%;
    color: var(--xc-text-color);
}

.dir-item {
    border: none;
    border-radius: 4px;
    width: 100%;
    color: var(--xc-text-color);
    display: flex;
}

.dir-item:hover {
    border: var(--xc-border-hover);
}

.dir-item.selected {
    background-color: var(--xc-background-color-hover);
}

.folder-name {
    vertical-align: middle;
    /* 设置垂直居中对齐 */
}

svg {
    vertical-align: middle;
    /* 设置 SVG 图标垂直居中对齐 */
}

.icon-placeholder {
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
}

.no-wrap {
    white-space: nowrap;
}



/* .sub-folder-list {
    padding-left: 20px;
} */
</style>