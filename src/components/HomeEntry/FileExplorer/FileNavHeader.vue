<template>
    <div class="file-explorer">
        <!-- 路径显示区域 -->
        <div class="path-display">
            <span v-for="(part, index) in pathParts" :key="index" @click="navigateToPath(part.path)" class="path-part">
                {{ part.name }}
                <HardDisk v-bind="iconProps" v-if="part.name == ''" size="18" />
                <span v-if="index < pathParts.length - 1">/</span>
            </span>
            <!-- 添加编辑按钮 -->
            <button @click="openCreateFolderDialog" class="create-folder-btn" title="创建新文件夹">
                +
            </button>
        </div>

        <!-- 创建文件夹弹窗 -->
        <div v-if="showCreateFolderDialog" class="dialog-overlay" @click="closeCreateFolderDialog">
            <div class="dialog-content" @click.stop>
                <h3>创建新文件夹</h3>
                <p class="current-path">当前位置: {{ currentPath }}</p>
                <input v-model="newFolderName" @keyup.enter="createNewFolder" placeholder="输入文件夹名称"
                    class="folder-name-input" ref="folderInputRef" maxlength="100" />
                <div class="dialog-actions">
                    <button @click="createNewFolder" class="confirm-btn" :disabled="!newFolderName.trim()">确定</button>
                    <button @click="closeCreateFolderDialog" class="cancel-btn">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onUnmounted } from 'vue';
import type { ComputedRef } from 'vue';
import '@/assets/common.css'
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import { HardDisk } from '@icon-park/vue-next'

const iconProps = computed(() => (appStore.iconProps))

class PathPart {
    name: string = '';
    path: string = '';
}

const currentPath = computed(() => {
    return appStore.curPath
});

// 新增状态
const showCreateFolderDialog = ref(false);
const newFolderName = ref('');
const folderInputRef = ref<HTMLInputElement | null>(null);

// 解析路径为可点击的部分
const pathParts: ComputedRef<PathPart[]> = computed(() => {
    // 处理空路径和首尾 /，过滤空元素
    const parts = currentPath.value.split('/').filter(part => part !== '');
    const re = parts.map((part, index) => {
        const pathElements = parts.slice(0, index + 1);
        const path = '/' + pathElements.join('/'); // 确保路径以 / 开头
        const pathPart = new PathPart();
        pathPart.name = part;
        pathPart.path = path;
        return pathPart;
    });
    // 在 re 的前面加一个 root
    const rootPart = new PathPart();
    rootPart.name = '';
    rootPart.path = '/';
    re.unshift(rootPart);
    return re;
});

// 导航到指定路径
const navigateToPath = (path: string) => {
    appStore.searchCon.pathType = 'curPath';
    Utils.dir_slt_update(path);
};

// 打开创建文件夹对话框
const openCreateFolderDialog = async () => {
    showCreateFolderDialog.value = true;
    newFolderName.value = '';

    // 等待DOM更新后再聚焦输入框
    await nextTick();
    if (folderInputRef.value) {
        folderInputRef.value.focus();
    }
};

// 关闭创建文件夹对话框
const closeCreateFolderDialog = () => {
    showCreateFolderDialog.value = false;
    newFolderName.value = '';
};

// 创建新文件夹
const createNewFolder = async () => {
    if (!newFolderName.value.trim()) {
        Utils.message_notify({ content: '文件夹名称不能为空', type: 'error' });
        return;
    }

    if (!appStore.curSltDirTreeItem) {
        Utils.message_notify({ content: '请先选择一个目录', type: 'error' });
        return;
    }

    try {
        const req = new DatType.DirCreateReq();
        req.parentDirId = appStore.curSltDirTreeItem.dirInfo.dir.id;
        req.path = appStore.curSltDirTreeItem.dirInfo.dir.path + '/' + newFolderName.value.trim();
        req.type = 1;
        req.description = "";
        console.log('createNewFolder req:', req)
        await Utils.dirCreate(req);
    } catch (error) {
        console.error('创建文件夹失败:', error);
        Utils.message_notify({ content: '创建文件夹失败', type: 'error' });
    }
};

// 处理ESC键关闭对话框
const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && showCreateFolderDialog.value) {
        closeCreateFolderDialog();
    }
};

// 监听键盘事件
document.addEventListener('keydown', handleEscKey);

// 组件卸载时移除事件监听器
onUnmounted(() => {
    document.removeEventListener('keydown', handleEscKey);
});
</script>

<style scoped>
.file-explorer {
    padding: 0px;
}

/* 路径显示样式 */
.path-display {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 16px;
    /* background-color: var(--xc-background-color-hover); */
    color: var(--xc-text-color);
    border-bottom: var(--xc-border);
    padding-bottom: 5px;
}

.path-display:hover {
    border: var(--xc-border-hover);
}

.path-part {
    cursor: pointer;
    color: #030c14;
    text-decoration: underline;
    color: var(--xc-text-color);
}

.path-part:hover {
    color: #0056b3;
}

.create-folder-btn {
    margin-left: 10px;
    background-color: var(--xc-button-bg-color);
    color: var(--xc-button-text-color);
    border: var(--xc-border);
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.create-folder-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

/* 弹窗样式 */
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
    z-index: 1000;
}

.dialog-content {
    background-color: var(--xc-background-color);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 400px;
}

.dialog-content h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: var(--xc-text-color);
}

.current-path {
    margin: 10px 0;
    padding: 8px;
    background-color: var(--xc-background-color-hover);
    border-radius: 4px;
    font-size: 14px;
    color: var(--xc-text-color-secondary);
    word-break: break-all;
}

.folder-name-input {
    width: 100%;
    padding: 8px 12px;
    border: var(--xc-border);
    border-radius: 4px;
    background-color: var(--xc-input-bg-color);
    color: var(--xc-text-color);
    margin-bottom: 15px;
    box-sizing: border-box;
    font-size: 14px;
}

.folder-name-input:focus {
    outline: none;
    border-color: var(--xc-primary-color);
}

.dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.confirm-btn {
    background-color: var(--xc-primary-color);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.confirm-btn:hover:not(:disabled) {
    background-color: var(--xc-primary-color-hover);
}

.confirm-btn:disabled {
    background-color: var(--xc-button-bg-color-disabled);
    cursor: not-allowed;
}

.cancel-btn {
    background-color: var(--xc-button-bg-color);
    color: var(--xc-text-color);
    border: var(--xc-border);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}
</style>