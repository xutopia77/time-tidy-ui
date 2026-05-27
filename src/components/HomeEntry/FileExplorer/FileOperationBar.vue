<template>
    <Transition name="slide-up">
        <div v-if="showBar" class="operation-bar">
            <div class="operation-bar-content">
                <div class="selection-info">
                    <span class="selection-count">{{ checkedCount }} 项已选中</span>
                    <button @click="clearSelection" class="clear-btn">取消</button>
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
                        </select>
                    </div>
                    
                    <div class="tag-input-wrapper">
                        <input v-model="newTag" @keyup.enter="btnclk_add_tag" placeholder="添加标签..."
                            class="tag-input" list="tagSuggestions" @click.stop />
                        <datalist id="tagSuggestions">
                            <option v-for="tag in tagSuggestions" :key="tag" :value="tag"></option>
                        </datalist>
                    </div>
                    
                    <button @click="btnclk_delete_tag" class="action-btn">
                        <span class="action-icon">🏷️</span>
                        <span class="action-text">删除标签</span>
                    </button>
                    
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

    <!-- Delete Tag Dialog -->
    <div v-if="showDeleteTagDialog" class="dialog-overlay" @click="closeDeleteTagDialog">
        <div class="dialog-content" @click.stop>
            <h3>删除文件标签</h3>
            <p class="dialog-desc">选择要从选中文件中删除的标签：</p>
            
            <div v-if="fileTags.length === 0" class="no-tags-message">
                选中的文件没有标签
            </div>
            
            <div v-else class="tag-list">
                <div v-for="tag in fileTags" :key="tag.name" class="tag-item">
                    <label class="tag-checkbox">
                        <input type="checkbox" v-model="selectedTagsForDeletion" :value="tag.name" />
                        <span class="tag-label">
                            <span class="tag-color" :style="{ backgroundColor: tag.color || '#999' }"></span>
                            <span class="tag-name">{{ Utils.tagName2Display(tag.name) }}</span>
                        </span>
                    </label>
                </div>
            </div>
            
            <div class="dialog-actions">
                <button @click="confirmDeleteTags" class="confirm-btn" :disabled="selectedTagsForDeletion.length === 0">
                    确定删除
                </button>
                <button @click="closeDeleteTagDialog" class="cancel-btn">取消</button>
            </div>
        </div>
    </div>
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
const showDeleteTagDialog = ref(false);
const selectedTagsForDeletion = ref<string[]>([]);

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

const btnclk_delete_tag = () => {
    selectedTagsForDeletion.value = [];
    showDeleteTagDialog.value = true;
};

const closeDeleteTagDialog = () => {
    showDeleteTagDialog.value = false;
    selectedTagsForDeletion.value = [];
};

const confirmDeleteTags = () => {
    if (selectedTagsForDeletion.value.length === 0) {
        Utils.addToast('请选择要删除的标签');
        return;
    }
    
    const fileIds: number[] = [];
    if (appStore.curFiles) {
        appStore.curFiles.forEach((file) => {
            if (file.checked) {
                fileIds.push(file.id);
            }
        });
    }
    
    if (fileIds.length === 0) {
        Utils.addToast('请选择要操作的文件');
        return;
    }
    
    // Delete each selected tag
    for (const tagName of selectedTagsForDeletion.value) {
        const req: DatType.FilesTagSetReq = {
            tagName: tagName,
            fileIds: fileIds
        };
        Utils.files_tag_delete(req);
    }
    
    Utils.message_notify({ 
        content: `已删除 ${selectedTagsForDeletion.value.length} 个标签`, 
        type: 'success' 
    });
    
    closeDeleteTagDialog();
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
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-lg);
    box-shadow: var(--xc-shadow-lg);
    padding: var(--xc-spacing-sm) var(--xc-spacing-sm);
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
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
}

.tag-input-wrapper {
    display: flex;
    align-items: center;
}

.tag-input {
    height: 32px;
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    min-width: 120px;
}

.tag-input:focus {
    outline: none;
    border-color: var(--xc-primary-color);
}

/* Dialog Styles */
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.dialog-content {
    background-color: var(--xc-background-color);
    border-radius: var(--xc-border-radius-lg);
    padding: var(--xc-spacing-xl);
    min-width: 400px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: var(--xc-shadow-lg);
}

.dialog-content h3 {
    margin: 0 0 var(--xc-spacing-md) 0;
    font-size: var(--xc-font-size-lg);
    color: var(--xc-text-color);
}

.dialog-desc {
    margin: 0 0 var(--xc-spacing-md) 0;
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color-secondary);
}

.no-tags-message {
    padding: var(--xc-spacing-xl);
    text-align: center;
    color: var(--xc-text-color-secondary);
    font-size: var(--xc-font-size-md);
}

.tag-list {
    display: flex;
    flex-direction: column;
    gap: var(--xc-spacing-sm);
    margin-bottom: var(--xc-spacing-lg);
    max-height: 300px;
    overflow-y: auto;
}

.tag-item {
    padding: var(--xc-spacing-sm);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    transition: all var(--xc-transition-fast);
}

.tag-item:hover {
    background-color: var(--xc-background-color-hover);
}

.tag-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.tag-checkbox input[type="checkbox"] {
    margin-right: var(--xc-spacing-sm);
    cursor: pointer;
}

.tag-label {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.tag-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
}

.tag-name {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--xc-spacing-sm);
}

.confirm-btn,
.cancel-btn {
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    border-radius: var(--xc-border-radius-sm);
    font-size: var(--xc-font-size-md);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
}

.confirm-btn {
    background-color: var(--xc-primary-color);
    color: white;
    border: none;
}

.confirm-btn:hover:not(:disabled) {
    opacity: 0.9;
}

.confirm-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.cancel-btn {
    background-color: transparent;
    color: var(--xc-text-color);
    border: 1px solid var(--xc-border-color);
}

.cancel-btn:hover {
    background-color: var(--xc-background-color-hover);
}

/* Transition */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
}
</style>
