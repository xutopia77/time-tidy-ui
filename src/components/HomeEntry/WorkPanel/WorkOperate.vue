<template>
    <div>
        <button @click="btnclk_operate_file('files_move')" class="xc-button op-button">移动</button>
        <button @click="btnclk_operate_file('files_cpy')" class="xc-button op-button">复制</button>
        <button @click="btnclk_delete_file" class="xc-button op-button">删除</button>
        <br>
        <div style="display: flex; flex-wrap: wrap;">
            <label for="cardWidthSlider1" style="font-size: small;">卡片大小</label>
            <input id="cardWidthSlider" type="range" v-model="cardWidth" min="100" max="800" step="10"
                @input="handleWidthChange" />
            <button @click="adjustWidth(-2)" class="xc-button op-button"
                style="width: 32px; display: flex; align-items: center; justify-content: center;">
                <MinusIcon />
            </button>
            <button @click="adjustWidth(2)" class="xc-button op-button"
                style="width: 32px; display: flex; justify-content: center; align-items: center;">
                <PlusIcon />
            </button>
            <span>{{ cardWidth }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css';
import { PlusIcon, MinusIcon } from '@/components/Icon'

function btnclk_operate_file(op: string) {
    appStore.setOperateType = op
    Utils.page_show({ page: 'set', bShow: true })
}

function btnclk_delete_file() {
    const req: DatType.FileDeleteReq = {
        fileIds: [],
        bRemoveToDtrash: true,
    };
    for (const item of appStore.curFiles) {
        if (item.checked) {
            req.fileIds.push(item.id)
        }
    }
    if (req.fileIds.length == 0) {
        Utils.message_notify({ content: '请选择要操作的文件' })
        return;
    }
    Utils.files_delete(req)
}

const cardWidth = computed({
    get: () => appStore.cardWidth,
    set: (value: number) => {
        value = Number(value);
        appStore.cardWidth = value;
        handleWidthChange();
    }
});

// 处理宽度变化的函数
function handleWidthChange() {
    console.log(`卡片宽度已更新为 ${cardWidth.value}px`);
}
function adjustWidth(step: number) {
    const newValue: number = appStore.cardWidth + step;
    if (newValue >= 100 && newValue <= 800) {
        appStore.cardWidth = newValue;
    }
}

</script>

<style scoped>
/* 可以添加一些样式来美化选择框 */
span,
label {
    margin-left: 2px;
}

select {
    margin-left: 2px;
}

input[type="range"] {
    margin-left: 2px;
    vertical-align: middle;
}

.op-button {
    margin-right: 10px;
}
</style>