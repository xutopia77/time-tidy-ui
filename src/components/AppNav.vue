<template>
    <div class="w-16 min-w-16 h-screen bg-bg-secondary border-r border-border flex flex-col fixed left-0 top-0 z-[100] overflow-hidden">
        <!-- Logo -->
        <div class="flex items-center justify-center py-4 border-border">
            <img src="/assets/images/icon.png" alt="logo" width="28" height="28" />
        </div>
        
        <!-- Menu -->
        <div class="flex-1 py-2 overflow-y-auto overflow-x-hidden">
            <router-link class="block mb-5 w-full no-underline" to="/" v-slot="{ isActive }">
                <div 
                    class="flex flex-col items-center justify-center gap-1 mx-1 rounded-lg text-text-primary transition-all duration-200 cursor-pointer border-none bg-none w-[calc(100%-8px)] max-w-[calc(100%-8px)] text-center"
                    :class="{ 'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive }"
                >
                    <Home size="22" />
                    <span>主页</span>
                </div>
            </router-link>

            <div class="block mb-5 w-full">
                <div 
                    class="flex flex-col items-center justify-center gap-1 mx-1 rounded-lg text-text-primary transition-all duration-200 cursor-pointer border-none bg-none w-[calc(100%-8px)] max-w-[calc(100%-8px)] text-center"
                    :class="{ 'bg-primary text-white': appStore.sidebarOpen, 'hover:bg-bg-elevated': !appStore.sidebarOpen }"
                    @click="appStore.sidebarOpen = !appStore.sidebarOpen"
                >
                    <TagOne size="22" />
                    <span>标签</span>
                </div>
            </div>
            
            <router-link class="block mb-5 w-full no-underline" to="/admin/PrjSet" v-slot="{ isActive }">
                <div 
                    class="flex flex-col items-center justify-center gap-1 mx-1 rounded-lg text-text-primary transition-all duration-200 cursor-pointer border-none bg-none w-[calc(100%-8px)] max-w-[calc(100%-8px)] text-center"
                    :class="{ 'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive }"
                >
                    <Dashboard size="22" />
                    <span>管理</span>
                </div>
            </router-link>
            
            <router-link class="block mb-5 w-full no-underline" to="/settings" v-slot="{ isActive }">
                <div 
                    class="flex flex-col items-center justify-center gap-1 mx-1 rounded-lg text-text-primary transition-all duration-200 cursor-pointer border-none bg-none w-[calc(100%-8px)] max-w-[calc(100%-8px)] text-center"
                    :class="{ 'bg-primary text-white': isActive, 'hover:bg-bg-elevated': !isActive }"
                >
                    <System size="22" />
                    <span>设置</span>
                </div>
            </router-link>
        </div>
        
        <!-- Footer -->
        <div class="py-2 border-t border-border">
            <button 
                @click="btn_show_resent_msg()" 
                class="flex flex-col items-center justify-center gap-1 mx-1 rounded-lg text-text-primary transition-all duration-200 cursor-pointer border-none bg-none w-[calc(100%-8px)] max-w-[calc(100%-8px)] text-center hover:bg-bg-elevated"
                title="查看最近消息提醒"
            >
                <Remind size="22" />
                <span>消息</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Home, System, Remind, Dashboard, TagOne } from '@icon-park/vue-next'
import { useAppStore } from '@/stores/AppStore';

const appStore = useAppStore()

function btn_show_resent_msg() {
    appStore.bPageResentMsg = true;
}
</script>
