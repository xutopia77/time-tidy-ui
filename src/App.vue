<template>
  <HomeEntry />
</template>
<script setup lang="ts">
import HomeEntry from '@/components/HomeEntry.vue';
import { onBeforeMount } from 'vue';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

onBeforeMount(() => {
  const folderIcon = 'src/assets/icons/folders.svg';
  const fileIcon = 'src/assets/icons/file-image.svg';
  appStore.curFiles = [
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
  ]
})

</script>

<style scoped></style>
