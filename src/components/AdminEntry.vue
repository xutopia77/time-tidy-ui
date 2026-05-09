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
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.nav-section {
    padding: 0;
    margin: 0px;
    height: calc(var(--xc-normal-height) + var(--xc-spacing-md));
    width: 100%;
    border-bottom: var(--xc-border);
    flex-shrink: 0;
}

.content-section {
    padding: 0;
    margin: 0;
    flex: 1;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>