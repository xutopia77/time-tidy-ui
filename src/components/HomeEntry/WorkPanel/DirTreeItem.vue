<template>
    <n-tree block-line :data="treeData" :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys" :render-prefix="renderPrefix"
        @update:selected-keys="onSelectKeys" @update:expanded-keys="onExpandedKeys" />
</template>

<script setup lang="ts">
// Dir tree rendered by NTree. External API is unchanged (data + v-model of
// DirTreeItem), so WorkTree / FileTransfer / FolderListSection need no edits.
import { h, computed, ref, watch } from 'vue'
import { NTree } from 'naive-ui'
import type { TreeOption } from 'naive-ui'
import { FolderClose } from '@icon-park/vue-next'
import * as DatType from '@/utils/dataTypedef'

const props = defineProps<{
    data: DatType.DirTreeItem[];
    modelValue?: DatType.DirTreeItem | null;
}>();

const emit = defineEmits(['update:modelValue']);

function toTreeOption(item: DatType.DirTreeItem): TreeOption {
    const option: TreeOption = {
        key: item.dirInfo.id,
        label: item.name,
    };
    if (item.children && item.children.length > 0) {
        option.children = item.children.map(toTreeOption);
    }
    return option;
}

const treeData = computed<TreeOption[]>(() => props.data.map(toTreeOption));

function collectKeys(items: DatType.DirTreeItem[], keys: Array<string | number>): Array<string | number> {
    for (const item of items) {
        keys.push(item.dirInfo.id);
        if (item.children && item.children.length > 0) {
            collectKeys(item.children, keys);
        }
    }
    return keys;
}

// nodes start expanded (DirTreeItem.expanded defaults to true)
const expandedKeys = ref<Array<string | number>>(collectKeys(props.data, []));
watch(() => props.data, (newData) => {
    expandedKeys.value = collectKeys(newData, []);
});

function findNodeRecursively(nodes: DatType.DirTreeItem[], id: string | number): DatType.DirTreeItem | undefined {
    for (const node of nodes) {
        if (node.dirInfo.id === id) return node;
        if (node.children && node.children.length > 0) {
            const found = findNodeRecursively(node.children, id);
            if (found) return found;
        }
    }
    return undefined;
}

const selectedKeys = computed<Array<string | number>>(() => {
    return props.modelValue ? [props.modelValue.dirInfo.id] : [];
});

const onSelectKeys = (keys: Array<string | number>) => {
    // empty selection or re-click on the selected node toggles it off
    // (deselect means "show all files")
    if (keys.length === 0) {
        emit('update:modelValue', null);
        return;
    }
    if (props.modelValue && props.modelValue.dirInfo.id === keys[0]) {
        emit('update:modelValue', null);
        return;
    }
    const node = findNodeRecursively(props.data, keys[0]);
    if (node) {
        emit('update:modelValue', node);
    }
};

const onExpandedKeys = (keys: Array<string | number>) => {
    expandedKeys.value = keys;
};

const renderPrefix = () => {
    return h(FolderClose as Parameters<typeof h>[0], { size: 16, style: 'vertical-align: middle' });
};
</script>
