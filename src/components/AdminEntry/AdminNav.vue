<template>
    <div class="admin-nav">

        <router-link class="no-underline-link" to="/admin/PrjSet"  v-slot="{ isActive }">
            <div class="nav-item" :class="{'active': isActive}">
                <span>项目</span>
            </div>
        </router-link>

        <router-link class="no-underline-link" to="/admin/TagsMng"  v-slot="{ isActive }">
            <div class="nav-item" :class="{'active': isActive}">
                <span>标签</span>
            </div>
        </router-link>

        <router-link class="no-underline-link" to="/admin/SimilarityManager"  v-slot="{ isActive }">
            <div class="nav-item" :class="{'active': isActive}">
                <span>相似文件</span>
            </div>
        </router-link>

        <router-link class="no-underline-link" to="/admin/TrashManager"  v-slot="{ isActive }">
            <div class="nav-item" :class="{'active': isActive}">
                <span>回收站</span>
            </div>
        </router-link>

        <router-link class="no-underline-link" to="/admin/DbInfo"  v-slot="{ isActive }">
            <div class="nav-item" :class="{'active': isActive}">
                <span>数据库</span>
            </div>
        </router-link>
    </div>
</template>
<script setup lang="ts">
import '@/assets/common.css';

</script>
<style scoped>
.admin-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    padding: 0 var(--xc-spacing-md);
    gap: var(--xc-spacing-sm);
    background-color: var(--xc-background-color);
}

.nav-item {
    border-radius: var(--xc-border-radius-sm);
    height: calc(var(--xc-normal-height) + var(--xc-spacing-sm));
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--xc-transition-normal);
    padding-left: var(--xc-spacing-md);
    padding-right: var(--xc-spacing-md);
    color: var(--xc-text-color);
}

.nav-item:hover {
    background-color: var(--xc-background-color-hover);
}

.nav-item.active {
    background-color: var(--xc-primary-color);
    color: white;
}

.no-underline-link {
    text-decoration: none;
}
</style>