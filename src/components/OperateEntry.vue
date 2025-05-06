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
import MoveFile from '@/components/OperateEntry/MoveFile.vue'
import Utils from '@/utils/utils'
// import { useAppStore } from '@/stores/AppStore';
// const appStore = useAppStore()
function btnclk_move_file() {
    Utils.page_show({ page: 'set', bShow: false })
}
</script>

<style scoped>
.operate-entry {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}

.header-container {
    padding: 0;
    margin: 0;
    height: 25px;
    width: 100%;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
}

.main-container {
    padding: 0px;
    margin: 0px;
    height: calc(100% - 30px);
    width: 100%;
}
</style>