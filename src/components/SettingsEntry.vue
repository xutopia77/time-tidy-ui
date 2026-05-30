<template>
    <div class="settings-entry">
        <div class="settings-sidebar">
            <div class="sidebar-header">
                <span class="sidebar-title">设置</span>
            </div>
            <div class="sidebar-menu">
                <div 
                    v-for="item in menuItems" 
                    :key="item.id"
                    class="menu-item"
                    :class="{ 'active': activeSection === item.id }"
                    @click="activeSection = item.id"
                >
                    <div class="menu-link">
                        <component :is="item.icon" size="18" />
                        <span>{{ item.label }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="settings-content">
            <div class="content-wrapper">
                <GeneralSettings v-if="activeSection === 'general'" />
                <AISettings v-if="activeSection === 'ai'" />
                <AboutSettings v-if="activeSection === 'about'" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User, Info, Brain } from '@icon-park/vue-next';
import GeneralSettings from './SettingsEntry/GeneralSettings.vue';
import AboutSettings from './SettingsEntry/AboutSettings.vue';
import AISettings from './SettingsEntry/AISettings.vue';
import '@/assets/common.css';

const activeSection = ref('general');

const menuItems = [
    { id: 'general', label: '基本设置', icon: User },
    { id: 'ai', label: 'AI设置', icon: Brain },
    { id: 'about', label: '关于', icon: Info },
];
</script>

<style scoped>
.settings-entry {
    display: flex;
    height: 100%;
    width: 100%;
}

.settings-sidebar {
    width: var(--xc-sidebar-width);
    min-width: var(--xc-sidebar-width);
    background-color: var(--xc-background-color);
    border-right: 1px solid var(--xc-border-color);
    flex-shrink: 0;
}

.sidebar-header {
    padding: var(--xc-spacing-md) var(--xc-spacing-sm);
    border-bottom: 1px solid var(--xc-border-color);
    text-align: center;
}

.sidebar-title {
    color: var(--xc-text-color);
}

.sidebar-menu {
    padding: var(--xc-spacing-sm) 0;
}

.menu-item {
    display: block;
    cursor: pointer;
}

.menu-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--xc-spacing-xs);
     border-radius: var(--xc-border-radius-md);
    padding: var(--xc-spacing-md) var(--xc-spacing-xs);
    color: var(--xc-text-color);
    transition: all var(--xc-transition-normal);
    text-align: center;
}



.menu-item:hover .menu-link {
    background-color: var(--xc-background-color-hover);
}

.menu-item.active .menu-link {
    background-color: var(--xc-primary-color);
    color: white;
}

.settings-content {
    flex: 1;
    overflow-y: auto;
    background-color: var(--xc-background-color-light);
}

.content-wrapper {
    padding: var(--xc-spacing-xl);
    max-width: 800px;
}
</style>
