<template>
    <div class="file-card" @click="handleClick">
        <div class="file-icon">
            <img :src="folderIcon" alt="folder icon" />
        </div>
        <div class="file-name">{{ item.name }}</div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
    item: { name: string; type: string; path: string };
    folderIcon: string;
}>();

const emit = defineEmits(['click']);

const handleClick = () => {
    emit('click', props.item);
};
</script>

<style scoped>
.file-card {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s;
}

.file-card:hover {
    background-color: #f0f0f0;
}

.file-icon img {
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
}

.file-name {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>