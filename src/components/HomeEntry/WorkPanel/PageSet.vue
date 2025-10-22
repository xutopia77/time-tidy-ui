<template>
    <div class="page-view">
        <div class="page-header">
            <p>设置界面</p>
            <button class="page-close-button" @click="btn_page_close">&times;</button>
        </div>

        <div class="page-content">
            <div style="display: flex;">
                <label for="cardWidthSlider1" style="font-size: small;">卡片大小</label>
                <input id="cardWidthSlider" type="range" v-model="cardWidth" min="100" max="800" step="10"
                    @input="handleWidthChange" />
                <button @click="btn_adjustWidth(-2)" class="xc-button op-button"
                    style="width: 32px; display: flex; align-items: center; justify-content: center;">
                    <Minus theme="outline" size="24" fill="#333" :strokeWidth="2" />
                </button>
                <button @click="btn_adjustWidth(2)" class="xc-button op-button"
                    style="width: 32px; display: flex; justify-content: center; align-items: center;">
                    <Plus theme="outline" size="24" fill="#333" :strokeWidth="2" />
                </button>
                <span>{{ cardWidth }}</span>
            </div>
            <div>
                <label for="sortBy">文件展示类型</label>
                <select id="sortBy" v-model="fileShowType" class="xc-select">
                    <option value="">默认</option>
                    <option value="time">按时间分类</option>
                </select>
            </div>
        </div>

        <div class="page-footer">
            <button class="page-save-button" @click="btn_page_save">确定</button>
            <button class="cancel-button" @click="btn_page_close">取消</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Plus, Minus } from '@icon-park/vue-next';
import { onMounted, computed } from 'vue'
import '@/assets/common.css'
// import Utils from '@/utils/utils'
// import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

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

function btn_adjustWidth(step: number) {
    const newValue: number = appStore.cardWidth + step;
    if (newValue >= 100 && newValue <= 800) {
        appStore.cardWidth = newValue;
    }
}

const fileShowType = computed({
    get: () => appStore.fileShowType,
    set: (newValue) => {
        appStore.fileShowType = newValue;
    }
});

// 保存设置到本地存储
const btn_page_save = () => {
    appStore.bPageSet = false
}

// 关闭设置界面
const btn_page_close = () => {
    appStore.bPageSet = false
}

// 组件挂载时加载设置
onMounted(() => {
})
</script>

<style scoped>
.page-view {
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    /* display: flex; */
    /* flex-direction: column; */
    overflow: hidden;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: var(--xc-border);
}

.page-header p {
    margin: 0;
    color: #333;
}

.page-close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.page-close-button:hover {
    background-color: var(--xc-background-color-hover);
}

.page-content {
    padding: 20px;
    /* display: flex; */
    height: calc(100% - 40px - 40px - 30px - 80px);
}

.page-content span,
label {
    margin-left: 2px;
}

.page-content input[type="range"] {
    margin-left: 2px;
    /* vertical-align: middle; */
    height: 25px;
}

.op-button {
    margin-right: 10px;
}

.page-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: var(--xc-border);
}

.page-save-button,
.cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.page-save-button {
    background-color: #28a745;
    color: white;
}

.page-save-button:hover {
    background-color: #218838;
}

.cancel-button {
    background-color: #6c757d;
    color: white;
}

.cancel-button:hover {
    background-color: #5a6268;
}
</style>