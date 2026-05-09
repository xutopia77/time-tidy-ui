<template>
    <div class="settings-page">
        <div class="page-header">
            <h1>快捷键</h1>
            <p class="page-desc">自定义键盘快捷键</p>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Keyboard size="20" />
                <h2>全局快捷键</h2>
            </div>
            
            <div class="settings-card">
                <div class="shortcuts-list">
                    <div class="shortcut-item" v-for="shortcut in globalShortcuts" :key="shortcut.id">
                        <div class="shortcut-info">
                            <span class="shortcut-name">{{ shortcut.name }}</span>
                            <span class="shortcut-desc">{{ shortcut.description }}</span>
                        </div>
                        <div class="shortcut-keys">
                            <span 
                                v-for="(key, index) in shortcut.keys" 
                                :key="index"
                                class="key-badge"
                            >{{ key }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <FileSearch size="20" />
                <h2>文件操作</h2>
            </div>
            
            <div class="settings-card">
                <div class="shortcuts-list">
                    <div class="shortcut-item" v-for="shortcut in fileShortcuts" :key="shortcut.id">
                        <div class="shortcut-info">
                            <span class="shortcut-name">{{ shortcut.name }}</span>
                            <span class="shortcut-desc">{{ shortcut.description }}</span>
                        </div>
                        <div class="shortcut-keys">
                            <span 
                                v-for="(key, index) in shortcut.keys" 
                                :key="index"
                                class="key-badge"
                            >{{ key }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Edit3 size="20" />
                <h2>编辑操作</h2>
            </div>
            
            <div class="settings-card">
                <div class="shortcuts-list">
                    <div class="shortcut-item" v-for="shortcut in editShortcuts" :key="shortcut.id">
                        <div class="shortcut-info">
                            <span class="shortcut-name">{{ shortcut.name }}</span>
                            <span class="shortcut-desc">{{ shortcut.description }}</span>
                        </div>
                        <div class="shortcut-keys">
                            <span 
                                v-for="(key, index) in shortcut.keys" 
                                :key="index"
                                class="key-badge"
                            >{{ key }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-actions">
            <button class="btn btn-secondary">
                <Respect size="16" />
                恢复默认
            </button>
            <button class="btn btn-primary">保存设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Keyboard, FileSearch,  Respect } from '@icon-park/vue-next';
import '@/assets/common.css';

interface Shortcut {
    id: string;
    name: string;
    description: string;
    keys: string[];
}

const globalShortcuts: Shortcut[] = [
    { id: '1', name: '搜索', description: '打开全局搜索', keys: ['Ctrl', 'K'] },
    { id: '2', name: '设置', description: '打开设置面板', keys: ['Ctrl', ','] },
    { id: '3', name: '新建窗口', description: '打开新窗口', keys: ['Ctrl', 'N'] },
    { id: '4', name: '关闭窗口', description: '关闭当前窗口', keys: ['Ctrl', 'W'] },
    { id: '5', name: '退出', description: '退出应用', keys: ['Ctrl', 'Q'] },
];

const fileShortcuts: Shortcut[] = [
    { id: '6', name: '新建文件', description: '创建新文件', keys: ['Ctrl', 'N'] },
    { id: '7', name: '新建文件夹', description: '创建新文件夹', keys: ['Ctrl', 'Shift', 'N'] },
    { id: '8', name: '打开', description: '打开选中的文件或文件夹', keys: ['Enter'] },
    { id: '9', name: '重命名', description: '重命名选中的项目', keys: ['F2'] },
    { id: '10', name: '删除', description: '删除选中的项目', keys: ['Delete'] },
    { id: '11', name: '复制', description: '复制选中的项目', keys: ['Ctrl', 'C'] },
    { id: '12', name: '粘贴', description: '粘贴剪贴板内容', keys: ['Ctrl', 'V'] },
    { id: '13', name: '剪切', description: '剪切选中的项目', keys: ['Ctrl', 'X'] },
];

const editShortcuts: Shortcut[] = [
    { id: '14', name: '撤销', description: '撤销上一步操作', keys: ['Ctrl', 'Z'] },
    { id: '15', name: '重做', description: '重做上一步撤销的操作', keys: ['Ctrl', 'Y'] },
    { id: '16', name: '全选', description: '选中所有项目', keys: ['Ctrl', 'A'] },
    { id: '17', name: '查找', description: '在当前页面查找', keys: ['Ctrl', 'F'] },
    { id: '18', name: '替换', description: '查找并替换', keys: ['Ctrl', 'H'] },
];
</script>

<style scoped>
.settings-page {
    width: 100%;
}

.page-header {
    margin-bottom: var(--xc-spacing-xl);
}

.page-header h1 {
    font-size: var(--xc-font-size-xl);
    font-weight: 600;
    color: var(--xc-text-color);
    margin: 0 0 var(--xc-spacing-xs) 0;
}

.page-desc {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color-secondary);
    margin: 0;
}

.settings-section {
    margin-bottom: var(--xc-spacing-xl);
}

.section-header {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
    margin-bottom: var(--xc-spacing-md);
    color: var(--xc-text-color);
}

.section-header h2 {
    font-size: var(--xc-font-size-lg);
    font-weight: 500;
    margin: 0;
}

.settings-card {
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    padding: 0;
}

.shortcuts-list {
    padding: var(--xc-spacing-sm);
}

.shortcut-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    border-radius: var(--xc-border-radius-sm);
    transition: background-color var(--xc-transition-normal);
}

.shortcut-item:hover {
    background-color: var(--xc-background-color-hover);
}

.shortcut-info {
    display: flex;
    flex-direction: column;
}

.shortcut-name {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
    font-weight: 500;
}

.shortcut-desc {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    margin-top: 2px;
}

.shortcut-keys {
    display: flex;
    gap: var(--xc-spacing-xs);
}

.key-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 28px;
    padding: 0 var(--xc-spacing-sm);
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color-hover);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-xs);
}

.settings-actions {
    display: flex;
    gap: var(--xc-spacing-md);
    justify-content: flex-end;
    margin-top: var(--xc-spacing-xl);
}

.btn {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    font-size: var(--xc-font-size-md);
    border-radius: var(--xc-border-radius-sm);
    border: none;
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.btn-secondary {
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border: 1px solid var(--xc-border-color);
}

.btn-secondary:hover {
    background-color: var(--xc-background-color-hover);
}

.btn-primary {
    background-color: var(--xc-primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: var(--xc-primary-color-hover);
}
</style>
