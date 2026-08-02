<template>
    <ul class="w-full list-none pl-2.5">
        <li v-for="(item, index) in dirTrees" :key="index" class="border-none rounded w-full text-text-primary">
            <div 
                class="border-none rounded w-full text-text-primary flex hover:border-border-dark"
                :class="{ 'bg-bg-tertiary': curSltDirTreeItem?.dirInfo.id == item.dirInfo.id }"
            >
                <div v-if="!bShowDirIcon(item, 1) && !bShowDirIcon(item, 2)" class="w-[18px] align-middle"></div>
                <Right size="18" v-if="bShowDirIcon(item, 1)" @click="btn_toggleExpand(item)" />
                <Down size="18" v-if="bShowDirIcon(item, 2)" @click="btn_toggleExpand(item)" />
                <div @click="btn_sltTreeItem(item)" class="whitespace-nowrap text-xs flex items-center gap-1">
                    <FolderClose :size="16" />
                    {{ item.name }}
                </div>
            </div>
            <ul v-if="item.children && item.children.length > 0 && item.expanded" class="w-full list-none pl-2.5">
                <DirTreeItem :data="item.children" v-model="curSltDirTreeItem" />
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, computed, ref } from 'vue'
import { FolderClose, Right, Down } from '@icon-park/vue-next'
import * as DatType from '@/utils/dataTypedef'

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

const btn_toggleExpand = (item: DatType.DirTreeItem) => {
    item.expanded = !item.expanded;
};
</script>

<style scoped>
svg {
    vertical-align: middle;
}
</style>
