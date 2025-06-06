<template>
    <div class="operate-entry">
        <div class="header-container">
            <button @click="btnclk_move_file" class="xc-button">返回</button>
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
import '@/assets/common.css'
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
    /* box-sizing: border-box; */
}

.header-container {
    padding: 0;
    margin: 0;
    height: 40px;
    width: calc(100% - 16px);
    border-bottom: var(--xc-border);
    /* box-sizing: border-box; */
    display: flex;
    justify-content: flex-end;
    /* 元素靠右排列 */
    align-items: center;
    /* 元素垂直居中 */
    margin-right: 16px;
}

.main-container {
    padding: 0px;
    margin: 0px;
    height: calc(100% - 45px);
    width: 100%;
}
</style>