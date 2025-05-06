<template>
    <div v-if="currentImage != null" class="image-viewer">
        <div class="overlay" @click="close"></div>
        <div class="viewer-container">
            <button class="nav-btn prev" @click="prevImage" :disabled="currentIndex === 0">
                &lt;
            </button>
            <img :src="currentImage.icon" alt="preview" class="preview-image" />
            <button class="nav-btn next" @click="nextImage" :disabled="currentIndex === imageList.length - 1">
                &gt;
            </button>
            <button class="close-btn" @click="close">×</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import Utils from '@/utils/utils'

const appStore = useAppStore()

// 控制 ImageViewer 是否显示
const isVisible = ref(false)

// 获取当前图片列表
const imageList = computed(() => appStore.curFiles.filter(file => file.type === 'file'))

// 获取当前选中图片的索引
const currentIndex = computed(() => {
    const index = imageList.value.findIndex(file => file.id === appStore.curSltFile?.id)
    return index !== -1 ? index : 0
})

// 获取当前图片
const currentImage = computed(() => imageList.value[currentIndex.value])

// 打开图片预览
const open = () => {
    isVisible.value = true
}

// 关闭图片预览
const close = () => {
    isVisible.value = false
    Utils.page_show({ page: 'imageView', bShow: false })
}

// 切换到上一张图片
const prevImage = () => {
    if (currentIndex.value > 0) {
        appStore.curSltFile = imageList.value[currentIndex.value - 1]
    }
}

// 切换到下一张图片
const nextImage = () => {
    if (currentIndex.value < imageList.value.length - 1) {
        appStore.curSltFile = imageList.value[currentIndex.value + 1]
    }
}

// 暴露 open 方法给父组件调用
defineExpose({ open })
</script>

<style scoped>
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
</style>