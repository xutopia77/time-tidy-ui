<template>
    <div class="pagination-container">
        <div class="pagination-info">
            <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
            <span class="total-info">总数: {{ totalItems }}</span>
        </div>
        
        <div class="pagination-controls">
            <button @click="btnclk_prevPage" :disabled="currentPage === 1" class="pagination-btn">
                ‹ 上一页
            </button>
            <button @click="btnclk_nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
                下一页 ›
            </button>
        </div>
        
        <div class="page-size-selector">
            <label class="page-size-label">每页:</label>
            <select v-model="pageSize" @change="btnclk_chgePageSize" class="page-size-select">
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

<style scoped>
.pagination-container {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-md);
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-background-color);
    border-bottom: var(--xc-border);
}

.pagination-info {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.page-info {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color);
    white-space: nowrap;
}

.total-info {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    white-space: nowrap;
}

.pagination-controls {
    display: flex;
    gap: var(--xc-spacing-xs);
}

.pagination-btn {
    height: var(--xc-normal-height);
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
    white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {
    background-color: var(--xc-button-bg-color-hover);
    border-color: var(--xc-border-hover);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-size-selector {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
}

.page-size-label {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    white-space: nowrap;
}

.page-size-select {
    height: var(--xc-normal-height);
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    background-color: var(--xc-input-bg-color);
    border: 1px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    outline: none;
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.page-size-select:hover {
    background-color: var(--xc-input-bg-color-hover);
    border-color: var(--xc-border-color);
}

.page-size-select:focus {
    border-color: var(--xc-input-border-color-focus);
}
</style>
