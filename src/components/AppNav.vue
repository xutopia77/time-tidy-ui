<template>
    <div class="header-panel">
        <div class="header-panel-operate">
            <WindmillTwo v-bind="iconProps" style="padding-right: 16px; padding-right: 16px;" />
            <router-link class="no-underline-link" to="/">
                <button class="xc-button" style="border: none;">
                    <Home v-bind="iconProps" title="主页" />
                </button>
            </router-link>
            <router-link class="no-underline-link" to="/admin/PrjSet">
                <button class="xc-button" style="border: none;">
                    <System v-bind="iconProps" title="系统设置" />
                </button>
            </router-link>
        </div>
        <div class="header-panel-info">
            <button @click="btn_show_resent_msg()" class="xc-button" style="border:none" title="查看最近消息提醒">
                <Remind v-bind="iconProps" />
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Home, System, WindmillTwo, Remind } from '@icon-park/vue-next'
import '@/assets/common.css'
// import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
const iconProps = computed(() => (appStore.iconProps))

function btn_show_resent_msg() {
    appStore.bPageResentMsg = true;
}

</script>
<style scoped>
.no-underline-link {
    text-decoration: none;
    color: var(--xc-text-color);
    padding-right: 16px;
    padding-left: 16px;
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
    color: var(--xc-text-color);
}

.header-panel-info {
    width: calc(100% - 200px);
    height: 100%;
    padding: 0;
    margin: 0;
    text-align: right;
}
</style>