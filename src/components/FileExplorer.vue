<template>
    <div class="file-explorer">
        <!-- 路径显示区域 -->
        <FileNavHeader />
        <div class="file-grid">
            <!-- 循环渲染文件和文件夹 -->
            <template v-for="item in items" :key="item.path">
                <ImageCard v-if="item.type === 'file'" :item="item" :folderIcon="folderIcon" :fileIcon="fileIcon"
                    @click="handleItemClick" />
                <FolderCard v-else-if="item.type === 'folder'" :item="item" :folderIcon="folderIcon"
                    @click="handleItemClick" />
                <!-- 后续添加新类型，可继续使用 v-else-if -->
                <!-- <NewTypeCard
                    v-else-if="item.type === 'newType'"
                    :item="item"
                    :folderIcon="folderIcon"
                    :fileIcon="fileIcon"
                    @click="handleItemClick"
                /> -->
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileNavHeader from '@/components/FileExplorer/FileNavHeader.vue';
import ImageCard from '@/components/FileExplorer/ImageCard.vue';
import FolderCard from '@/components/FileExplorer/FolderCard.vue';
// 如果添加新类型卡片，需要引入对应的组件
// import NewTypeCard from './NewTypeCard.vue';

// 模拟文件和文件夹数据
const items = ref([
    { name: 'Documents', type: 'folder', path: '/Documents' },
    { name: 'Pictures', type: 'folder', path: '/Pictures' },
    { name: 'report.pdf', type: 'file', path: '/Documents/report.pdf' },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg' },
]);

// 文件夹和文件图标路径，可根据实际情况修改
const folderIcon = 'src/assets/icons/folders.svg';
const fileIcon = 'src/assets/icons/folders.svg';

// 处理点击事件
const handleItemClick = (item: { type: string; path: string }) => {
    if (item.type === 'folder') {
        console.log(`Entering folder: ${item.path}`);
    } else {
        // 处理文件点击逻辑，比如打开文件
        console.log(`Opening file: ${item.path}`);
    }
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
</style>