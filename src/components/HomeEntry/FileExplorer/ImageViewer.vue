<template>
    <div class="image-viewer-container">
        <div v-if="currentImage != null" class="image-viewer">
            <div class="overlay" @click="close"></div>
            <div class="viewer-container">
                <button class="nav-btn prev" @click="prevImage" :disabled="currentIndex === 0">
                    &lt;
                </button>
                <!-- 添加鼠标事件处理移动 -->
                <img :src="currentImageUrl" alt="preview" class="preview-image" :style="imageStyle"
                    @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag" @mouseleave="endDrag" />
                <button class="nav-btn next" @click="nextImage" :disabled="currentIndex === imageList.length - 1">
                    &gt;
                </button>
                <button class="close-btn" @click="close">×</button>
                <div class="control-buttons">
                    <button @click="zoomIn">放大</button>
                    <button @click="zoomOut">缩小</button>
                    <button @click="rotateLeft">左转</button>
                    <button @click="rotateRight">右转</button>
                </div>
            </div>
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

const currentImageUrl = computed(() => {
    const img = imageList.value[currentIndex.value]
    const filePath = img.path + "/" + img.name;
    return `${appStore.srvPrefix}/static_file/${filePath}?rootPathId=${img.rootPathId}&fileId=${img.id}`
})

const scale = ref(1)
const rotation = ref(0)
const positionX = ref(0)
const positionY = ref(0)

// 新增拖拽状态和起始位置
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const initialPositionX = ref(0)
const initialPositionY = ref(0)

const imageStyle = computed(() => {
    return {
        transform: `translate(${positionX.value}px, ${positionY.value}px) scale(${scale.value}) rotate(${rotation.value}deg)`,
        transformOrigin: 'center'
    }
})

// 重置图片状态
const resetImageState = () => {
    scale.value = 1
    rotation.value = 0
    positionX.value = 0
    positionY.value = 0
}

// 关闭图片预览
const close = () => {
    isVisible.value = false
    Utils.page_show({ page: 'imageView', bShow: false })
    resetImageState() // 重置图片状态
}

// 切换到上一张图片
const prevImage = () => {
    if (currentIndex.value > 0) {
        appStore.curSltFile = imageList.value[currentIndex.value - 1]
        resetImageState() // 重置图片状态
    }
}

// 切换到下一张图片
const nextImage = () => {
    if (currentIndex.value < imageList.value.length - 1) {
        appStore.curSltFile = imageList.value[currentIndex.value + 1]
        resetImageState() // 重置图片状态
    }
}

// 放大图片，添加缩放范围限制
const zoomIn = () => {
    const newScale = scale.value * 1.2
    scale.value = Math.min(newScale, 5) // 最大缩放 5 倍
}
// 缩小图片，添加缩放范围限制
const zoomOut = () => {
    const newScale = scale.value / 1.2
    scale.value = Math.max(newScale, 0.5) // 最小缩放 0.5 倍
}
// 左转图片，让旋转角度规整
const rotateLeft = () => {
    rotation.value = (rotation.value - 90 + 360) % 360
}
// 右转图片，让旋转角度规整
const rotateRight = () => {
    rotation.value = (rotation.value + 90) % 360
}

// 开始拖拽
const startDrag = (event: MouseEvent) => {
    isDragging.value = true
    startX.value = event.clientX
    startY.value = event.clientY
    initialPositionX.value = positionX.value
    initialPositionY.value = positionY.value
}

// 拖拽过程
const drag = (event: MouseEvent) => {
    if (isDragging.value) {
        const deltaX = event.clientX - startX.value
        const deltaY = event.clientY - startY.value
        positionX.value = initialPositionX.value + deltaX
        positionY.value = initialPositionY.value + deltaY
    }
}

// 结束拖拽
const endDrag = () => {
    isDragging.value = false
}

</script>

<style scoped>
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