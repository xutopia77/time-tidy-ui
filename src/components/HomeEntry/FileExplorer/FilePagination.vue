<template>
    <div class="flex items-center gap-3 py-2 px-3 bg-bg-secondary border-b border-border">
        <div class="flex items-center gap-2">
            <span class="text-sm text-text-primary whitespace-nowrap">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
            <span class="text-sm text-text-secondary whitespace-nowrap">总数: {{ totalItems }}</span>
        </div>
        
        <div class="flex gap-1">
            <button 
                @click="btnclk_prevPage" 
                :disabled="currentPage === 1" 
                class="h-9 py-1 px-2 bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-bg-tertiary hover:border-border-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ‹ 上一页
            </button>
            <button 
                @click="btnclk_nextPage" 
                :disabled="currentPage === totalPages" 
                class="h-9 py-1 px-2 bg-bg-elevated border border-border rounded-sm text-text-primary text-sm cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-bg-tertiary hover:border-border-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
                下一页 ›
            </button>
        </div>
        
        <div class="flex items-center gap-1">
            <label class="text-sm text-text-secondary whitespace-nowrap">每页:</label>
            <select 
                v-model="pageSize" 
                @change="btnclk_chgePageSize" 
                class="h-9 py-1 px-2 bg-bg-secondary border border-border rounded-sm text-text-primary text-sm outline-none cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:border-border-dark focus:border-primary"
            >
                <option value="10">200</option>
                <option value="20">300</option>
                <option value="50">500</option>
                <option value="100">1000</option>
                <option value="200">2000</option>
                <option value="500">5000</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';

const appStore = useAppStore();

const totalItems = computed(() => {
    return appStore.curFileTotal;
});

const pageSize = computed({
    get: () => {
        return appStore.searchCon.pageSize;
    },
    set: (newValue) => {
        appStore.searchCon.pageSize = Number(newValue);
    }
});

const currentPage = computed(() => {
    return appStore.searchCon.page;
});

const totalPages = computed(() => {
    const re = Math.ceil(appStore.curFileTotal / appStore.searchCon.pageSize);
    return re === 0 ? 1 : re;
});

const btnclk_prevPage = () => {
    if (appStore.searchCon.page > 1) {
        appStore.searchCon.page--;
    }
    Utils.files_get(null);
};

const btnclk_nextPage = () => {
    if (appStore.searchCon.page < totalPages.value) {
        appStore.searchCon.page++;
    }
    Utils.files_get(null);
};

const btnclk_chgePageSize = () => {
    appStore.searchCon.page = 1;
    Utils.files_get(null);
};
</script>
