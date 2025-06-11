<template>
    <div class="image-viewer-container">
        <div v-if="currentImage != null" class="image-viewer">
            <div class="overlay" @click="close"></div>
            <div class="viewer-container">
                <video ref="videoRef" :src="currentImageUrl" autoplay controls class="video-player"></video>
                <button class="close-btn" @click="close">×</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef';
const appStore = useAppStore()

// 控制 ImageViewer 是否显示
const isVisible = ref(false)
// 获取 video 元素引用
const videoRef = ref<HTMLVideoElement | null>(null)

const imageList = computed(() => appStore.curFiles.filter(file => {
    let bfile = false;
    switch (file.type) {
        case DatType.FileType.image:
        case DatType.FileType.video:
            bfile = true;
            break;
        default:
            bfile = false;
            break;
    }
    return bfile;
}))

const close = () => {
    isVisible.value = false
    Utils.page_show({ page: 'imageView', bShow: false })
    // 停止视频播放并重置进度
    if (videoRef.value) {
        videoRef.value.pause()
        videoRef.value.currentTime = 0
    }
}

// 获取当前选中图片的索引
const currentIndex = computed(() => {
    const index = imageList.value.findIndex(file => file.id === appStore.curSltFile?.id)
    return index !== -1 ? index : 0
})

// 获取当前图片
const currentImage = computed(() => imageList.value[currentIndex.value])

const currentImageUrl = computed(() => {
    if (appStore.pageCtrl.imageView.bShow == false) {
        return '';
    }
    const img = imageList.value[currentIndex.value]
    if (!img || !img.fullpath) {
        return '';
    }
    console.log('currentImageUrl', img.fullpath)
    return img.fullpath
})
</script>

<style scoped>
.video-player {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* 保持视频比例，完整显示在容器内 */
}


.image-viewer-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.image-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
}

.viewer-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.preview-image {
    max-width: 90%;
    max-height: 90%;
    user-select: none;
    /* 防止拖拽时选中文本 */
    cursor: grab;
}

.preview-image:active {
    cursor: grabbing;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    font-size: 24px;
    padding: 10px 15px;
    cursor: pointer;
}

.prev {
    left: 20px;
}

.next {
    right: 20px;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    font-size: 24px;
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.control-buttons {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
}

.control-buttons button {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
}
</style>