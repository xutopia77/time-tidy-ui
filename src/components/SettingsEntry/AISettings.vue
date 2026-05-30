<template>
    <div class="settings-page">
        <div class="page-header">
            <h1>AI功能设置</h1>
            <p class="page-desc">配置AI智能标签功能</p>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Brain size="20" />
                <h2>AI引擎</h2>
            </div>

            <div class="settings-card">
                <div class="form-item">
                    <label class="form-label">启用AI功能</label>
                    <div class="form-control">
                        <label class="switch">
                            <input type="checkbox" v-model="form.enabled" @change="handleEnabledChange" />
                            <span class="slider"></span>
                        </label>
                        <span class="switch-label">{{ form.enabled ? '已启用' : '已禁用' }}</span>
                    </div>
                </div>

                <div class="form-item">
                    <label class="form-label">引擎状态</label>
                    <div class="form-control">
                        <span class="status-badge" :class="statusClass">{{ statusText }}</span>
                    </div>
                </div>

                <div class="form-item">
                    <label class="form-label">Python路径</label>
                    <div class="form-control">
                        <input
                            type="text"
                            class="input-field"
                            v-model="form.pythonPath"
                            placeholder="留空则自动检测系统Python"
                        />
                        <p class="form-hint">指定Python可执行文件路径，留空将自动检测系统Python或使用内置Python</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-header">
                <Tag size="20" />
                <h2>标签检测</h2>
            </div>

            <div class="settings-card">
                <div class="form-item">
                    <label class="form-label">置信度阈值: {{ form.tagThreshold.toFixed(2) }}</label>
                    <div class="form-control">
                        <input
                            type="range"
                            class="range-field"
                            v-model.number="form.tagThreshold"
                            min="0.05"
                            max="1.0"
                            step="0.05"
                        />
                        <div class="range-labels">
                            <span>0.05 (更多标签)</span>
                            <span>1.0 (更精确)</span>
                        </div>
                    </div>
                </div>

                <div class="form-item">
                    <label class="form-label">自动标签</label>
                    <div class="form-control">
                        <label class="switch">
                            <input type="checkbox" v-model="form.autoTag" @change="handleAutoTagChange" />
                            <span class="slider"></span>
                        </label>
                        <span class="switch-label">{{ form.autoTag ? '已启用' : '已禁用' }}</span>
                        <p class="form-hint">启用后，新扫描的图片将自动进行AI标签检测</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-actions">
            <button class="btn btn-secondary" @click="loadStatus">重置</button>
            <button class="btn btn-primary" @click="saveConfig">保存设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { Brain, Tag } from '@icon-park/vue-next';
import { ApiService } from '@/utils/apiService';
import type { AIStatus } from '@/utils/dataTypedef';
import Utils from '@/utils/utils';
import '@/assets/common.css';

const form = reactive({
    enabled: false,
    pythonPath: '',
    tagThreshold: 0.1,
    autoTag: false,
});

const aiAvailable = computed(() => form.enabled);

const statusClass = computed(() => ({
    'status-available': aiAvailable.value,
    'status-unavailable': !aiAvailable.value,
}));

const statusText = computed(() => {
    if (aiAvailable.value) return 'AI引擎可用';
    if (!form.enabled) return 'AI功能已禁用';
    return 'AI引擎不可用';
});

const loadStatus = async () => {
    try {
        const resp = await ApiService.aiStatus();
        if (resp.code === 0 && resp.data) {
            const status = resp.data as AIStatus;
            form.enabled = status.enabled;
            form.pythonPath = status.pythonPath;
            form.tagThreshold = status.tagThreshold;
            form.autoTag = status.autoTag;
        }
    } catch (e) {
        console.error('Failed to load AI status:', e);
    }
};

const handleEnabledChange = () => {
    saveConfig();
};

const handleAutoTagChange = () => {
    saveConfig();
};

const saveConfig = async () => {
    try {
        const req: Record<string, any> = {};
        req.enabled = form.enabled;
        req.python_path = form.pythonPath;
        req.tag_threshold = form.tagThreshold;
        req.auto_tag = form.autoTag;

        const resp = await ApiService.aiConfigSet(req);
        if (resp.code === 0 && resp.data) {
            const status = resp.data as AIStatus;
            form.enabled = status.enabled;
            form.pythonPath = status.pythonPath;
            form.tagThreshold = status.tagThreshold;
            form.autoTag = status.autoTag;
            Utils.message_notify({ content: 'AI设置已保存', type: 'success' });
        } else {
            Utils.message_notify({ content: '保存失败: ' + (resp.status || '未知错误'), type: 'error' });
        }
    } catch (e) {
        Utils.message_notify({ content: '保存失败', type: 'error' });
    }
};

onMounted(() => {
    loadStatus();
});
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

.form-hint {
    font-size: var(--xc-font-size-sm);
    color: var(--xc-text-color-secondary);
    margin: var(--xc-spacing-xs) 0 0 0;
}

.input-field {
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

.input-field:focus {
    outline: none;
    border-color: var(--xc-primary-color);
}

.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--xc-border-color);
    transition: 0.3s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--xc-primary-color);
}

input:checked + .slider:before {
    transform: translateX(20px);
}

.switch-label {
    margin-left: var(--xc-spacing-sm);
    font-size: var(--xc-font-size-md);
    color: var(--xc-text-color);
}

.status-badge {
    display: inline-block;
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    border-radius: var(--xc-border-radius-sm);
    font-size: var(--xc-font-size-sm);
    font-weight: 500;
}

.status-available {
    background-color: rgba(76, 175, 80, 0.15);
    color: #4CAF50;
}

.status-unavailable {
    background-color: rgba(158, 158, 158, 0.15);
    color: #9E9E9E;
}

.range-field {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--xc-border-color);
    border-radius: 3px;
    outline: none;
}

.range-field::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--xc-primary-color);
    cursor: pointer;
}

.range-labels {
    display: flex;
    justify-content: space-between;
    font-size: var(--xc-font-size-xs);
    color: var(--xc-text-color-secondary);
    margin-top: var(--xc-spacing-xs);
}

.settings-actions {
    display: flex;
    gap: var(--xc-spacing-md);
    justify-content: flex-end;
    margin-top: var(--xc-spacing-xl);
}

.btn {
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
