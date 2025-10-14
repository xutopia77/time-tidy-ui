<template>
    <div class="header-panel">
        <div class="header-panel-operate">
            <Home theme="outline" size="24" />
            <span class="nav-button">
                <router-link class="no-underline-link" to="/">
                    <Home theme="outline" size="24" />
                </router-link>
            </span>
            <span class="nav-button">
                <router-link class="no-underline-link" to="/admin">
                    <System theme="outline" size="24" fill="#333" />
                </router-link>
            </span>
        </div>
        <div class="header-panel-info">

        </div>
    </div>
</template>
<script setup lang="ts">
import { Home, System } from '@icon-park/vue-next'
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