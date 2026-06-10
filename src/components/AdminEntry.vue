<template>
    <div class="flex flex-col h-full w-full">
        <AdminNav class="h-14 w-full border-b border-border flex-shrink-0" />
        <router-view class="flex-1 w-full overflow-y-auto overflow-x-hidden" />
    </div>
</template>

<script setup lang="ts">
import AdminNav from '@/components/AdminEntry/AdminNav.vue';
</script>
