<template>
    <n-modal :show="show" preset="card" class="w-[520px] max-w-[90vw]" :title="t('similarity.detection')"
        @update:show="onUpdateShow">
        <div class="settings-panel">
            <div class="setting-item">
                <label>{{ t('similarity.enableAIDetection') }}</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="local.useAI" />
                        <span>{{ t('similarity.aiDetectionDesc') }}</span>
                    </label>
                </div>
            </div>

            <div class="setting-item" v-if="local.useAI">
                <label>{{ t('similarity.aiSimilarityThreshold') }}</label>
                <div class="setting-control">
                    <input type="range" v-model="local.minSimilarity" min="0" max="100" step="5" />
                    <span class="setting-value">{{ (local.minSimilarity / 100).toFixed(2) }}</span>
                </div>
                <p class="setting-hint">
                    {{ t('similarity.thresholdHint') }}
                </p>
            </div>

            <div class="setting-item">
                <label>{{ t('similarity.detectionScope') }}</label>
                <select v-model="local.scope" class="setting-select">
                    <option value="all">{{ t('similarity.allFiles') }}</option>
                    <option value="current">{{ t('similarity.currentDir') }}</option>
                </select>
            </div>

            <div class="setting-item">
                <label>{{ t('similarity.fileType') }}</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="local.types.image" />
                        <span>{{ t('similarity.image') }}</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="local.types.video" />
                        <span>{{ t('similarity.video') }}</span>
                    </label>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="settings-footer">
                <button @click="onUpdateShow(false)" class="btn btn-secondary">{{ t('common.cancel') }}</button>
                <button @click="onApply" class="btn btn-primary">{{ t('common.apply') }}</button>
            </div>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
// Detection settings dialog (NModal shell). Inner controls stay native so the
// e2e selectors (.settings-panel / input[type=range] / select.setting-select)
// keep working. Edits are made on a local copy and committed on "apply".
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NModal } from 'naive-ui';

export interface SimilaritySettings {
    useAI: boolean;
    minSimilarity: number;
    scope: string;
    types: {
        image: boolean;
        video: boolean;
    };
}

const props = defineProps<{
    show: boolean;
    settings: SimilaritySettings;
}>();

const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
    (e: 'apply', settings: SimilaritySettings): void;
}>();

const { t } = useI18n();

const local = ref<SimilaritySettings>(structuredClone(props.settings));

watch(() => props.show, (show) => {
    if (show) {
        local.value = structuredClone(props.settings);
    }
});

const onUpdateShow = (value: boolean) => {
    emit('update:show', value);
};

const onApply = () => {
    emit('update:show', false);
    emit('apply', local.value);
};
</script>

<style scoped>
.setting-item {
    margin-bottom: 20px;
}

.setting-item > label {
    display: block;
    margin-bottom: 8px;
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
    color: var(--xc-text-color);
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    cursor: pointer;
}

.setting-control {
    display: flex;
    align-items: center;
    gap: 12px;
}

.setting-control input[type='range'] {
    flex: 1;
}

.setting-value {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color);
    min-width: 48px;
}

.setting-hint {
    margin: 6px 0 0;
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
}

.setting-select {
    width: 100%;
    padding: 8px 10px;
    background-color: var(--xc-background-color-hover);
    border: 1px solid var(--xc-border-color);
    border-radius: var(--xc-border-radius-md);
    color: var(--xc-text-color);
    font-size: var(--xc-font-size-sm);
}

.settings-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
