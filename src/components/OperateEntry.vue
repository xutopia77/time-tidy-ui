<template>
    <div class="operate-entry">
        <div class="header-container">
            <button @click="btnclk_move_file">返回</button>
        </div>
        <div class="main-container">
            <MoveFile />
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore';
import MoveFile from '@/components/OperateEntry/MoveFile.vue'
const appStore = useAppStore()
function btnclk_move_file() {
    appStore.bShowSetting = !appStore.bShowSetting
}

</script>

<style scoped>
.operate-entry {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
}

.header-container {
    padding: 0;
    margin: 0;
    height: 25px;
    width: 100%;
    border-bottom: 1px solid #ddd;
}

.main-container {
    padding: 0;
    margin: 0;
    height: calc(100% - 25px);
    width: 100%;
}
</style>