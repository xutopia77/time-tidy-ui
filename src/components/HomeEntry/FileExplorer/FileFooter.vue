<template>
    <div class="pagination">
        <button @click="btnclk_prevPage" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="btnclk_nextPage" :disabled="currentPage === totalPages">下一页</button>
        <span>总数: {{ totalItems }}</span>
        <label>
            每页数量:
            <select v-model="pageSize" @change="btnclk_chgePageSize">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
            </select>
        </label>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import Utils from '@/utils/utils';

const totalItems = computed(() => {
    return appStore.curFileTotal
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
    return appStore.searchCon.page
});

const totalPages = computed(() => {
    const re = Math.ceil(appStore.curFileTotal / appStore.searchCon.pageSize)
    return re === 0 ? 1 : re;
});

const btnclk_prevPage = () => {
    if (appStore.searchCon.page > 1) {
        appStore.searchCon.page--;
    }
    Utils.files_get(null)
};

const btnclk_nextPage = () => {
    if (appStore.searchCon.page < totalPages.value) {
        appStore.searchCon.page++;
    }
    Utils.files_get(null)
};

function btnclk_chgePageSize() {
    appStore.searchCon.page = 1;
    Utils.files_get(null)
}

</script>
<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0px;
    background-color: #e0e0e0;
}

.pagination button {
    padding: 0px;
    cursor: pointer;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.pagination button:disabled {
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
}

.pagination select {
    padding: 0px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>