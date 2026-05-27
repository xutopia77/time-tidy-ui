<template>
    <div class="sidebar-nav">
        <div class="sidebar-logo">
            <img src="/assets/images/icon.png" alt="logo" width="28" height="28" />
        </div>
        
        <div class="sidebar-menu">
            <router-link class="menu-item" to="/" v-slot="{ isActive }">
                <div class="menu-link" :class="{ 'active': isActive }">
                    <Home size="22" />
                    <span>主页</span>
                </div>
            </router-link>
            
            <router-link class="menu-item" to="/admin/PrjSet" v-slot="{ isActive }">
                <div class="menu-link" :class="{ 'active': isActive }">
                    <Dashboard size="22" />
                    <span>管理</span>
                </div>
            </router-link>
            
            <router-link class="menu-item" to="/settings" v-slot="{ isActive }">
                <div class="menu-link" :class="{ 'active': isActive }">
                    <System size="22" />
                    <span>设置</span>
                </div>
            </router-link>
        </div>
        
        <div class="sidebar-footer">
            <button @click="btn_show_resent_msg()" class="menu-link notification-btn" title="查看最近消息提醒">
                <Remind size="22" />
                <span>消息</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Home, System, Remind, Dashboard } from '@icon-park/vue-next'
import '@/assets/common.css'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

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
    margin-bottom: var(--xc-spacing-xl);
    width: 100%;
}

.menu-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--xc-spacing-xs);
    /* padding: var(--xc-spacing-sm); */
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
}

.menu-link:hover {
    background-color: var(--xc-background-color-hover);
}

.menu-link.active {
    background-color: var(--xc-primary-color);
    color: white;
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
