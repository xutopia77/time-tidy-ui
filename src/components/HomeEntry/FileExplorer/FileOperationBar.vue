<template>
    <Transition name="slide-up">
        <div v-if="showBar" class="operation-bar">
            <div class="operation-bar-content">
                <div class="selection-info">
                    <span class="selection-count">{{ checkedCount }} 选中</span>
                    <button @click="clearSelection" class="xc-button clear-btn">取消</button>
                </div>
                
                <div class="operation-actions">
                    <div class="popup-wrapper">
                        <button @click="toggleScorePanel" class="xc-button action-btn">评分</button>
                        <Transition name="fade-down">
                            <div v-if="showScorePanel" class="popup-panel score-panel">
                                <button 
                                    v-for="score in 5" 
                                    :key="score"
                                    @click="setFileScore(score)"
                                    class="xc-button score-btn"
                                    :class="{ active: isCurrentScore(score) }"
                                >
                                    {{ score }}☆
                                </button>
                            </div>
                        </Transition>
                    </div>
                    
                    <div class="popup-wrapper">
                        <button @click="toggleTagPanel" class="xc-button action-btn">标签</button>
                        <Transition name="fade-down">
                            <div v-if="showTagPanel" class="popup-panel tag-panel" @click.stop>
                                <div class="tag-input-section">
                                    <input 
                                        v-model="newTag" 
                                        @keyup.enter="addTag"
                                        placeholder="输入标签回车添加..."
                                        class="xc-input-text tag-input"
                                        list="tagSuggestions"
                                    />
                                    <datalist id="tagSuggestions">
                                        <option v-for="tag in tagSuggestions" :key="tag" :value="tag"></option>
                                    </datalist>
                                </div>
                                
                                <div v-if="fileTags.length > 0" class="tag-list-section">
                                    <div class="tag-list-title">已有标签</div>
                                    <div class="tag-list">
                                        <div v-for="tag in fileTags" :key="tag.name" class="tag-item">
                                            <span class="tag-color" :style="{ backgroundColor: tag.color || '#999' }"></span>
                                            <span class="tag-name">{{ Utils.tagName2Display(tag.name) }}</span>
                                            <button @click="deleteTag(tag.name)" class="tag-delete-btn">×</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div v-else class="no-tags-message">
                                    暂无标签
                                </div>
                            </div>
                        </Transition>
                    </div>
                    
                    <button @click="btnclk_move_file" class="xc-button action-btn">移动</button>
                    <button @click="btnclk_copy_file" class="xc-button action-btn">复制</button>
                    <button @click="btnclk_delete_file" class="xc-button action-btn danger">删除</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';

const appStore = useAppStore();

const checkedCount = computed(() => {
    let count = 0;
    if (appStore.curFiles) {
        appStore.curFiles.forEach((file) => {
            if (file.checked) {
                count++;
            }
        });
    }
    if (appStore.curDirs) {
        appStore.curDirs.forEach((dir) => {
            if (dir.checked) {
                count++;
            }
        });
    }
    return count;
});

const showBar = computed(() => {
    return checkedCount.value > 0;
});

const showScorePanel = ref(false);
const showTagPanel = ref(false);
const newTag = ref('');

const tagSuggestions = computed(() => {
    return appStore.allTags.map(tag => Utils.tagName2Display(tag.name));
});

const fileTags = computed(() => {
    const fSlt: DatType.File[] = [];
    for (const item of appStore.curFiles) {
        if (item.checked)
            fSlt.push(item);
    }
    if (fSlt.length > 0) {
        const allTags: DatType.FileItemTag[] = [];
        for (const item of fSlt) {
            for (const tag of item.tags) {
                if (!allTags.some(t => t.name === tag.name)) {
                    allTags.push(tag);
                }
            }
        }
        return allTags;
    }
    return [];
});

const currentScore = computed(() => {
    const fSlt: DatType.File[] = [];
    for (const item of appStore.curFiles) {
        if (item.checked)
            fSlt.push(item);
    }
    
    if (fSlt.length === 0) return 0;
    
    const scores = fSlt.map(file => {
        const scoreTag = file.tags.find(tag => tag.name.startsWith('sys_score'));
        if (scoreTag) {
            return parseInt(scoreTag.name.replace('sys_score', ''));
        }
        return 0;
    });
    
    const firstScore = scores[0];
    const allSame = scores.every(s => s === firstScore);
    
    return allSame ? firstScore : 0;
});

const isCurrentScore = (score: number) => {
    return currentScore.value === score;
};

const toggleScorePanel = () => {
    showScorePanel.value = !showScorePanel.value;
    if (showScorePanel.value) {
        showTagPanel.value = false;
    }
};

const toggleTagPanel = () => {
    showTagPanel.value = !showTagPanel.value;
    if (showTagPanel.value) {
        showScorePanel.value = false;
    }
};

const closeAllPanels = () => {
    showScorePanel.value = false;
    showTagPanel.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.popup-wrapper')) {
        closeAllPanels();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const clearSelection = () => {
    if (appStore.curFiles) {
        appStore.curFiles.forEach((file) => {
            file.checked = false;
        });
    }
    if (appStore.curDirs) {
        appStore.curDirs.forEach((dir) => {
            dir.checked = false;
        });
    }
    closeAllPanels();
};

const setFileScore = (score: number) => {
    const req: DatType.FilesTagSetReq = {
        fileIds: [],
        tagName: ''
    };
    
    if (appStore.curFiles) {
        appStore.curFiles.forEach((file) => {
            if (file.checked) {
                req.fileIds.push(file.id);
            }
        });
    }
    
    if (req.fileIds.length === 0) {
        Utils.addToast('请选择要操作的文件');
        return;
    }
    
    if (isCurrentScore(score)) {
        req.tagName = `sys_score${score}`;
        Utils.files_tag_delete(req);
        Utils.message_notify({ 
            content: `已删除评分`, 
            type: 'success' 
        });
    } else {
        req.tagName = `sys_score${score}`;
        Utils.files_tag_set(req);
        Utils.message_notify({ 
            content: `已设置评分 ${score}☆`, 
            type: 'success' 
        });
    }
    
    closeAllPanels();
};

const addTag = () => {
    if (!newTag.value.trim()) {
        return;
    }
    
    const req: DatType.FilesTagSetReq = {
        fileIds: [],
        tagName: newTag.value.trim()
    };
    
    if (appStore.curFiles) {
        appStore.curFiles.forEach((file) => {
            if (file.checked) {
                req.fileIds.push(file.id);
            }
        });
    }
    
    if (req.fileIds.length === 0) {
        Utils.addToast('请选择要操作的文件');
        return;
    }
    
    Utils.files_tag_set(req);
    newTag.value = '';
};

const deleteTag = (tagName: string) => {
    const req: DatType.FilesTagSetReq = {
        tagName: tagName,
        fileIds: []
    };
    
    if (appStore.curFiles) {
        appStore.curFiles.forEach((file) => {
            if (file.checked) {
                req.fileIds.push(file.id);
            }
        });
    }
    
    if (req.fileIds.length === 0) {
        Utils.addToast('请选择要操作的文件');
        return;
    }
    
    Utils.files_tag_delete(req);
    Utils.message_notify({ 
        content: `已删除标签 ${Utils.tagName2Display(tagName)}`, 
        type: 'success' 
    });
};

const btnclk_move_file = () => {
    appStore.bPageFileTransfer = true;
    closeAllPanels();
};

const btnclk_copy_file = () => {
    appStore.bPageFileTransfer = true;
    closeAllPanels();
};

const btnclk_delete_file = () => {
    const req: DatType.FileDeleteReq = {
        fileIds: [],
        dirIds: [],
        bRemoveToDtrash: true,
    };
    
    if (appStore.curFiles) {
        for (const item of appStore.curFiles) {
            if (item.checked) {
                req.fileIds.push(item.id);
            }
        }
    }
    
    if (appStore.curDirs) {
        for (const item of appStore.curDirs) {
            if (item.checked) {
                req.dirIds.push(item.id);
            }
        }
    }
    
    if (req.fileIds.length == 0 && req.dirIds.length == 0) {
        Utils.addToast('请选择要操作的文件');
        return;
    }
    
    Utils.files_delete(req);
    clearSelection();
};

</script>

<style scoped>
.operation-bar {
    position: fixed;
    bottom: var(--xc-spacing-xl);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    min-width: 400px;
    max-width: 96vw;
}

.operation-bar-content {
    background-color: var(--xc-background-color);
    border: var(--xc-border);
    border-radius: var(--xc-border-radius-lg);
    box-shadow: var(--xc-shadow-lg);
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-lg);
}

.selection-info {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
    padding-right: var(--xc-spacing-lg);
    border-right: 1px solid var(--xc-border-color);
}

.selection-count {
    font-size: var(--xc-font-size-md);
    font-weight: 500;
    color: var(--xc-text-color);
    white-space: nowrap;
}

.clear-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    font-size: var(--xc-font-size-sm);
}

.operation-actions {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.action-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    font-size: var(--xc-font-size-sm);
}

.action-btn.danger {
    background-color: var(--xc-error-color);
    color: white;
}

.action-btn.danger:hover {
    background-color: #d41920;
}

.popup-wrapper {
    position: relative;
    display: inline-block;
}

.popup-panel {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: var(--xc-spacing-xs);
    background-color: var(--xc-background-color);
    border: var(--xc-border);
    border-radius: var(--xc-border-radius-md);
    box-shadow: var(--xc-shadow-md);
    z-index: 1001;
}

.score-panel {
    padding: var(--xc-spacing-xs);
    display: flex;
    gap: var(--xc-spacing-xs);
}

.score-btn {
    min-width: 50px;
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    font-size: var(--xc-font-size-sm);
}

.score-btn.active {
    background-color: var(--xc-primary-color);
    color: white;
}

.tag-panel {
    padding: var(--xc-spacing-md);
    min-width: 300px;
    max-width: 400px;
}

.tag-input-section {
    margin-bottom: var(--xc-spacing-md);
}

.tag-input {
    width: calc(100% - 14px);
    margin: 0;
}

.tag-list-section {
    margin-top: var(--xc-spacing-sm);
}

.tag-list-title {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    margin-bottom: var(--xc-spacing-sm);
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-xs);
}

.tag-item {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    background-color: var(--xc-group-color);
    border-radius: var(--xc-border-radius-sm);
    transition: all var(--xc-transition-fast);
}

.tag-item:hover {
    background-color: var(--xc-background-color-hover);
}

.tag-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.tag-name {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color);
}

.tag-delete-btn {
    background: none;
    border: none;
    color: var(--xc-text-color-secondary);
    font-size: 16px;
    cursor: pointer;
    padding: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all var(--xc-transition-fast);
}

.tag-delete-btn:hover {
    background-color: var(--xc-error-color);
    color: white;
}

.no-tags-message {
    padding: var(--xc-spacing-md);
    text-align: center;
    color: var(--xc-text-color-secondary);
    font-size: var(--xc-font-size-sm);
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
}

.fade-down-enter-active,
.fade-down-leave-active {
    transition: all 0.2s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
}
</style>
