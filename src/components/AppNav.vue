<template>
    <div class="header-panel">
        <div class="header-panel-operate">
            <BookIcon style="margin-left: 6px; margin-right: 16px;" />
            <span class="nav-button">
                <router-link class="no-underline-link" to="/">
                    <HomeIcon />
                </router-link>
            </span>
            <span class="nav-button">
                <router-link class="no-underline-link" to="/admin">
                    <ApplicationIcon />
                </router-link>
            </span>
        </div>
        <div class="header-panel-info">

        </div>
    </div>
</template>
<script setup lang="ts">
import { HomeIcon, ApplicationIcon, BookIcon } from '@/components/Icon'
</script>
<style scoped>
.no-underline-link {
    text-decoration: none;
}

.nav-button {
    margin-right: 20px;
}

.header-panel {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
}

.header-panel-operate {
    width: 200px;
    height: 100%;
    padding: 0;
    margin: 0;
}

.header-panel-info {
    width: calc(100% - 200px);
    height: 100%;
    padding: 0;
    margin: 0;
    text-align: right;
}
</style>