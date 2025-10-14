<template>
    <div class="header-panel">
        <div class="header-panel-operate">
            <WindmillTwo v-bind="iconProps" />
            <span class="nav-button">
                <router-link class="no-underline-link" to="/">
                    <Home v-bind="iconProps" />
                </router-link>
            </span>
            <span class="nav-button">
                <router-link class="no-underline-link" to="/admin">
                    <System v-bind="iconProps" />
                </router-link>
            </span>
        </div>
        <div class="header-panel-info">

        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Home, System, WindmillTwo } from '@icon-park/vue-next'
import '@/assets/common.css'
// import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
const iconProps = computed(() => (appStore.iconProps))

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