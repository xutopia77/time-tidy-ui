<template>
    <div class="file-explorer">
        <FileNavHeader />
        <div class="file-grid">
            <!-- 循环渲染文件和文件夹 -->
            <template v-for="item in items" :key="item.path">
                <ImageCard v-if="item.type === 'file'" :item="item" @click="handleItemClick" />
                <FolderCard v-else-if="item.type === 'folder'" :item="item" @click="handleItemClick" />
            </template>
        </div>
        <FileFooter />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileNavHeader from '@/components/FileExplorer/FileNavHeader.vue';
import ImageCard from '@/components/FileExplorer/ImageCard.vue';
import FolderCard from '@/components/FileExplorer/FolderCard.vue';
import FileFooter from '@/components/FileExplorer/FileFooter.vue';
import * as DatType from '@/utils/dataTypedef';

const folderIcon = 'src/assets/icons/folders.svg';
const fileIcon = 'src/assets/icons/file-image.svg';
// 模拟文件和文件夹数据
const items = ref<DatType.FileItem[]>([
    { name: 'Documents', type: 'folder', path: '/Documents', icon: folderIcon },
    { name: 'Downloads', type: 'folder', path: '/Downloads', icon: folderIcon },
    { name: 'Pictures', type: 'folder', path: '/Pictures', icon: folderIcon },
    { name: 'report.pdf', type: 'file', path: '/Documents/report.pdf', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
    { name: 'photo.jpg', type: 'file', path: '/Pictures/photo.jpg', icon: fileIcon },
]);

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
    padding: 0px;
    margin: 0px;
}

.file-grid {
    display: flex;
    flex-wrap: wrap;
}

/* 假设 ImageCard 和 FolderCard 有共同的类名 .file-card，这里设置其基础样式 */
.file-card {
    flex: 1 0 calc(20% - 6px);
    /* 每行最多 5 个项目，减去间距 */
    min-width: 120px;
    /* 最小宽度 */
    box-sizing: border-box;
    /* 包含内边距和边框 */
}
</style>