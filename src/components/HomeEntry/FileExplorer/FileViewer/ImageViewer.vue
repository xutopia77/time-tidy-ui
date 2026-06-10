<template>
    <div class="fixed top-0 left-0 w-full h-full">
        <div v-if="currentImage != null" class="fixed top-0 left-0 w-full h-full z-[9999]">
            <div class="absolute top-0 left-0 w-full h-full bg-black/90" @click="close"></div>
            <div class="relative flex justify-center items-center h-full">
                <button class="nav-btn prev" @click="prevImage" :disabled="currentIndex === 0">
                    ‹
                </button>
                
                <img 
                    :src="currentImageUrl" 
                    alt="preview" 
                    class="preview-image" 
                    :style="imageStyle"
                    @mousedown="startDrag" 
                    @mousemove="drag" 
                    @mouseup="endDrag" 
                    @mouseleave="endDrag"
                    @wheel="handleWheel"
                    @dblclick="handleDoubleClick"
                />
                
                <button class="nav-btn next" @click="nextImage" :disabled="currentIndex === imageList.length - 1">
                    ›
                </button>
                
                <button class="close-btn" @click="close">×</button>
                
                <div class="absolute top-5 left-5 bg-black/70 text-white py-3 px-4 rounded-lg text-sm flex flex-col gap-1">
                    <span class="font-semibold text-base">{{ currentIndex + 1 }} / {{ imageList.length }}</span>
                    <span class="opacity-80 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">{{ currentImage?.name }}</span>
                </div>
                
                <div class="control-toolbar">
                    <div class="flex gap-2 items-center">
                        <button @click="zoomOut" class="toolbar-btn" title="缩小 (-)">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                            </svg>
                        </button>
                        <span class="text-white text-sm font-medium min-w-[50px] text-center">{{ Math.round(scale * 100) }}%</span>
                        <button @click="zoomIn" class="toolbar-btn" title="放大 (+)">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="w-px h-6 bg-white/20"></div>
                    
                    <div class="flex gap-2 items-center">
                        <button @click="fitToScreen" class="toolbar-btn" title="适应屏幕 (F)">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/>
                            </svg>
                        </button>
                        <button @click="resetImageState" class="toolbar-btn" title="原始大小 (0)">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="w-px h-6 bg-white/20"></div>
                    
                    <div class="flex gap-2 items-center">
                        <button @click="rotateLeft" class="toolbar-btn" title="左旋转 (Shift+R)">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>
                            </svg>
                        </button>
                        <button @click="rotateRight" class="toolbar-btn" title="右旋转 (R)">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="absolute bottom-[100px] left-1/2 -translate-x-1/2 flex gap-4 text-white/50 text-xs">
                    <span class="bg-black/50 py-1 px-2 rounded">← → 切换</span>
                    <span class="bg-black/50 py-1 px-2 rounded">+/- 缩放</span>
                    <span class="bg-black/50 py-1 px-2 rounded">ESC 关闭</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import * as DatType from '@/utils/dataTypedef';

const appStore = useAppStore()

const isVisible = ref(false)

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

const currentIndex = computed(() => {
    const index = imageList.value.findIndex(file => file.id === appStore.curSltFile?.id)
    return index !== -1 ? index : 0
})

const currentImage = computed(() => imageList.value[currentIndex.value])

const currentImageUrl = computed(() => {
    const img = imageList.value[currentIndex.value]
    if (!img) {
        return '';
    }
    
    if (appStore.platform === DatType.PlatformType.electron) {
        return `file:///${img.fullpath}`;
    } else {
        const filePath = img.path + "/" + img.name;
        return `${appStore.srvPrefix}/static_file/${filePath}?fileId=${img.id}`;
    }
})

const scale = ref(1)
const rotation = ref(0)
const positionX = ref(0)
const positionY = ref(0)

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const initialPositionX = ref(0)
const initialPositionY = ref(0)

const imageStyle = computed(() => {
    return {
        transform: `translate(${positionX.value}px, ${positionY.value}px) scale(${scale.value}) rotate(${rotation.value}deg)`,
        transformOrigin: 'center',
        transition: isDragging.value ? 'none' : 'transform 0.3s ease-out'
    }
})

const resetImageState = () => {
    scale.value = 1
    rotation.value = 0
    positionX.value = 0
    positionY.value = 0
}

const close = () => {
    isVisible.value = false
    appStore.bPageImgView = false
    resetImageState()
}

const prevImage = () => {
    if (currentIndex.value > 0) {
        appStore.curSltFile = imageList.value[currentIndex.value - 1]
        resetImageState()
    }
}

const nextImage = () => {
    if (currentIndex.value < imageList.value.length - 1) {
        appStore.curSltFile = imageList.value[currentIndex.value + 1]
        resetImageState()
    }
}

const zoomIn = () => {
    const newScale = scale.value * 1.2
    scale.value = Math.min(newScale, 10)
}

const zoomOut = () => {
    const newScale = scale.value / 1.2
    scale.value = Math.max(newScale, 0.1)
}

const rotateLeft = () => {
    rotation.value = (rotation.value - 90 + 360) % 360
}

const rotateRight = () => {
    rotation.value = (rotation.value + 90) % 360
}

const fitToScreen = () => {
    const img = new Image()
    img.src = currentImageUrl.value
    img.onload = () => {
        const screenWidth = window.innerWidth * 0.9
        const screenHeight = window.innerHeight * 0.9
        const scaleX = screenWidth / img.width
        const scaleY = screenHeight / img.height
        scale.value = Math.min(scaleX, scaleY, 1)
        positionX.value = 0
        positionY.value = 0
    }
}

const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(scale.value * delta, 0.1), 10)
    
    const imgElement = event.target as HTMLImageElement
    const rect = imgElement.getBoundingClientRect()
    const mouseX = event.clientX - rect.left - rect.width / 2
    const mouseY = event.clientY - rect.top - rect.height / 2
    
    const scaleRatio = newScale / scale.value
    positionX.value = mouseX - (mouseX - positionX.value) * scaleRatio
    positionY.value = mouseY - (mouseY - positionY.value) * scaleRatio
    
    scale.value = newScale
}

const handleDoubleClick = () => {
    if (scale.value === 1) {
        scale.value = 2
    } else {
        scale.value = 1
        positionX.value = 0
        positionY.value = 0
    }
}

const startDrag = (event: MouseEvent) => {
    isDragging.value = true
    startX.value = event.clientX
    startY.value = event.clientY
    initialPositionX.value = positionX.value
    initialPositionY.value = positionY.value
}

const drag = (event: MouseEvent) => {
    if (isDragging.value) {
        const deltaX = event.clientX - startX.value
        const deltaY = event.clientY - startY.value
        positionX.value = initialPositionX.value + deltaX
        positionY.value = initialPositionY.value + deltaY
    }
}

const endDrag = () => {
    isDragging.value = false
}

const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
        case 'ArrowLeft':
            prevImage()
            break
        case 'ArrowRight':
            nextImage()
            break
        case 'Escape':
            close()
            break
        case '+':
        case '=':
            zoomIn()
            break
        case '-':
            zoomOut()
            break
        case '0':
            resetImageState()
            break
        case 'f':
        case 'F':
            fitToScreen()
            break
        case 'r':
            rotateRight()
            break
        case 'R':
            rotateLeft()
            break
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.preview-image {
    max-width: 90%;
    max-height: 90%;
    user-select: none;
    cursor: grab;
    transition: transform 0.3s ease-out;
}

.preview-image:active {
    cursor: grabbing;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 32px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-btn:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
}

.prev {
    left: 30px;
}

.next {
    right: 30px;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 32px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
}

.nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.control-toolbar {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    padding: 12px 20px;
    border-radius: 12px;
    display: flex;
    gap: 16px;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-btn {
    background-color: transparent;
    color: white;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.toolbar-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.toolbar-btn:active {
    background-color: rgba(255, 255, 255, 0.2);
}
</style>
