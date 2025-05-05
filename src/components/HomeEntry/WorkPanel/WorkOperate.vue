<template>
    <div>
        <button @click="btnclk_move_file">移动文件</button>
        <button @click="btnclk_delete_file">删除</button>
    </div>
</template>
<script setup lang="ts">
import Utils from '@/utils/utils';
// import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
function btnclk_move_file() {
    appStore.bShowSetting = !appStore.bShowSetting
}

function btnclk_delete_file() {
    Utils.message_notify({
        content: '删除文件',
        duration: 2000
    })
}

</script>
<style scoped></style>