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
    const images = imageList.value.map(img => ({
        src: buildImageUrl(img),
        alt: img.name,
    }))

    const viewer = viewerApi({
        images,
        options: {
            initialViewIndex: currentIndex.value,
            hidden: () => {
                close()
            },
        },
    })
})
</script>
