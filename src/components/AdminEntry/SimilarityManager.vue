<template>
    <div class="similarity-manager">
        <div class="manager-header">
            <div class="header-title">
                <FileDoc theme="outline" size="24" fill="currentColor" />
                <h2>{{ t('similarity.manage') }}</h2>
            </div>
            <div class="header-actions">
                <button @click="startDetection" :disabled="isDetecting" class="action-btn primary">
                    <Refresh theme="outline" size="16" :strokeWidth="3" />
                    <span>{{ isDetecting ? t('similarity.detecting') : t('similarity.startDetection') }}</span>
                </button>
                <button @click="showSettings = true" class="action-btn">
                    <Setting theme="outline" size="16" :strokeWidth="3" />
                    <span>{{ t('similarity.settings') }}</span>
                </button>
            </div>
        </div>

        <div class="manager-status">
            <div class="status-item">
                <span class="status-label">{{ t('similarity.status') }}:</span>
                <span class="status-value" :class="statusClass">{{ statusText }}</span>
            </div>
            <div class="status-item">
                <span class="status-label">{{ t('similarity.found') }}:</span>
                <span class="status-value">{{ similarityGroups.length }}{{ t('similarity.similarityGroups') }}</span>
            </div>
            <div class="status-item">
                <span class="status-label">{{ t('similarity.total') }}:</span>
                <span class="status-value">{{ totalFiles }}{{ t('similarity.files') }}</span>
            </div>
        </div>

        <div v-if="isDetecting" class="progress-section">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ t('similarity.detectingProgress') }} {{ progress }}%</span>
        </div>

        <div class="similarity-content xc-scrollbar">
            <div v-if="similarityGroups.length === 0 && !isDetecting" class="empty-state">
                <FileDoc theme="outline" size="64" fill="currentColor" class="empty-icon" />
                <p class="empty-title">{{ t('similarity.noSimilarFiles') }}</p>
                <p class="empty-desc">{{ t('similarity.clickStartDetection') }}</p>
            </div>

            <SimilarityGroupCard v-for="(group, index) in similarityGroups" :key="group.groupId" :group="group"
                :index="index" @delete-selected="deleteGroup(group)" @delete-file="deleteFile" @locate="locateFile"
                @toggle-group="toggleGroupSelection(group)" @select-all="selectAllInGroup(group)"
                @keep-best="keepBestInGroup(group)" @update-selection="(keys) => updateGroupSelection(group, keys)" />
        </div>

        <div v-if="totalGroups > 0" class="pagination-section">
            <div class="pagination-info">
                {{ t('common.all') }} {{ totalGroups }} {{ t('similarity.page') }}，{{ totalFiles }} {{ t('similarity.files') }}
            </div>
            <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
                    {{ t('similarity.prevPage') }}
                </button>
                <span class="pagination-current">{{ t('similarity.page') }} {{ currentPage }} {{ t('similarity.page') }}</span>
                <button @click="nextPage" :disabled="currentPage * pageSize >= totalGroups" class="pagination-btn">
                    {{ t('similarity.nextPage') }}
                </button>
            </div>
        </div>

        <SimilaritySettingsModal v-model:show="showSettings" :settings="settings" @apply="applySettings" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/AppStore';
import { logger } from '@/common/logger';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import '@/assets/common.css';
import { FileDoc, Refresh, Setting } from '@icon-park/vue-next';
import SimilarityGroupCard from '@/components/AdminEntry/SimilarityGroupCard.vue';
import type { SimilarityGroup, SimilarityFile } from '@/components/AdminEntry/SimilarityGroupCard.vue';
import SimilaritySettingsModal from '@/components/AdminEntry/SimilaritySettingsModal.vue';
import type { SimilaritySettings } from '@/components/AdminEntry/SimilaritySettingsModal.vue';

const { t } = useI18n();
const appStore = useAppStore();

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

const settings = ref<SimilaritySettings>({
    useAI: false,
    minSimilarity: 90,
    scope: 'all',
    types: {
        image: true,
        video: true
    }
});

const statusText = computed(() => {
    if (isDetecting.value) return t('similarity.detecting');
    if (similarityGroups.value.length > 0) return t('similarity.detected');
    return t('similarity.notDetected');
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
        Utils.addToast(response.status || t('similarity.startDetectionFailed'));
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
        logger.error('加载失败:', error);
        Utils.addToast(t('similarity.loadFailed'));
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

const updateGroupSelection = (group: SimilarityGroup, keys: Array<string | number>) => {
    group.files.forEach(file => {
        file.selected = keys.includes(file.id);
    });
};

const deleteGroup = async (group: SimilarityGroup) => {
    const selectedFiles = group.files.filter(f => f.selected);
    if (selectedFiles.length === 0) {
        Utils.addToast(t('similarity.selectFilesToDelete'));
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

const locateFile = (_file: SimilarityFile) => {
    Utils.addToast(t('similarity.locateFeatureWIP'));
};

const applySettings = (nextSettings: SimilaritySettings) => {
    settings.value = nextSettings;
    Utils.addToast(t('similarity.settingsSaved'));
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
    border-radius: 2px;
    transition: width var(--xc-transition-normal);
}

.progress-text {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.similarity-content {
    flex: 1;
    min-height: 0;
    padding: var(--xc-spacing-md) var(--xc-spacing-xl);
    overflow-y: auto;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--xc-spacing-sm);
    padding: var(--xc-spacing-xxl) 0;
    color: var(--xc-text-color-secondary);
}

.empty-title {
    margin: 0;
    font-size: var(--xc-font-size-base);
    color: var(--xc-text-color);
}

.empty-desc {
    margin: 0;
    font-size: var(--xc-font-size-sm);
}

.pagination-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--xc-spacing-md) var(--xc-spacing-xl);
    border-top: var(--xc-border);
}

.pagination-info {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--xc-spacing-sm);
}

.pagination-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    background-color: var(--xc-button-bg-color);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
    cursor: pointer;
    transition: all var(--xc-transition-normal);
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
}
</style>
