<template>
    <Transition name="slide-up">
        <div v-if="showBar" class="operation-bar">
            <div class="operation-bar-content">
                <div class="selection-info">
                    <span class="selection-count">{{ checkedCount }} 项已选中</span>
                    <button @click="clearSelection" class="clear-btn">取消选择</button>
                </div>
                
                <div class="operation-actions">
                    <button @click="btnclk_set_file_level" class="action-btn">
                        <span class="action-icon">⭐</span>
                        <span class="action-text">设置等级</span>
                    </button>
                    
                    <div class="action-select-wrapper">
                        <select v-model="sltLevel" class="level-select" @click.stop>
                            <option value="sys_score1">1☆</option>
                            <option value="sys_score2">2☆</option>
                            <option value="sys_score3">3☆</option>
                            <option value="sys_score4">4☆</option>
                            <option value="sys_score5">5☆</option>
                            <option value="sys_score6">6☆</option>
                            <option value="sys_score7">7☆</option>
                            <option value="sys_score8">8☆</option>
                            <option value="sys_score9">9☆</option>
                            <option value="sys_score10">10☆</option>
                        </select>
                    </div>
                    
                    <div class="tag-input-wrapper">
                        <input v-model="newTag" @keyup.enter="btnclk_add_tag" placeholder="添加标签..."
                            class="tag-input" list="tagSuggestions" @click.stop />
                        <datalist id="tagSuggestions">
                            <option v-for="tag in tagSuggestions" :key="tag" :value="tag"></option>
                        </datalist>
                    </div>
                    
                    <button @click="btnclk_move_file" class="action-btn">
                        <span class="action-icon">📁</span>
                        <span class="action-text">移动</span>
                    </button>
                    
                    <button @click="btnclk_copy_file" class="action-btn">
                        <span class="action-icon">📋</span>
                        <span class="action-text">复制</span>
                    </button>
                    
                    <button @click="btnclk_delete_file" class="action-btn danger">
                        <span class="action-icon">🗑️</span>
                        <span class="action-text">删除</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
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

const sltLevel = ref("sys_score3");
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
};

const btnclk_set_file_level = () => {
    const req: DatType.FilesTagSetReq = {
        fileIds: [],
        tagName: ''
    };
    
    if (sltLevel.value == '') {
        Utils.addToast('请选择要设置的等级');
        return;
    }
    
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
    
    req.tagName = sltLevel.value;
    Utils.files_tag_set(req);
};

const btnclk_move_file = () => {
    appStore.bPageFileTransfer = true;
};

const btnclk_copy_file = () => {
    appStore.bPageFileTransfer = true;
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

const btnclk_add_tag = () => {
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

const btnclk_remove_tag = (tag: DatType.FileItemTag) => {
    const req: DatType.FilesTagSetReq = {
        tagName: tag.name,
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
    max-width: 90vw;
}

.operation-bar-content {
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-lg);
    box-shadow: var(--xc-shadow-lg);
    padding: var(--xc-spacing-md) var(--xc-spacing-lg);
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
    background: none;
    border: none;
    color: var(--xc-primary-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    border-radius: var(--xc-border-radius-sm);
    transition: all var(--xc-transition-fast);
}

.clear-btn:hover {
    background-color: var(--xc-background-color-hover);
}

.operation-actions {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
}

.action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: var(--xc-border-radius-md);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
    min-width: 60px;
}

.action-btn:hover {
    background-color: var(--xc-background-color-hover);
    border-color: var(--xc-border-color);
}

.action-btn.danger:hover {
    background-color: rgba(245, 34, 45, 0.1);
    border-color: var(--xc-error-color);
}

.action-icon {
    font-size: 20px;
    line-height: 1;
}

.action-text {
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color);
    white-space: nowrap;
}

.action-select-wrapper {
    display: flex;
    align-items: center;
}

.level-select {
    height: 32px;
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

.level-select:hover {
    background-color: var(--xc-input-bg-color-hover);
    border-color: var(--xc-border-color);
}

.level-select:focus {
    border-color: var(--xc-input-border-color-focus);
}

.tag-input-wrapper {
    display: flex;
    align-items: center;
}

.tag-input {
    width: 120px;
    height: 32px;
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

.tag-input:hover {
    background-color: var(--xc-input-bg-color-hover);
    border-color: var(--xc-border-color);
}

.tag-input:focus {
    border-color: var(--xc-input-border-color-focus);
}

.tag-input::placeholder {
    color: var(--xc-text-color-secondary);
}

.selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-xs);
    padding-left: var(--xc-spacing-lg);
    border-left: 1px solid var(--xc-border-color);
    max-width: 300px;
    overflow-x: auto;
}

.selected-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: var(--xc-border-radius-sm);
    font-size: var(--xc-font-size-xs);
    color: white;
    white-space: nowrap;
}

.tag-name {
    line-height: 1;
}

.tag-delete-btn {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color var(--xc-transition-fast);
}

.tag-delete-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
}
</style>
