<template>
    <div class="image-viewer-container">
        <div v-if="currentImage != null" class="image-viewer">
            <div class="overlay" @click="close"></div>
            <div class="viewer-container">
                <video 
                    ref="videoRef" 
                    :src="currentImageUrl" 
                    autoplay 
                    controls 
                    class="video-player"
                    @error="handleVideoError"
                    @loadedmetadata="handleLoadedMetadata"
                    @loadeddata="handleLoadedData"
                    @canplay="handleCanPlay"
                ></video>
                <button class="close-btn" @click="close">×</button>
            </div>
        </div>
        
        <!-- Unsupported codec dialog -->
        <div v-if="showUnsupportedDialog" class="unsupported-dialog">
            <div class="unsupported-content">
                <h3>⚠️ Video Playback Issue</h3>
                <p>{{ unsupportedMessage }}</p>
                <div class="unsupported-tips">
                    <p><strong>Suggestions:</strong></p>
                    <ul>
                        <li>Use Safari or Edge browser for H.265 video playback</li>
                        <li>Or use the desktop application (Electron) which supports H.265</li>
                        <li>Download the video and play with a local player (e.g., VLC)</li>
                    </ul>
                </div>
                <div class="unsupported-info">
                    <p><strong>Current Environment:</strong></p>
                    <p>Platform: {{ appStore.platform }}</p>
                    <p>Browser H.265 Support: {{ browserHEVCSupport ? 'Yes' : 'No' }}</p>
                </div>
                <button class="dialog-close-btn" @click="closeUnsupportedDialog">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import { logger } from '@/common/logger';
import * as DatType from '@/utils/dataTypedef';

declare global {
    interface HTMLVideoElement {
        videoTracks?: unknown[];
    }
}

const appStore = useAppStore()

// Control ImageViewer visibility
const isVisible = ref(false)
// Get video element reference
const videoRef = ref<HTMLVideoElement | null>(null)
// Unsupported codec dialog
const showUnsupportedDialog = ref(false)
const unsupportedMessage = ref('')
// Browser H.265 support status
const browserHEVCSupport = ref(false)

// Get image/video list
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

// Get current selected image index
const currentIndex = computed(() => {
    const index = imageList.value.findIndex(file => file.id === appStore.curSltFile?.id)
    return index !== -1 ? index : 0
})

// Get current image/video
const currentImage = computed(() => imageList.value[currentIndex.value])

// Check if browser supports H.265/HEVC
const checkHEVCSupport = (): boolean => {
    const video = document.createElement('video')
    
    // Check for HEVC support
    const hevcSupport = video.canPlayType('video/mp4; codecs="hev1"') ||
                        video.canPlayType('video/mp4; codecs="hevc"')
    
    return hevcSupport !== ''
}

// Check browser H.265 support on mount
browserHEVCSupport.value = checkHEVCSupport()

// Check if video might be H.265 encoded
const isPossibleHEVC = (filename: string): boolean => {
    // Common H.265 file extensions and patterns
    const hevcPatterns = [
        /\.hevc$/i,
        /\.h265$/i,
        /_h265\./i,
        /_hevc\./i,
        /h265/i,
        /hevc/i
    ]
    
    return hevcPatterns.some(pattern => pattern.test(filename))
}

// Handle video playback error
const handleVideoError = (event: Event) => {
    const video = event.target as HTMLVideoElement
    const error = video.error
    
    if (!error) return
    
    const currentVideo = currentImage.value
    if (!currentVideo) return
    
    // Check if it's a codec issue
    if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        // Check if it might be H.265
        const mightBeHEVC = isPossibleHEVC(currentVideo.name)
        
        if (mightBeHEVC && appStore.platform === DatType.PlatformType.browser) {
            // Check browser support
            const hevcSupported = checkHEVCSupport()
            
            if (!hevcSupported) {
                unsupportedMessage.value = 
                    `This video appears to be encoded in H.265 (HEVC) format, ` +
                    `which is not supported by your current browser. ` +
                    `The video file is "${currentVideo.name}".`
                showUnsupportedDialog.value = true
            }
        } else {
            // Generic error message
            unsupportedMessage.value = 
                `Failed to play video "${currentVideo.name}". ` +
                `The video format may not be supported.`
            showUnsupportedDialog.value = true
        }
    }
}

// Handle loaded metadata - check if video has video tracks
const handleLoadedMetadata = (event: Event) => {
    const video = event.target as HTMLVideoElement
    const currentVideo = currentImage.value
    
    if (!currentVideo || appStore.platform === DatType.PlatformType.electron) {
        return
    }
    
    // Check if video has video tracks
    if (video.videoTracks && video.videoTracks.length === 0) {
        // No video tracks, might be audio only or failed to decode video
        const mightBeHEVC = isPossibleHEVC(currentVideo.name)
        const hevcSupported = checkHEVCSupport()
        
        if (mightBeHEVC && !hevcSupported) {
            unsupportedMessage.value = 
                `This video appears to be encoded in H.265 (HEVC) format, ` +
                `which is not supported by your current browser. ` +
                `The video file is "${currentVideo.name}".`
            showUnsupportedDialog.value = true
        }
    }
}

// Handle loaded data - check video dimensions
const handleLoadedData = (event: Event) => {
    const video = event.target as HTMLVideoElement
    const currentVideo = currentImage.value
    
    if (!currentVideo || appStore.platform === DatType.PlatformType.electron) {
        return
    }
    
    // Check if video has valid dimensions (if both are 0, video track failed to decode)
    if (video.videoWidth === 0 && video.videoHeight === 0) {
        const mightBeHEVC = isPossibleHEVC(currentVideo.name)
        const hevcSupported = checkHEVCSupport()
        
        if (mightBeHEVC && !hevcSupported) {
            unsupportedMessage.value = 
                `This video appears to be encoded in H.265 (HEVC) format, ` +
                `which is not supported by your current browser. ` +
                `Only audio can be played. The video file is "${currentVideo.name}".`
            showUnsupportedDialog.value = true
        }
    }
}

// Handle can play - final check for video playback capability
const handleCanPlay = (event: Event) => {
    const video = event.target as HTMLVideoElement
    const currentVideo = currentImage.value
    
    if (!currentVideo || appStore.platform === DatType.PlatformType.electron) {
        return
    }
    
    // Delay check to ensure video has started decoding
    setTimeout(() => {
        // If video has no dimensions after canplay, likely a codec issue
        if (video.videoWidth === 0 && video.videoHeight === 0 && video.readyState >= 2) {
            const mightBeHEVC = isPossibleHEVC(currentVideo.name)
            const hevcSupported = checkHEVCSupport()
            
            if (mightBeHEVC && !hevcSupported) {
                unsupportedMessage.value = 
                    `This video appears to be encoded in H.265 (HEVC) format, ` +
                    `which is not supported by your current browser. ` +
                    `Only audio can be played. The video file is "${currentVideo.name}".`
                showUnsupportedDialog.value = true
            }
        }
    }, 1000) // Wait 1 second for video to start decoding
}

// Close unsupported dialog
const closeUnsupportedDialog = () => {
    showUnsupportedDialog.value = false
    close()
}

// Watch for video changes and check compatibility
watch(currentImage, (newVideo) => {
    if (newVideo && newVideo.type === DatType.FileType.video) {
        // In browser environment, check for potential H.265 issues
        if (appStore.platform === DatType.PlatformType.browser) {
            const mightBeHEVC = isPossibleHEVC(newVideo.name)
            const hevcSupported = checkHEVCSupport()
            
            // Show warning if video might be H.265 and browser doesn't support it
            if (mightBeHEVC && !hevcSupported) {
                logger.warn('This video might be H.265 encoded and may not play in this browser')
            }
        }
    }
})

const close = () => {
    isVisible.value = false
    appStore.bPageImgView = false
    showUnsupportedDialog.value = false
    // Stop video playback and reset progress
    if (videoRef.value) {
        videoRef.value.pause()
        videoRef.value.currentTime = 0
    }
}

const currentImageUrl = computed(() => {
    if (appStore.bPageImgView == false) {
        return '';
    }
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

.unsupported-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.unsupported-content {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.unsupported-content h3 {
    margin: 0 0 15px 0;
    color: #e74c3c;
    font-size: 20px;
}

.unsupported-content p {
    margin: 10px 0;
    color: #333;
    line-height: 1.6;
}

.unsupported-tips {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #3498db;
}

.unsupported-tips ul {
    margin: 10px 0 0 0;
    padding-left: 20px;
}

.unsupported-tips li {
    margin: 8px 0;
    color: #555;
}

.unsupported-info {
    margin: 20px 0;
    padding: 15px;
    background-color: #fff3cd;
    border-radius: 8px;
    border-left: 4px solid #ffc107;
}

.unsupported-info p {
    margin: 5px 0;
    color: #856404;
    font-size: 14px;
}

.dialog-close-btn {
    width: 100%;
    padding: 12px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.dialog-close-btn:hover {
    background-color: #2980b9;
}
</style>