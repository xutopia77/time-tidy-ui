<template>
    <div class="file-explorer">
        <!-- 路径显示区域 -->
        <div class="path-display">
            <span v-for="(part, index) in pathParts" :key="index" @click="navigateToPath(part.path)" class="path-part">
                {{ part.name }}
                <span v-if="index < pathParts.length - 1">/</span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 当前路径
const currentPath = ref('06_666666666666\\新建文件夹');

// 解析路径为可点击的部分
const pathParts = computed(() => {
    const parts = currentPath.value.split('\\');
    return parts.map((part, index) => {
        const path = parts.slice(0, index + 1).join('\\');
        return { name: part, path };
    });
});

// 导航到指定路径
const navigateToPath = (path: string) => {
    currentPath.value = path;
    // 这里可以添加重新加载对应路径下文件列表的逻辑
};
</script>

<style scoped>
.file-explorer {
    padding: 20px;
}

/* 路径显示样式 */
.path-display {
    margin-bottom: 20px;
    font-size: 16px;
}

.path-part {
    cursor: pointer;
    color: #007bff;
    text-decoration: underline;
}

.path-part:hover {
    color: #0056b3;
}

.file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
}

.file-card {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s;
}

.file-card:hover {
    background-color: #f0f0f0;
}

.file-icon img {
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
}

.file-name {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>