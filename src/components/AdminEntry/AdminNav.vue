<template>
    <div class="admin-nav">
        <button class="nav-button">
            <router-link class="no-underline-link" to="/admin/PrjSet">
                <SettingIcon />
            </router-link>
        </button>
        <button class="nav-button">
            <router-link class="no-underline-link" to="/admin/TagsMng">
                <TagOneIcon />
            </router-link>
        </button>
        <button class="nav-button">
            <router-link class="no-underline-link" to="/admin/DbInfo">
                <InfoIcon />
            </router-link>
        </button>
        <button class="nav-button" v-if="false">
            <router-link class="no-underline-link" to="/admin/OtherMisc">
                <ApplicationIcon />
            </router-link>
        </button>
    </div>
</template>
<script setup lang="ts">
import { TagOneIcon, SettingIcon, InfoIcon, ApplicationIcon } from '@/components/Icon'
import '@/assets/common.css';
</script>
<style scoped>
.admin-nav {}

.nav-button {
    margin-top: 16px;
    margin-bottom: 16px;
    width: 100%;
    background-color: var(--xc-background-color);
    border: none;
    border-radius: 4px;
    height: 48px;
}

.nav-button:hover {
    background-color: var(--xc-background-color-hover);
    border: var(--xc-border);
}
</style>