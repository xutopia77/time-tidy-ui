<template>
    <div class="similarity-manager">
        <div class="manager-header">
            <div class="header-title">
                <Files theme="outline" size="24" fill="currentColor" />
                <h2>相似文件管理</h2>
            </div>
            <div class="header-actions">
                <button @click="startDetection" :disabled="isDetecting" class="action-btn primary">
                    <Refresh theme="outline" size="16" :strokeWidth="3" />
                    <span>{{ isDetecting ? '检测中...' : '开始检测' }}</span>
                </button>
                <button @click="showSettings = true" class="action-btn">
                    <Setting theme="outline" size="16" :strokeWidth="3" />
                    <span>设置</span>
                </button>
            </div>
        </div>

        <div class="manager-status">
            <div class="status-item">
                <span class="status-label">状态:</span>
                <span class="status-value" :class="statusClass">{{ statusText }}</span>
            </div>
            <div class="status-item">
                <span class="status-label">发现:</span>
                <span class="status-value">{{ similarityGroups.length }}组相似文件</span>
            </div>
            <div class="status-item">
                <span class="status-label">总计:</span>
                <span class="status-value">{{ totalFiles }}个文件</span>
            </div>
        </div>

        <div v-if="isDetecting" class="progress-section">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">正在检测相似文件... {{ progress }}%</span>
        </div>

        <div class="similarity-content xc-scrollbar">
            <div v-if="similarityGroups.length === 0 && !isDetecting" class="empty-state">
                <FileDoc theme="outline" size="64" fill="currentColor" class="empty-icon" />
                <p class="empty-title">暂无相似文件</p>
                <p class="empty-desc">点击"开始检测"按钮扫描相似文件</p>
            </div>

            <div v-for="(group, index) in similarityGroups" :key="index" class="similarity-group">
                <div class="group-header">
                    <div class="group-title">
                        <input type="checkbox" v-model="group.selected" @change="toggleGroupSelection(group)" />
                        <span class="group-name">相似文件组 #{{ index + 1 }}</span>
                        <span class="file-count">({{ group.files.length }}个文件)</span>
                    </div>
                    <div class="group-actions">
                        <button @click="selectAllInGroup(group)" class="group-action-btn">全选</button>
                        <button @click="keepBestInGroup(group)" class="group-action-btn">保留最佳</button>
                        <button @click="deleteGroup(group)" class="group-action-btn danger">删除选中</button>
                    </div>
                </div>

                <div class="group-files">
                    <div v-for="file in group.files" :key="file.id" class="file-card"
                        :class="{ 'selected': file.selected }">
                        <input type="checkbox" v-model="file.selected" class="file-checkbox" />
                        <div class="file-thumbnail-container">
                            <img :src="Utils.get_thumbnail_url(file.id)" :alt="file.name" class="file-thumbnail" />
                            <div class="similarity-badge high">
                                100%
                            </div>
                        </div>
                        <div class="file-info">
                            <div class="file-name" :title="file.name">{{ file.name }}</div>
                            <div class="file-meta">
                                <span>{{ Utils.gen_size_str(file.size) }}</span>
                                <span>{{ file.create_time }}</span>
                            </div>
                            <div class="file-path" :title="file.path">{{ file.path }}</div>
                        </div>
                        <div class="file-actions">
                            <button @click="previewFile(file)" class="file-action-btn" title="预览">
                                <ViewList theme="outline" size="16" />
                            </button>
                            <button @click="locateFile(file)" class="file-action-btn" title="定位">
                                <Local theme="outline" size="16" />
                            </button>
                            <button @click="deleteFile(file)" class="file-action-btn danger" title="删除">
                                <Delete theme="outline" size="16" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="totalGroups > 0" class="pagination-section">
            <div class="pagination-info">
                共 {{ totalGroups }} 组，{{ totalFiles }} 个文件
            </div>
            <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
                    上一页
                </button>
                <span class="pagination-current">第 {{ currentPage }} 页</span>
                <button @click="nextPage" :disabled="currentPage * pageSize >= totalGroups" class="pagination-btn">
                    下一页
                </button>
            </div>
        </div>

        <div v-if="showSettings" class="settings-overlay" @click="showSettings = false">
            <div class="settings-panel" @click.stop>
                <div class="settings-header">
                    <h3>检测设置</h3>
                    <button @click="showSettings = false" class="close-btn">×</button>
                </div>
                <div class="settings-body">
                    <div class="setting-item">
                        <label>启用AI检测</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="settings.useAI" />
                                <span>使用AI相似度检测（基于图像内容）</span>
                            </label>
                        </div>
                        <p class="setting-hint" v-if="settings.useAI">
                            AI检测基于图像内容相似度，比Hash检测更智能，但需要AI引擎支持
                        </p>
                    </div>

                    <div class="setting-item" v-if="settings.useAI">
                        <label>AI相似度阈值</label>
                        <div class="setting-control">
                            <input type="range" v-model="settings.minSimilarity" min="0" max="100" step="5" />
                            <span class="setting-value">{{ (settings.minSimilarity / 100).toFixed(2) }}</span>
                        </div>
                        <p class="setting-hint">
                            相似度阈值越高，检测越严格（推荐0.85-0.95）
                        </p>
                    </div>

                    <div class="setting-item">
                        <label>检测范围</label>
                        <select v-model="settings.scope" class="setting-select">
                            <option value="all">全部文件</option>
                            <option value="current">当前目录</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <label>文件类型</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="settings.types.image" />
                                <span>图片</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="settings.types.video" />
                                <span>视频</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="settings-footer">
                    <button @click="showSettings = false" class="btn btn-secondary">取消</button>
                    <button @click="applySettings" class="btn btn-primary">应用</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/AppStore';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import '@/assets/common.css';
import { FileDoc, Refresh, Setting, ViewList, Local, Delete } from '@icon-park/vue-next';

const appStore = useAppStore();

interface SimilarityFile {
    id: number;
    name: string;
    path: string;
    size: number;
    create_time: string;
    type: string;
    extension: string;
    tags: DatType.FileItemTag[];
    selected: boolean;
}

interface SimilarityGroup {
    groupId: number;
    hash: string;
    fileCount: number;
    totalSize: number;
    createdAt: string;
    selected: boolean;
    files: SimilarityFile[];
}

interface SimilarityGroupApiResponse {
    groupId: number;
    hash: string;
    fileCount: number;
    totalSize: number;
    createdAt: string;
    files?: {
        id: number;
        name: string;
        path: string;
        size: number;
        create_time: string;
        type: string;
        extension: string;
        tags?: DatType.FileItemTag[];
    }[];
}

interface SimilarityGetResponse {
    groups: SimilarityGroupApiResponse[];
    total: number;
    totalFiles: number;
    page: number;
}

const showSettings = ref(false);
const similarityGroups = ref<SimilarityGroup[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalGroups = ref(0);
const totalFiles = ref(0);

const progressSimilarity = computed(() => appStore.progressSimilarity);
const isDetecting = computed(() => progressSimilarity.value.isRunning);
const progress = computed(() => progressSimilarity.value.percent);

const settings = ref({
    useAI: false,
    minSimilarity: 90,
    scope: 'all',
    types: {
        image: true,
        video: true
    }
});

const statusText = computed(() => {
    if (isDetecting.value) return '检测中';
    if (similarityGroups.value.length > 0) return '已完成';
    return '未检测';
});

const statusClass = computed(() => {
    if (isDetecting.value) return 'detecting';
    if (similarityGroups.value.length > 0) return 'completed';
    return 'idle';
});

const startDetection = async () => {
    similarityGroups.value = [];

    const useAI = settings.value.useAI;
    const minSimilarity = settings.value.minSimilarity / 100;

    const response = await Utils.file_similarity_detect(useAI, minSimilarity);
    if (response.code !== 0) {
        Utils.addToast(response.status || '检测启动失败');
    }
};

watch(() => progressSimilarity.value.isRunning, async (isRunning, wasRunning) => {
    if (wasRunning && !isRunning && progressSimilarity.value.status === 'completed') {
        await loadSimilarityGroups();
    }
});

const loadSimilarityGroups = async (page = 1) => {
    try {
        const response = await Utils.file_similarity_get(page, pageSize.value);
        
        if (response.code === 0 && response.data) {
            const data = response.data as SimilarityGetResponse;
            
            if (!data || !data.groups) {
                similarityGroups.value = [];
                totalGroups.value = 0;
                totalFiles.value = 0;
                currentPage.value = 1;
                return;
            }
            
            similarityGroups.value = data.groups.map((group: SimilarityGroupApiResponse) => ({
                groupId: group.groupId,
                hash: group.hash,
                fileCount: group.fileCount,
                totalSize: group.totalSize,
                createdAt: group.createdAt,
                selected: false,
                files: (group.files || []).map((file) => ({
                    id: file.id,
                    name: file.name,
                    path: file.path,
                    size: file.size,
                    create_time: file.create_time,
                    type: file.type,
                    extension: file.extension,
                    tags: file.tags || [],
                    selected: false
                }))
            }));
            
            totalGroups.value = data.total || 0;
            totalFiles.value = data.totalFiles || 0;
            currentPage.value = data.page || 1;
        }
    } catch (error) {
        console.error('加载失败:', error);
        Utils.addToast('加载相似文件失败');
    }
};

const toggleGroupSelection = (group: SimilarityGroup) => {
    group.files.forEach(file => {
        file.selected = group.selected;
    });
};

const selectAllInGroup = (group: SimilarityGroup) => {
    group.files.forEach(file => {
        file.selected = true;
    });
};

const keepBestInGroup = (group: SimilarityGroup) => {
    const sortedFiles = [...group.files].sort((a, b) => {
        if (a.size !== b.size) return b.size - a.size;
        return new Date(b.create_time).getTime() - new Date(a.create_time).getTime();
    });

    group.files.forEach(file => {
        file.selected = file.id !== sortedFiles[0].id;
    });
};

const deleteGroup = async (group: SimilarityGroup) => {
    const selectedFiles = group.files.filter(f => f.selected);
    if (selectedFiles.length === 0) {
        Utils.addToast('请选择要删除的文件');
        return;
    }

    if (!confirm(`确定要删除选中的 ${selectedFiles.length} 个文件吗？`)) {
        return;
    }

    const req = new DatType.FileDeleteReq();
    req.fileIds = selectedFiles.map(f => f.id);
    req.bRemoveToDtrash = true;

    const response = await Utils.files_delete(req);
    
    if (response.code === 0) {
        group.files = group.files.filter(f => !f.selected);
        if (group.files.length === 0) {
            const index = similarityGroups.value.indexOf(group);
            if (index > -1) {
                similarityGroups.value.splice(index, 1);
                totalGroups.value--;
            }
        }
        totalFiles.value -= selectedFiles.length;
    }
};

const deleteFile = async (file: SimilarityFile) => {
    if (!confirm(`确定要删除文件 "${file.name}" 吗？`)) {
        return;
    }

    const req = new DatType.FileDeleteReq();
    req.fileIds = [file.id];
    req.bRemoveToDtrash = true;

    const response = await Utils.files_delete(req);
    
    if (response.code === 0) {
        similarityGroups.value.forEach(group => {
            const index = group.files.findIndex(f => f.id === file.id);
            if (index > -1) {
                group.files.splice(index, 1);
                group.fileCount--;
            }
            if (group.files.length === 0) {
                const groupIndex = similarityGroups.value.indexOf(group);
                if (groupIndex > -1) {
                    similarityGroups.value.splice(groupIndex, 1);
                    totalGroups.value--;
                }
            }
        });
        totalFiles.value--;
    }
};

const previewFile = (_file: SimilarityFile) => {
    Utils.addToast('预览功能开发中');
};

const locateFile = (_file: SimilarityFile) => {
    Utils.addToast('定位功能开发中');
};

const applySettings = () => {
    showSettings.value = false;
    Utils.addToast('设置已保存');
};

const prevPage = () => {
    if (currentPage.value > 1) {
        loadSimilarityGroups(currentPage.value - 1);
    }
};

const nextPage = () => {
    if (currentPage.value * pageSize.value < totalGroups.value) {
        loadSimilarityGroups(currentPage.value + 1);
    }
};

onMounted(() => {
    loadSimilarityGroups();
});
</script>

<style scoped>
.similarity-manager {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--xc-background-color);
}

.manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-lg) var(--xc-spacing-xl);
    border-bottom: var(--xc-border);
    background-color: var(--xc-background-color);
}

.header-title {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.header-title h2 {
    margin: 0;
    font-size: var(--xc-font-size-xl);
    font-weight: 600;
    color: var(--xc-text-color);
}

.header-actions {
    display: flex;
    gap: var(--xc-spacing-sm);
}

.action-btn {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    padding: var(--xc-spacing-sm) var(--xc-spacing-md);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.action-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.action-btn.primary {
    background-color: var(--xc-primary-color);
    border-color: var(--xc-primary-color);
    color: white;
}

.action-btn.primary:hover {
    background-color: var(--xc-primary-color-hover);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.manager-status {
    display: flex;
    gap: var(--xc-spacing-lg);
    padding: var(--xc-spacing-md) var(--xc-spacing-xl);
    border-bottom: var(--xc-border);
    background-color: var(--xc-background-color);
}

.status-item {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
}

.status-label {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.status-value {
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    color: var(--xc-text-color);
}

.status-value.detecting {
    color: var(--xc-warning-color);
}

.status-value.completed {
    color: var(--xc-success-color);
}

.status-value.idle {
    color: var(--xc-text-color-secondary);
}

.progress-section {
    padding: var(--xc-spacing-md) var(--xc-spacing-xl);
    background-color: var(--xc-background-color);
}

.progress-bar {
    height: 4px;
    background-color: var(--xc-background-color-hover);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: var(--xc-spacing-xs);
}

.progress-fill {
    height: 100%;
    background-color: var(--xc-primary-color);
    transition: width var(--xc-transition-normal);
}

.progress-text {
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
}

.similarity-content {
    flex: 1;
    padding: var(--xc-spacing-lg);
    overflow-y: auto;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--xc-text-color-secondary);
}

.empty-icon {
    opacity: 0.3;
    margin-bottom: var(--xc-spacing-md);
}

.empty-title {
    font-size: var(--xc-font-size-lg);
    font-weight: 500;
    margin: 0 0 var(--xc-spacing-xs) 0;
}

.empty-desc {
    font-size: var(--xc-font-size-sm);
    margin: 0;
    opacity: 0.7;
}

.similarity-group {
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-lg);
    margin-bottom: var(--xc-spacing-md);
    overflow: hidden;
}

.group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-md);
    border-bottom: var(--xc-border);
    background-color: var(--xc-background-color-hover);
}

.group-title {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.group-name {
    font-size: var(--xc-font-size-md);
    font-weight: 600;
    color: var(--xc-text-color);
}

.file-count {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.group-actions {
    display: flex;
    gap: var(--xc-spacing-xs);
}

.group-action-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-sm);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-xs);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
}

.group-action-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.group-action-btn.danger {
    color: var(--xc-error-color);
    border-color: var(--xc-error-color);
}

.group-action-btn.danger:hover {
    background-color: rgba(245, 34, 45, 0.1);
}

.group-files {
    display: flex;
    flex-wrap: wrap;
    gap: var(--xc-spacing-sm);
    padding: var(--xc-spacing-md);
}

.file-card {
    width: calc(25% - var(--xc-spacing-sm));
    min-width: 200px;
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    padding: var(--xc-spacing-sm);
    transition: all var(--xc-transition-fast);
    position: relative;
}

.file-card:hover {
    border-color: var(--xc-border-hover);
    box-shadow: var(--xc-shadow-sm);
}

.file-card.selected {
    border-color: var(--xc-primary-color);
    background-color: rgba(74, 111, 165, 0.05);
}

.file-checkbox {
    position: absolute;
    top: var(--xc-spacing-xs);
    left: var(--xc-spacing-xs);
    z-index: 1;
}

.file-thumbnail-container {
    position: relative;
    width: 100%;
    padding-top: 100%;
    margin-bottom: var(--xc-spacing-xs);
    background-color: var(--xc-background-color-hover);
    border-radius: var(--xc-border-radius-sm);
    overflow: hidden;
}

.file-thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.similarity-badge {
    position: absolute;
    top: var(--xc-spacing-xs);
    right: var(--xc-spacing-xs);
    padding: 2px 6px;
    border-radius: var(--xc-border-radius-sm);
    font-size: var(--xc-font-size-xs);
    font-weight: 600;
    color: white;
}

.similarity-badge.high {
    background-color: var(--xc-success-color);
}

.similarity-badge.medium {
    background-color: var(--xc-warning-color);
}

.similarity-badge.low {
    background-color: var(--xc-error-color);
}

.file-info {
    margin-bottom: var(--xc-spacing-xs);
}

.file-name {
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    color: var(--xc-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 2px;
}

.file-meta {
    display: flex;
    justify-content: space-between;
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
    margin-bottom: 2px;
}

.file-path {
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--xc-spacing-xs);
}

.file-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-sm);
    color: var(--xc-text-color);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
}

.file-action-btn:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.file-action-btn.danger {
    color: var(--xc-error-color);
}

.file-action-btn.danger:hover {
    background-color: rgba(245, 34, 45, 0.1);
    border-color: var(--xc-error-color);
}

.settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.settings-panel {
    background-color: var(--xc-background-color);
    border-radius: var(--xc-border-radius-lg);
    box-shadow: var(--xc-shadow-lg);
    width: 90%;
    max-width: 400px;
}

.settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-lg);
    border-bottom: var(--xc-border);
}

.settings-header h3 {
    margin: 0;
    font-size: var(--xc-font-size-lg);
    font-weight: 600;
    color: var(--xc-text-color);
}

.close-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    background: none;
    border: none;
    color: var(--xc-text-color-secondary);
    font-size: 24px;
    cursor: pointer;
    border-radius: var(--xc-border-radius-sm);
}

.close-btn:hover {
    background-color: var(--xc-background-color-hover);
}

.settings-body {
    padding: var(--xc-spacing-lg);
}

.setting-item {
    margin-bottom: var(--xc-spacing-lg);
}

.setting-item:last-child {
    margin-bottom: 0;
}

.setting-item label {
    display: block;
    margin-bottom: var(--xc-spacing-sm);
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    color: var(--xc-text-color);
}

.setting-hint {
    margin-top: var(--xc-spacing-xs);
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
    opacity: 0.8;
    line-height: 1.4;
}

.setting-control {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.setting-control input[type="range"] {
    flex: 1;
}

.setting-value {
    min-width: 40px;
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color);
}

.setting-select {
    width: 100%;
    padding: var(--xc-spacing-sm);
    background-color: var(--xc-input-bg-color);
    border: 1px solid var(--xc-input-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
}

.checkbox-group {
    display: flex;
    gap: var(--xc-spacing-md);
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-xs);
    cursor: pointer;
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color);
}

.settings-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--xc-spacing-sm);
    padding: var(--xc-spacing-lg);
    border-top: var(--xc-border);
}

.btn {
    padding: var(--xc-spacing-sm) var(--xc-spacing-lg);
    border: none;
    border-radius: var(--xc-border-radius-md);
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--xc-transition-normal);
}

.btn-secondary {
    background-color: var(--xc-button-bg-color);
    color: var(--xc-text-color);
    border: 1px solid var(--xc-border-color);
}

.btn-secondary:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.btn-primary {
    background-color: var(--xc-primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: var(--xc-primary-color-hover);
}

.pagination-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-lg);
    border-top: var(--xc-border);
    background-color: var(--xc-background-color);
}

.pagination-info {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-md);
}

.pagination-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-fast);
}

.pagination-btn:hover:not(:disabled) {
    background-color: var(--xc-button-bg-color-hover);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-current {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color);
    font-weight: 500;
}
</style>
