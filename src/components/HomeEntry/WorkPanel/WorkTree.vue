<template>
    <div class="pl-0">
        <DirTreeItem :data="dirTrees" v-model="selectedItem" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
import { logger } from '@/common/logger';
const appStore = useAppStore()

import DirTreeItem from '@/components/HomeEntry/WorkPanel/DirTreeItem.vue'

const selectedItem = ref<DatType.DirTreeItem | null>(null);
watch(selectedItem, (newValue: DatType.DirTreeItem | null) => {
    if (null == newValue) {
        return;
    }
    logger.debug('选中项已更新:', newValue);
    Utils.dir_slt_update(newValue)
});

const dirTrees = computed(() => {
    return appStore.DirTrees;
});
</script>
