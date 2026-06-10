<template>
    <div class="flex h-full w-full">
        <!-- Sidebar -->
        <div class="w-16 min-w-16 bg-bg-secondary border-r border-border flex-shrink-0">
            <div class="py-3 px-2 border-b border-border text-center">
                <span class="text-text-primary">设置</span>
            </div>
            <div class="py-2">
                <div 
                    v-for="item in menuItems" 
                    :key="item.id"
                    class="block cursor-pointer"
                    @click="activeSection = item.id"
                >
                    <div 
                        class="flex flex-col items-center gap-1 rounded-lg py-3 px-1 text-text-primary transition-all duration-200 text-center"
                        :class="{ 'bg-primary text-white': activeSection === item.id, 'hover:bg-bg-elevated': activeSection !== item.id }"
                    >
                        <component :is="item.icon" size="18" />
                        <span>{{ item.label }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Content -->
        <div class="flex-1 overflow-y-auto bg-bg-secondary">
            <div class="p-5 max-w-[800px]">
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

const activeSection = ref('general');

const menuItems = [
    { id: 'general', label: '基本设置', icon: User },
    { id: 'ai', label: 'AI设置', icon: Brain },
    { id: 'about', label: '关于', icon: Info },
];
</script>
