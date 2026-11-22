<template>
    <!-- renders nothing; exists so useMessage() can be called inside NMessageProvider -->
    <span v-if="false" />
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { bindMessage } from '@/common/toast';

// bind Naive UI message api to the common/toast bridge, so Utils.message_notify
// keeps its legacy signature for all existing call sites
bindMessage(useMessage());
</script>
