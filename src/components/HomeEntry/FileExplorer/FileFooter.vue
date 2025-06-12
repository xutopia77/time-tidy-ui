<template>
    <div class="footer-container">
        <div class="pagination">
            <button @click="btnclk_prevPage" :disabled="currentPage === 1" class="xc-button pagination-btn">上一页</button>
            <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
            <button @click="btnclk_nextPage" :disabled="currentPage === totalPages"
                class="xc-button pagination-btn">下一页</button>
            <span>总数: {{ totalItems }}</span>
            <label>
                每页数量:
                <select v-model="pageSize" @change="btnclk_chgePageSize" class="xc-select pagination-slt">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </label>
        </div>
        <div><span>{{ footerInfo }}</span></div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'

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

// ------

const footerInfo = computed(() => {
    if (appStore.curFiles == null) {
        return '';
    }
    let checkedNum = 0;
    appStore.curFiles.forEach((file) => {
        if (file.checked) {
            checkedNum++;
        }
    })
    if (checkedNum == 0) {
        return '';
    }
    return `选中数量: ${checkedNum}`;
})

</script>
<style scoped>
.footer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0px;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0px;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
}

.pagination-btn {
    margin: 0;
    padding: 0px;
    height: 20px;
    font-size: small;
}

.pagination-slt {
    font-size: small;
    padding: 0px;
    margin: 0px;
    height: 20px;
}
</style>