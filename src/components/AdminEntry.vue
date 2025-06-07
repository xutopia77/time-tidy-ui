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
}

.nav-section {
    padding: 0;
    margin: 0px;
    padding: 0px;
    height: 100%;
    width: 32px;
    border-right: var(--xc-border);
}

.content-section {
    padding: 0;
    margin: 0;
    height: 100%;
    width: calc(100% - 32px);
    overflow-y: auto;
    /* 添加垂直滚动条 */
}
</style>