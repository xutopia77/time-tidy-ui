<template>
    <div class="header-panel">
        <div class="header-panel-operate">
            <span class="nav-button">
                <router-link class="no-underline-link" to="/">
                    <!-- <img src="/assets/images/home.svg" alt="Home Icon" style="width: 20px; height: 20px;"> -->
                    <HomeIcon />
                </router-link>
            </span>
            <span>
                <router-link class="no-underline-link" to="/set">
                    <!-- <img src="/assets/images/settings.svg" alt="Home Icon" style="width: 20px; height: 20px;"> -->
                    <SettingIcon />
                </router-link>
            </span>
        </div>
        <div class="header-panel-info">

        </div>
    </div>
</template>
<script setup lang="ts">
import { HomeIcon, SettingIcon } from '@/components/Icon'
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
    width: 100px;
    height: 100%;
    padding: 0;
    margin: 0;
}

.header-panel-info {
    width: calc(100% - 100px);
    height: 100%;
    padding: 0;
    margin: 0;
    text-align: right;
}
</style>