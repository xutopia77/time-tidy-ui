<template>
    <svg :width="width" :height="height" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12L31 24L19 36" stroke="currentColor" stroke-width="2" />
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

<style scoped></style>