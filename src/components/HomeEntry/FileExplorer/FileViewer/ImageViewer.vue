<template>
    <div></div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { api as viewerApi } from 'v-viewer'
import { useAppStore } from '@/stores/AppStore'
import * as DatType from '@/utils/dataTypedef';

const appStore = useAppStore()

const imageList = computed(() => appStore.curFiles.filter(file => {
    let bfile = false;
    switch (file.type) {
        case DatType.FileType.image:
        case DatType.FileType.video:
            bfile = true;
            break
        default:
            bfile = false;
            break
    }
    return bfile;
}))

const currentIndex = computed(() => {
    const index = imageList.value.findIndex(file => file.id === appStore.curSltFile?.id)
    return index !== -1 ? index : 0
})

const buildImageUrl = (img: DatType.File): string => {
    if (img.type === DatType.FileType.video) {
        // Generate SVG placeholder for video files
        const name = img.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
            <rect width="100%" height="100%" fill="#1a1a2e"/>
            <text x="400" y="280" text-anchor="middle" fill="#818cf8" font-size="64" font-family="sans-serif">&#127909;</text>
            <text x="400" y="340" text-anchor="middle" fill="#94a3b8" font-size="20" font-family="sans-serif">${name}</text>
            <text x="400" y="375" text-anchor="middle" fill="#64748b" font-size="14" font-family="sans-serif">Video</text>
        </svg>`
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    }
    if (appStore.platform === DatType.PlatformType.electron) {
        return `file:///${img.fullpath}`;
    } else {
        const filePath = img.path + "/" + img.name;
        return `${appStore.srvPrefix}/static_file/${filePath}?fileId=${img.id}`;
    }
}

const close = () => {
    appStore.bPageImgView = false
}

onMounted(() => {
    // Only pass a sliding window of images to avoid loading all images at once
    const WINDOW_SIZE = 10
    const start = Math.max(0, currentIndex.value - WINDOW_SIZE)
    const end = Math.min(imageList.value.length, currentIndex.value + WINDOW_SIZE + 1)
    const windowImages = imageList.value.slice(start, end)

    const images = windowImages.map(img => ({
        src: buildImageUrl(img),
        alt: img.name,
    }))

    viewerApi({
        images,
        options: {
            initialViewIndex: currentIndex.value - start,
            hidden: () => {
                close()
            },
        },
    })
})
</script>
