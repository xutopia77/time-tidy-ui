<template>
    <svg :width="width" :height="height" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10L38 38" fill="none" stroke="#676b6e" stroke-width="4" stroke-linecap="round" />
        <path d="M10 38L38 10" fill="none" stroke="#676b6e" stroke-width="4" stroke-linecap="round" />
    </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
    width: {
        type: [String, Number],
        default: '24'
    },
    height: {
        type: [String, Number],
        default: '24'
    }
});
</script>

<style scoped>
/* 可添加额外的样式 */
</style>