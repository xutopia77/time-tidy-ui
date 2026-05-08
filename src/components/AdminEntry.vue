<template>
    <div class="admin-entry">
        <AdminNav class="nav-section" />
        <router-view class="content-section" />
    </div>
</template>
<script setup lang="ts">
import AdminNav from '@/components/AdminEntry/AdminNav.vue';
</script>

<style scoped>
.admin-entry {
    padding: 0;
    margin: 0;
    display: flex;
    height: 100%;
    width: 100%;
}

.nav-section {
    padding: 0;
    margin: 0px;
    height: 100%;
    width: var(--xc-normal-height);
    border-right: var(--xc-border);
    flex-shrink: 0;
}

.content-section {
    padding: 0;
    margin: 0;
    height: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>