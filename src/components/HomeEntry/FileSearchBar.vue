<template>
    <div class="file-search-bar">
        <div class="search-trigger" @click="openSearchPanel" :class="{ 'has-keyword': searchKeyword }">
            <span class="search-icon">🔍</span>
            <span class="search-placeholder">{{ searchKeyword || '搜索文件...' }}</span>
        </div>
        
        <div v-if="showSearchPanel" class="search-panel-overlay" @click="closeSearchPanel">
            <div class="search-panel" @click.stop>
                <div class="search-panel-header">
                    <div class="search-input-container">
                        <span class="search-icon-large">🔍</span>
                        <input v-model="searchKeyword" @keyup.enter="handleSearch" placeholder="输入文件名搜索..."
                            class="search-input-large" type="text" ref="searchInputRef" />
                        <button v-if="searchKeyword" @click="clearSearch" class="clear-btn-large">✕</button>
                    </div>
                    <button @click="handleSearch" class="search-btn-large">
                        搜索
                    </button>
                </div>
                
                <div class="search-panel-filters">
                    <div class="filter-section">
                        <h4 class="filter-section-title">文件类型</h4>
                        <div class="filter-options">
                            <button v-for="type in fileTypes" :key="type.value" 
                                @click="toggleFileType(type.value)"
                                class="filter-option-btn"
                                :class="{ 'active': isFileTypeSelected(type.value) }">
                                {{ type.label }}
                            </button>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h4 class="filter-section-title">排序方式</h4>
                        <div class="filter-options">
                            <button v-for="sort in sortOptions" :key="sort.value"
                                @click="sortBy = sort.value"
                                class="filter-option-btn"
                                :class="{ 'active': sortBy === sort.value }">
                                {{ sort.label }}
                            </button>
                        </div>
                        <div class="sort-order-toggle">
                            <button @click="sortOrder = 'asc'" class="order-btn" :class="{ 'active': sortOrder === 'asc' }">
                                ↑ 升序
                            </button>
                            <button @click="sortOrder = 'desc'" class="order-btn" :class="{ 'active': sortOrder === 'desc' }">
                                ↓ 降序
                            </button>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h4 class="filter-section-title">搜索范围</h4>
                        <div class="filter-options">
                            <button @click="pathType = 'curPath'" 
                                class="filter-option-btn"
                                :class="{ 'active': pathType === 'curPath' }">
                                当前目录
                            </button>
                            <button @click="pathType = 'allPath'"
                                class="filter-option-btn"
                                :class="{ 'active': pathType === 'allPath' }">
                                全部文件
                            </button>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <h4 class="filter-section-title">
                            文件标签 ({{ selectedTags.length }})
                        </h4>
                        <div class="tag-options-header">
                            <label class="tag-option-label">
                                <input type="checkbox" v-model="bReverseSltTag" class="tag-checkbox" />
                                反选
                            </label>
                            <label class="tag-option-label">
                                无标签:
                                <select v-model="bNoTag" class="tag-select">
                                    <option value="">全部</option>
                                    <option value="false">有标签</option>
                                    <option value="true">无标签</option>
                                </select>
                            </label>
                        </div>
                        <div class="filter-options tag-options">
                            <button v-for="tag in fileTags" :key="tag.name"
                                @click="toggleTag(tag.name)"
                                class="filter-option-btn tag-btn"
                                :class="{ 'active': isTagSelected(tag.name) }"
                                :style="isTagSelected(tag.name) ? { backgroundColor: tag.color, borderColor: tag.color } : {}">
                                {{ Utils.tagName2Display(tag.name) }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';

const appStore = useAppStore();

const showSearchPanel = ref(false);
const searchKeyword = ref('');
const selectedFileTypes = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const sortBy = ref('time');
const sortOrder = ref('asc');
const pathType = ref('curPath');
const bReverseSltTag = ref(false);
const bNoTag = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

const fileTypes = [
    { value: 'image', label: '图片' },
    { value: 'video', label: '视频' },
    { value: 'audio', label: '音频' },
    { value: 'text', label: '文本' },
    { value: 'other', label: '其他' }
];

const sortOptions = [
    { value: 'time', label: '时间' },
    { value: 'name', label: '名称' },
    { value: 'size', label: '大小' },
    { value: 'type', label: '类型' }
];

const fileTags = computed(() => {
    const uniqueTags: DatType.FileItemTag[] = [];
    for (const item of appStore.allTags) {
        const tmpTag = new DatType.FileItemTag();
        tmpTag.name = item.name;
        tmpTag.color = item.color;
        uniqueTags.push(tmpTag);
    }
    return uniqueTags;
});

watch(() => appStore.searchCon, (newVal) => {
    sortBy.value = newVal.sortBy;
    sortOrder.value = newVal.sortOrder;
    pathType.value = newVal.pathType;
    selectedFileTypes.value = newVal.types ? [...newVal.types] : [];
    selectedTags.value = newVal.tags ? [...newVal.tags] : [];
    bReverseSltTag.value = newVal.bReverseSltTag;
    bNoTag.value = newVal.noTag;
}, { immediate: true, deep: true });

const openSearchPanel = async () => {
    showSearchPanel.value = true;
    await nextTick();
    if (searchInputRef.value) {
        searchInputRef.value.focus();
    }
};

const closeSearchPanel = () => {
    showSearchPanel.value = false;
};

const toggleFileType = (typeValue: string) => {
    const index = selectedFileTypes.value.indexOf(typeValue);
    if (index === -1) {
        selectedFileTypes.value.push(typeValue);
    } else {
        selectedFileTypes.value.splice(index, 1);
    }
};

const isFileTypeSelected = (typeValue: string) => {
    return selectedFileTypes.value.includes(typeValue);
};

const toggleTag = (tagName: string) => {
    const index = selectedTags.value.indexOf(tagName);
    if (index === -1) {
        selectedTags.value.push(tagName);
    } else {
        selectedTags.value.splice(index, 1);
    }
};

const isTagSelected = (tagName: string) => {
    return selectedTags.value.includes(tagName);
};

const handleSearch = async () => {
    appStore.searchCon.sortBy = sortBy.value;
    appStore.searchCon.sortOrder = sortOrder.value;
    appStore.searchCon.pathType = pathType.value;
    appStore.searchCon.types = selectedFileTypes.value as DatType.FileType[];
    appStore.searchCon.tags = [...selectedTags.value];
    appStore.searchCon.bReverseSltTag = bReverseSltTag.value;
    appStore.searchCon.noTag = bNoTag.value;
    
    await Utils.files_get();
    closeSearchPanel();
};

const clearSearch = () => {
    searchKeyword.value = '';
    if (searchInputRef.value) {
        searchInputRef.value.focus();
    }
};
</script>

<style scoped>
.file-search-bar {
    width: 100%;
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-background-color);
    border-bottom: var(--xc-border);
}

.search-trigger {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    background-color: var(--xc-input-bg-color);
    border: 1px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-md);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
    max-width: 300px;
}

.search-trigger:hover {
    background-color: var(--xc-input-bg-color-hover);
    border-color: var(--xc-border-color);
}

.search-trigger.has-keyword {
    border-color: var(--xc-primary-color);
    background-color: rgba(74, 111, 165, 0.05);
}

.search-icon {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color-secondary);
}

.search-placeholder {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.search-trigger.has-keyword .search-placeholder {
    color: var(--xc-text-color);
}

.search-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 100px;
    z-index: 1000;
}

.search-panel {
    background-color: var(--xc-background-color);
    border-radius: var(--xc-border-radius-lg);
    box-shadow: var(--xc-shadow-lg);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.search-panel-header {
    display: flex;
    gap: var(--xc-spacing-sm);
    padding: var(--xc-spacing-md);
    border-bottom: var(--xc-border);
    position: sticky;
    top: 0;
    background-color: var(--xc-background-color);
    z-index: 1;
}

.search-input-container {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon-large {
    position: absolute;
    left: var(--xc-spacing-md);
    font-size: var(--xc-font-size-lg);
    color: var(--xc-text-color-secondary);
    pointer-events: none;
}

.search-input-large {
    width: 100%;
    height: 40px;
    padding: var(--xc-spacing-sm) var(--xc-spacing-xl);
    padding-left: 40px;
    background-color: var(--xc-input-bg-color);
    border: 2px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-md);
    outline: none;
    transition: all var(--xc-transition-normal);
}

.search-input-large:focus {
    border-color: var(--xc-input-border-color-focus);
    box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.2);
}

.search-input-large::placeholder {
    color: var(--xc-text-color-secondary);
}

.clear-btn-large {
    position: absolute;
    right: var(--xc-spacing-sm);
    background: none;
    border: none;
    color: var(--xc-text-color-secondary);
    cursor: pointer;
    padding: var(--xc-spacing-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--xc-transition-fast);
    font-size: var(--xc-font-size-md);
}

.clear-btn-large:hover {
    color: var(--xc-text-color);
}

.search-btn-large {
    height: 40px;
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    background-color: var(--xc-primary-color);
    color: white;
    border: none;
    border-radius: var(--xc-border-radius-md);
    cursor: pointer;
    font-size: var(--xc-font-size-md);
    font-weight: 500;
    transition: all var(--xc-transition-normal);
    white-space: nowrap;
}

.search-btn-large:hover {
    background-color: var(--xc-primary-color-hover);
}

.search-panel-filters {
    padding: var(--xc-spacing-md);
}

.filter-section {
    margin-bottom: var(--xc-spacing-lg);
}

.filter-section:last-child {
    margin-bottom: 0;
}

.filter-section-title {
    font-size: var(--xc-font-size-sm);
    font-weight: 600;
    color: var(--xc-text-color);
    margin: 0 0 var(--xc-spacing-sm) 0;
}

.filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-xs);
}

.filter-option-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
}

.filter-option-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
    border-color: var(--xc-border-hover);
}

.filter-option-btn.active {
    background-color: var(--xc-primary-color);
    border-color: var(--xc-primary-color);
    color: white;
}

.sort-order-toggle {
    display: flex;
    gap: var(--xc-spacing-xs);
    margin-top: var(--xc-spacing-sm);
}

.order-btn {
    flex: 1;
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color-secondary);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
}

.order-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.order-btn.active {
    background-color: var(--xc-primary-color);
    border-color: var(--xc-primary-color);
    color: white;
}

.tag-options-header {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-md);
    margin-bottom: var(--xc-spacing-sm);
    flex-wrap: wrap;
}

.tag-option-label {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    cursor: pointer;
}

.tag-checkbox {
    cursor: pointer;
}

.tag-select {
    height: 24px;
    padding: 2px var(--xc-spacing-xs);
    background-color: var(--xc-input-bg-color);
    border: 1px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-xs);
    outline: none;
    cursor: pointer;
}

.tag-options {
    max-height: 200px;
    overflow-y: auto;
}

.tag-btn {
    position: relative;
}

.tag-btn.active {
    color: white;
}
</style>
