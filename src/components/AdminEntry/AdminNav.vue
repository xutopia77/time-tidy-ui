<template>
    <div class="admin-nav">
        <button class="nav-button">
            <router-link class="no-underline-link" to="/admin/PrjSet">
                <Setting theme="outline" size="24" fill="#333" />
            </router-link>
        </button>
        <button class="nav-button">
            <router-link class="no-underline-link" to="/admin/TagsMng">
                <TagOne theme="outline" size="24" fill="#333" />
            </router-link>

        </button>
        <button class="nav-button">
            <router-link class="no-underline-link" to="/admin/DbInfo">
                <Info theme="outline" size="24" fill="#333" />
            </router-link>
        </button>
        <button class="nav-button" v-if="false">
            <router-link class="no-underline-link" to="/admin/OtherMisc">
                <Book theme="outline" size="24" fill="#333" />
            </router-link>
        </button>
    </div>
</template>
<script setup lang="ts">
import '@/assets/common.css';
import { Book, TagOne, Setting, Info } from '@icon-park/vue-next';

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