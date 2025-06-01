<template>
    <div class="file-viewer">
        <ImageViewer v-if="isImageViewer" />
        <VideoViewer v-if="!isImageViewer" />
    </div>
</template>

<script setup lang="ts">
import ImageViewer from '@/components/HomeEntry/FileExplorer/FileViewer/ImageViewer.vue'
import VideoViewer from '@/components/HomeEntry/FileExplorer/FileViewer/VideoViewer.vue'
import { computed } from 'vue';
// import { onBeforeMount, ref, computed } from 'vue';
import * as DatTypes from '@/utils/dataTypedef';
// import Utils from '@/utils/utils'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
const isImageViewer = computed(() => {
    return appStore.curSltFile?.type == DatTypes.FileType.image;
});



// onBeforeMount(() => {
//     isImageViewer.value = appStore.curSltFile?.type == DatTypes.FileType.image;
//     console.log('isImageViewer', isImageViewer.value);
// })

</script>
<style scoped>
.file-viewer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    z-index: 2000;
}
</style>
