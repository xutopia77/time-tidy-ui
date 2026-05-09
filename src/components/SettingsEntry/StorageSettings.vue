<template>
    <div class="settings-page">
        <div class="page-header">
            <h1>存储</h1>
            <p class="page-desc">管理存储空间和文件设置</p>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <HardDisk size="20" />
                <h2>存储空间</h2>
            </div>
            
            <div class="settings-card storage-info">
                <div class="storage-usage">
                    <div class="usage-bar">
                        <div class="usage-fill" :style="{ width: usagePercent + '%' }"></div>
                    </div>
                    <div class="usage-text">
                        <span>{{ formatSize(usedStorage) }} / {{ formatSize(totalStorage) }}</span>
                        <span class="usage-percent">{{ usagePercent }}%</span>
                    </div>
                </div>
                
                <div class="storage-details">
                    <div class="storage-item">
                        <div class="storage-icon documents"></div>
                        <div class="storage-info-text">
                            <span class="storage-name">文档</span>
                            <span class="storage-size">{{ formatSize(documentStorage) }}</span>
                        </div>
                    </div>
                    <div class="storage-item">
                        <div class="storage-icon images"></div>
                        <div class="storage-info-text">
                            <span class="storage-name">图片</span>
                            <span class="storage-size">{{ formatSize(imageStorage) }}</span>
                        </div>
                    </div>
                    <div class="storage-item">
                        <div class="storage-icon videos"></div>
                        <div class="storage-info-text">
                            <span class="storage-name">视频</span>
                            <span class="storage-size">{{ formatSize(videoStorage) }}</span>
                        </div>
                    </div>
                    <div class="storage-item">
                        <div class="storage-icon others"></div>
                        <div class="storage-info-text">
                            <span class="storage-name">其他</span>
                            <span class="storage-size">{{ formatSize(otherStorage) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Cloud size="20" />
                <h2>同步设置</h2>
            </div>
            
            <div class="settings-card">
                <div class="form-item toggle-item">
                    <div class="toggle-label">
                        <span>自动同步</span>
                        <span class="toggle-desc">自动同步文件到云端</span>
                    </div>
                    <div class="toggle-switch" :class="{ 'active': form.autoSync }" @click="form.autoSync = !form.autoSync">
                        <div class="toggle-thumb"></div>
                    </div>
                </div>

                <div class="form-item">
                    <label class="form-label">同步间隔</label>
                    <div class="form-control">
                        <select class="select-field" v-model="form.syncInterval">
                            <option value="immediate">立即同步</option>
                            <option value="5min">每5分钟</option>
                            <option value="15min">每15分钟</option>
                            <option value="1hour">每小时</option>
                            <option value="1day">每天</option>
                        </select>
                    </div>
                </div>

                <div class="form-item">
                    <label class="form-label">同步目录</label>
                    <div class="form-control path-input">
                        <input 
                            type="text" 
                            v-model="form.syncPath" 
                            class="input-field"
                            placeholder="选择同步目录"
                        />
                        <button class="browse-btn">
                            <FolderOpen size="16" />
                            浏览
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Recycle size="20" />
                <h2>回收站</h2>
            </div>
            
            <div class="settings-card">
                <div class="form-item">
                    <label class="form-label">自动清空</label>
                    <div class="form-control">
                        <select class="select-field" v-model="form.recycleAutoDelete">
                            <option value="never">永不自动清空</option>
                            <option value="7days">7天后</option>
                            <option value="14days">14天后</option>
                            <option value="30days">30天后</option>
                        </select>
                    </div>
                </div>

                <div class="form-item">
                    <div class="action-buttons">
                        <button class="btn btn-secondary">
                            <RefreshCw size="16" />
                            清空回收站
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-actions">
            <button class="btn btn-secondary">取消</button>
            <button class="btn btn-primary">保存设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { HardDisk, FolderOpen } from '@icon-park/vue-next';
import '@/assets/common.css';

const totalStorage = 1024 * 1024 * 1024 * 10;
const documentStorage = 1024 * 1024 * 500;
const imageStorage = 1024 * 1024 * 1500;
const videoStorage = 1024 * 1024 * 3000;
const otherStorage = 1024 * 1024 * 500;

const usedStorage = computed(() => documentStorage + imageStorage + videoStorage + otherStorage);
const usagePercent = computed(() => Math.round((usedStorage.value / totalStorage) * 100));

const form = reactive({
    autoSync: true,
    syncInterval: '15min',
    syncPath: '/Users/username/Documents',
    recycleAutoDelete: '30days'
});

function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}
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
    padding: var(--xc-spacing-lg);
}

.form-item {
    margin-bottom: var(--xc-spacing-lg);
}

.form-item:last-child {
    margin-bottom: 0;
}

.form-label {
    display: block;
    font-size: var(--xc-font-size-md);
    font-weight: 500;
    color: var(--xc-text-color);
    margin-bottom: var(--xc-spacing-sm);
}

.form-control {
    width: 100%;
}

.input-field,
.select-field {
    width: 100%;
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    font-size: var(--xc-font-size-md);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    box-sizing: border-box;
    transition: border-color var(--xc-transition-normal);
}

.input-field:focus,
.select-field:focus {
    outline: none;
    border-color: var(--xc-primary-color);
}

.storage-usage {
    margin-bottom: var(--xc-spacing-lg);
}

.usage-bar {
    height: 8px;
    background-color: var(--xc-border-color);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: var(--xc-spacing-sm);
}

.usage-fill {
    height: 100%;
    background-color: var(--xc-primary-color);
    border-radius: 4px;
    transition: width var(--xc-transition-normal);
}

.usage-text {
    display: flex;
    justify-content: space-between;
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.usage-percent {
    color: var(--xc-primary-color);
    font-weight: 500;
}

.storage-details {
    border-top: 1px solid var(--xc-border-color);
    padding-top: var(--xc-spacing-lg);
}

.storage-item {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-md);
    padding: var(--xc-spacing-sm) 0;
}

.storage-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
}

.storage-icon.documents {
    background-color: #4a90d9;
}

.storage-icon.images {
    background-color: #50c878;
}

.storage-icon.videos {
    background-color: #ff6b6b;
}

.storage-icon.others {
    background-color: #999999;
}

.storage-info-text {
    flex: 1;
    display: flex;
    justify-content: space-between;
}

.storage-name {
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
}

.storage-size {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.toggle-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.toggle-label {
    display: flex;
    flex-direction: column;
}

.toggle-label span:first-child {
    font-size: var(--xc-font-size-md);
    font-weight: 500;
    color: var(--xc-text-color);
}

.toggle-desc {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    margin-top: 2px;
}

.toggle-switch {
    width: 44px;
    height: 24px;
    background-color: var(--xc-border-color);
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background-color var(--xc-transition-normal);
}

.toggle-switch.active {
    background-color: var(--xc-primary-color);
}

.toggle-thumb {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform var(--xc-transition-normal);
}

.toggle-switch.active .toggle-thumb {
    transform: translateX(20px);
}

.path-input {
    display: flex;
    gap: var(--xc-spacing-sm);
}

.path-input .input-field {
    flex: 1;
}

.browse-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    font-size: var(--xc-font-size-md);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.browse-btn:hover {
    background-color: var(--xc-background-color-hover);
}

.action-buttons {
    display: flex;
    gap: var(--xc-spacing-md);
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
