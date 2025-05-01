<template>
    <div class="file-card common-card" :style="{ backgroundColor: isChecked ? '#e0f7fa' : 'transparent' }">
        <!-- 左上角的 checkbox -->
        <div class="checkbox-container">
            <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" />
        </div>
        <div class="file-content" @click="handleClick">
            <div class="file-icon">
                <img :src="item.icon" alt="icon" />
            </div>
            <div class="file-name">{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import '@/assets/common.css'

const props = defineProps<{
    item: DatType.FileItem;
    // 新增：接收是否选中的初始状态
    checked?: boolean;
}>();

// 记录 checkbox 的状态
const isChecked = ref(props.checked || false);

// 处理 checkbox 状态变化
const handleCheckboxChange = () => {
};

// 处理卡片点击事件
const handleClick = () => {
    console.log('click', props.item);
};
</script>

<style scoped>
.file-card {
    text-align: center;
    position: relative;
    /* 为 checkbox 定位做准备 */
    transition: background-color 0.3s;
    /* 添加过渡效果 */
}

.file-card:hover {
    background-color: #f0f0f0;
}

.checkbox-container {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    /* 确保 checkbox 在图片上方 */
}

.file-content {
    cursor: pointer;
}

.file-icon img {
    width: 160px;
    height: 160px;
    margin-bottom: 10px;
}

.file-name {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>