<template>
    <div class="sidebar-nav">
        <div class="sidebar-logo">
            <WindmillTwo v-bind="iconProps" size="28" />
        </div>
        
        <div class="sidebar-menu">
            <router-link class="menu-item" to="/" v-slot="{ isActive }">
                <div class="menu-link" :class="{ 'active': isActive }">
                    <div class="menu-icon-wrapper">
                        <Home v-bind="iconProps" size="22" />
                    </div>
                    <span class="menu-text">主页</span>
                </div>
            </router-link>
            
            <router-link class="menu-item" to="/admin/PrjSet" v-slot="{ isActive }">
                <div class="menu-link" :class="{ 'active': isActive }">
                    <div class="menu-icon-wrapper">
                        <System v-bind="iconProps" size="22" />
                    </div>
                    <span class="menu-text">设置</span>
                </div>
            </router-link>
        </div>
        
        <div class="sidebar-footer">
            <button @click="btn_show_resent_msg()" class="menu-link notification-btn" title="查看最近消息提醒">
                <div class="menu-icon-wrapper">
                    <Remind v-bind="iconProps" size="22" />
                </div>
                <span class="menu-text">消息</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Home, System, WindmillTwo, Remind } from '@icon-park/vue-next'
import '@/assets/common.css'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
const iconProps = computed(() => (appStore.iconProps))

function btn_show_resent_msg() {
    appStore.bPageResentMsg = true;
}
</script>

<style scoped>
.sidebar-nav {
    width: var(--xc-sidebar-width);
    min-width: var(--xc-sidebar-width);
    height: 100vh;
    background-color: var(--xc-background-color);
    border-right: 1px solid var(--xc-border-color);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    overflow: hidden;
}

.sidebar-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--xc-spacing-lg) 0;
    border-bottom: 1px solid var(--xc-border-color);
}

.sidebar-menu {
    flex: 1;
    padding: var(--xc-spacing-sm) 0;
    overflow-y: auto;
    overflow-x: hidden;
}

.menu-item {
    text-decoration: none;
    display: block;
    margin-bottom: var(--xc-spacing-xs);
}

.menu-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-md) var(--xc-spacing-sm);
    margin: 0 var(--xc-spacing-xs);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    transition: all var(--xc-transition-normal);
    cursor: pointer;
    border: none;
    background: none;
    width: calc(100% - var(--xc-spacing-sm));
    max-width: calc(100% - var(--xc-spacing-sm));
    text-align: center;
    position: relative;
}

.menu-link:hover {
    background-color: var(--xc-background-color-hover);
}

.menu-link.active {
    color: var(--xc-primary-color);
}

.menu-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background-color: var(--xc-primary-color);
    border-radius: 0 2px 2px 0;
}

.menu-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
    transition: background-color var(--xc-transition-normal);
}

.menu-link.active .menu-icon-wrapper {
    background-color: rgba(74, 111, 165, 0.15);
}

.menu-text {
    font-size: var(--xc-font-size-sm);
    line-height: 1.2;
    white-space: nowrap;
}

.sidebar-footer {
    padding: var(--xc-spacing-sm) 0;
    border-top: 1px solid var(--xc-border-color);
}

.notification-btn {
    width: calc(100% - var(--xc-spacing-sm));
    max-width: calc(100% - var(--xc-spacing-sm));
    margin: 0 var(--xc-spacing-xs);
}
</style>