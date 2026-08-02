<template>
    <div class="set-entry">
        <div class="set-options xc-scrollbar">
            <div class="settings-group">
                <h3 class="group-title">{{ t('setEntry.projectSettings') }}</h3>
                <div class="form-item">
                    <label class="xc-label">{{ t('setEntry.projectPath') }}</label>
                    <input type="text" v-model="prjPath" :placeholder="t('setEntry.projectPathPlaceholder')" class="xc-input-text text-base-path" />
                </div>
                <div class="form-item">
                    <label class="xc-label">{{ t('setEntry.repoPath') }}</label>
                    <input type="text" v-model="repoPath.path" :placeholder="t('setEntry.repoPathPlaceholder')"
                        class="xc-input-text text-base-path" />
                </div>
                <div class="button-group">
                    <button :title="t('setEntry.createProject')" @click="btnclk_set([DatType.PrjSetType.Create])"
                        class="xc-button primary action-btn">{{ t('setEntry.createProject') }}</button>
                    <button :title="t('setEntry.openProject')" @click="btnclk_set([DatType.PrjSetType.Open])" 
                        class="xc-button primary action-btn">{{ t('setEntry.openProject') }}</button>
                </div>
                <div class="button-group">
                    <button :title="t('setEntry.buildDatabase')" @click="btnclk_set()" class="xc-button primary action-btn">{{ t('setEntry.buildDatabase') }}</button>
                    <select v-model="selectedBuildMode" class="xc-select action-btn">
                        <option value="incremental">{{ t('setEntry.buildIncremental') }}</option>
                        <option value="full">{{ t('setEntry.buildFull') }}</option>
                    </select>
                    <span v-if="showBuildProgress" class="progress-text"
                        :class="{ 'progress-complete': buildProgress.percent === 100 }">
                        {{ buildProgress.percent }}%
                    </span>
                </div>
            </div>

            <div class="settings-group">
                <h3 class="group-title">{{ t('setEntry.aiSettings') }}</h3>

                <!-- AI Status -->
                <div class="ai-status-bar">
                    <span class="status-badge" :class="{ 'available': aiAvailable, 'unavailable': !aiAvailable }">
                        {{ aiAvailable ? t('setEntry.aiAvailable') : t('setEntry.aiUnavailable') }}
                    </span>
                    <template v-if="!aiAvailable">
                        <span class="status-hint">{{ t('setEntry.aiDownloadHint') }}</span>
                        <button @click="downloadAIComponent" class="xc-button primary action-btn">
                            {{ t('setEntry.downloadAI') }}
                        </button>
                    </template>
                </div>

                <!-- Mode selector -->
                <div class="ai-index-options">
                    <label class="option-label">
                        <input type="radio" v-model="aiMode" value="incre" />
                        {{ t('setEntry.incrementalUpdate') }}
                    </label>
                    <label class="option-label">
                        <input type="radio" v-model="aiMode" value="full" />
                        {{ t('setEntry.fullRebuild') }}
                    </label>
                </div>

                <!-- Unified progress display -->
                <div v-if="aiProcessing" class="ai-status">
                    <div class="status-info">
                        <span class="status-badge running">{{ t('setEntry.running') }}</span>
                        <span class="status-text">{{ aiStepLabel }}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: aiProgressPercent + '%' }"></div>
                    </div>
                    <div class="progress-info">
                        <span>{{ t('setEntry.progress') }} {{ aiProgressCurrent }} / {{ aiProgressTotal }}</span>
                        <span v-if="aiSuccessCount > 0">{{ t('setEntry.success') }} {{ aiSuccessCount }}</span>
                        <span v-if="aiFailCount > 0">{{ t('setEntry.fail') }} {{ aiFailCount }}</span>
                    </div>
                </div>

                <!-- Start/Stop button -->
                <div class="button-group">
                    <button v-if="!aiProcessing"
                        :title="t('setEntry.startAIProcess')" @click="startAIProcess"
                        class="xc-button primary action-btn">{{ t('setEntry.startAIProcess') }}</button>
                    <button v-else
                        :title="t('setEntry.stopAIProcess')" @click="stopAIProcess"
                        class="xc-button action-btn danger">{{ t('setEntry.stopAIProcess') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
const { t } = useI18n();
// import axios from 'axios';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils';
import { ApiService } from '@/utils/apiService';

// AI status
const aiAvailable = ref(false)

const checkAIStatus = async () => {
    try {
        const resp = await ApiService.aiStatus()
        if (resp.code === 0 && resp.data) {
            aiAvailable.value = (resp.data as DatType.AIStatus).available
        }
    } catch (error) {
        console.error('Failed to check AI status:', error)
    }
}

const downloadAIComponent = () => {
    // Placeholder URL - will be replaced with actual download link
    const downloadUrl = 'https://github.com/xutopia77/timetidy-prj/releases/download/latest/ai-component.zip'
    window.open(downloadUrl, '_blank')
}

// 使用 ref 创建响应式变量来存储输入框的值
const prjPath = ref('');
watch(() => appStore.prj.path, () => {
    if (appStore.prj.path !== '') {
        prjPath.value = appStore.prj.path
    } else if (appStore.prj.defaultPrjPath !== '') {
        prjPath.value = appStore.prj.defaultPrjPath
    } else {
        prjPath.value = ""
    }
})

// ------------------------------------
const repoPath = ref<DatType.Repo>(new DatType.Repo())
watch(() => appStore.prj.repo, () => {
    repoPath.value = appStore.prj.repo
})

// ------------------------------------
// Build mode: 'full' - full, 'incremental' - incremental
const selectedBuildMode = ref('incremental')

// Progress - show the running step's progress
const buildProgress = computed(() => {
    if (appStore.progressThumbnail.isRunning) return appStore.progressThumbnail
    if (appStore.progressExif.isRunning) return appStore.progressExif
    if (appStore.progressHash.isRunning) return appStore.progressHash
    return appStore.progressThumbnail
})

const showBuildProgress = computed(() => {
    return appStore.progressThumbnail.isRunning || appStore.progressExif.isRunning || appStore.progressHash.isRunning
})

// Reset progress
function resetProgress() {
    appStore.progressThumbnail = { step: DatType.ProgressStep.Thumbnail, current: 0, total: 0, percent: 0, status: '', isRunning: false }
    appStore.progressExif = { step: DatType.ProgressStep.Exif, current: 0, total: 0, percent: 0, status: '', isRunning: false }
    appStore.progressHash = { step: DatType.ProgressStep.Hash, current: 0, total: 0, percent: 0, status: '', isRunning: false }
}

async function btnclk_set(types: DatType.PrjSetType[] = []) {
    resetProgress()

    if (types.length > 0 && types[0] == DatType.PrjSetType.Open) {
        // 选择一个 JSON 文件
        const selectFile = () => {
            return new Promise<File>((resolve, reject) => {
                // 创建一个隐藏的文件输入元素
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json'; // 只允许选择 JSON 文件
                input.multiple = false; // 只允许选择一个文件

                input.addEventListener('change', () => {
                    const files = input.files;
                    if (files && files.length > 0) {
                        const file = files[0];
                        if (file.type === 'application/json' || file.name.endsWith('.json')) {
                            resolve(file);
                        } else {
                            reject(new Error(t('setEntry.validJsonOnly')));
                        }
                    } else {
                        reject(new Error(t('setEntry.noFileSelected')));
                    }
                });

                input.addEventListener('error', (error) => {
                    reject(error);
                });

                // 触发文件选择对话框
                input.click();
            });
        };

        const readFileContent = (file: File) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        resolve(event.target.result as string);
                    } else {
                        reject(new Error(t('setEntry.fileReadFailed')));
                    }
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsText(file);
            });
        };

        const getFileContent = async (): Promise<DatType.Resp> => {
            const resp: DatType.Resp = new DatType.Resp()
            try {
                // 等待用户选择文件
                const file = await selectFile();
                // 读取文件内容
                const content = await readFileContent(file);
                try {
                    // 解析 JSON 内容
                    const jsonData = JSON.parse(content);
                    // 这里可以根据需求处理解析后的 JSON 数据
                    console.log('解析后的 JSON 数据:', jsonData);
                    // 将文件名赋值给 prjPath
                    prjPath.value = jsonData['path'];
                    resp.code = 0
                } catch (parseError) {
                    console.error('解析 JSON 文件出错:', parseError);
                    Utils.message_notify({ content: t('setEntry.invalidJsonFile'), type: "error" });
                    resp.code = 1;
                }
            } catch (error) {
                console.error('选择或读取文件出错:', error);
                Utils.message_notify({ content: t('setEntry.fileReadError'), type: "error" });
                resp.code = 1;
            }
            return resp
        };
        const sltResp = await getFileContent();
        if (sltResp.code != 0) {
            return
        }
    }

    repoPath.value.path = Utils.convertToLinuxPath(repoPath.value.path)
    const req: DatType.PrjSetReq = new DatType.PrjSetReq()
    if (types.length > 0) {
        req.type = types
        if (types.length == 1) {
            if (DatType.PrjSetType.Create == types[0]) {
                req.prj.path = Utils.convertToLinuxPath(prjPath.value)
                if (repoPath.value.path != '') {
                    req.prj.repo = repoPath.value
                }
            } else if (DatType.PrjSetType.Open == types[0]) {
                req.prj.path = Utils.convertToLinuxPath(prjPath.value)
            }
        }
    }
    else {
        req.type.push(DatType.PrjSetType.Save)
        req.type.push(DatType.PrjSetType.Sync)
        if (selectedBuildMode.value == 'full') {
            req.type.push(DatType.PrjSetType.GenThumbFull)
            req.type.push(DatType.PrjSetType.ScanExifFull)
            req.type.push(DatType.PrjSetType.GenHashFull)
        }
        else if (selectedBuildMode.value == 'incremental') {
            req.type.push(DatType.PrjSetType.GenThumbIncre)
            req.type.push(DatType.PrjSetType.ScanExifIncre)
            req.type.push(DatType.PrjSetType.GenHashIncre)
        }
        req.prj.path = Utils.convertToLinuxPath(prjPath.value)
        if (repoPath.value.path != '') {
            req.prj.repo = repoPath.value
        }
    }
    Utils.project_set(req)
}

onMounted(() => {
    if (appStore.prj.path) {
        prjPath.value = appStore.prj.path
    } else if (appStore.prj.defaultPrjPath) {
        prjPath.value = appStore.prj.defaultPrjPath
    } else {
        prjPath.value = ""
    }
    repoPath.value = appStore.prj.repo
    checkAIStatus()
})

// Unified AI processing state
const aiMode = ref<'incre' | 'full'>('incre')
const aiProcessing = ref(false)
const aiCurrentStep = ref<'analyze' | 'index' | ''>('')
const aiProgressPercent = ref(0)
const aiProgressCurrent = ref(0)
const aiProgressTotal = ref(0)
const aiSuccessCount = ref(0)
const aiFailCount = ref(0)
const aiAnalyzeDone = ref(false) // Track if analyze step completed

const aiStepLabel = computed(() => {
    if (aiCurrentStep.value === 'analyze') return t('setEntry.aiStepAnalyze')
    if (aiCurrentStep.value === 'index') return t('setEntry.aiStepIndex')
    return ''
})

const startAIProcess = async () => {
    aiProcessing.value = true
    aiAnalyzeDone.value = false
    aiCurrentStep.value = 'analyze'
    aiSuccessCount.value = 0
    aiFailCount.value = 0
    await startAIBackgroundAnalyze()
}

const stopAIProcess = async () => {
    if (aiCurrentStep.value === 'analyze') {
        await stopAIBackgroundAnalyze()
    }
    aiProcessing.value = false
    aiCurrentStep.value = ''
}

const startAIBackgroundAnalyze = async () => {
    try {
        const req = new DatType.AIBackgroundAnalyzeReq()
        req.mode = aiMode.value === 'full' ? 'full' : 'incremental'

        const resp = await ApiService.aiBackgroundAnalyze(req)
        if (resp.code === 0) {
            Utils.message_notify({ content: t('setEntry.aiAnalyzeStarted'), type: 'success' })
        } else {
            Utils.message_notify({ content: t('setEntry.aiAnalyzeStartFailed') + ': ' + (resp.status || ''), type: 'error' })
            aiProcessing.value = false
            aiCurrentStep.value = ''
        }
    } catch (error) {
        console.error('Failed to start AI analyze:', error)
        Utils.message_notify({ content: t('setEntry.aiAnalyzeStartError'), type: 'error' })
        aiProcessing.value = false
        aiCurrentStep.value = ''
    }
}

const stopAIBackgroundAnalyze = async () => {
    try {
        const resp = await ApiService.aiBackgroundAnalyzeStop()
        if (resp.code !== 0) {
            Utils.message_notify({ content: t('setEntry.aiAnalyzeStopFailed') + ': ' + (resp.status || ''), type: 'error' })
        }
    } catch (error) {
        console.error('Failed to stop AI analyze:', error)
    }
}

const startAIIndexInit = async () => {
    aiCurrentStep.value = 'index'
    aiProgressPercent.value = 0
    aiProgressCurrent.value = 0
    aiProgressTotal.value = 0
    try {
        const req = new DatType.PrjSetReq()
        req.type = [aiMode.value === 'full' ? DatType.PrjSetType.AiIndexInitFull : DatType.PrjSetType.AiIndexInitIncre]
        req.prj.path = Utils.convertToLinuxPath(prjPath.value)
        await Utils.project_set(req)
    } catch (error) {
        console.error('Failed to start AI index init:', error)
        Utils.message_notify({ content: t('setEntry.aiIndexStartFailed'), type: 'error' })
        aiProcessing.value = false
        aiCurrentStep.value = ''
    }
}

// Unified progress watcher
watch(() => appStore.progressData, () => {
    const step = appStore.progressData.step

    if (step === DatType.ProgressStep.AIBackgroundAnalyze) {
        if (appStore.progressData.isRunning) {
            aiProgressCurrent.value = appStore.progressData.current
            aiProgressTotal.value = appStore.progressData.total
            aiProgressPercent.value = appStore.progressData.total > 0
                ? (appStore.progressData.current / appStore.progressData.total * 100) : 0

            const successMatch = appStore.progressData.status.match(/success:\s*(\d+)/)
            const failMatch = appStore.progressData.status.match(/fail:\s*(\d+)/)
            if (successMatch) aiSuccessCount.value = parseInt(successMatch[1])
            if (failMatch) aiFailCount.value = parseInt(failMatch[1])
        } else if (aiProcessing.value && !aiAnalyzeDone.value) {
            // Analyze completed, auto-start index init
            aiAnalyzeDone.value = true
            startAIIndexInit()
        }
    }

    if (step === DatType.ProgressStep.AiIndexInit) {
        if (appStore.progressData.isRunning) {
            aiProgressCurrent.value = appStore.progressData.current
            aiProgressTotal.value = appStore.progressData.total
            aiProgressPercent.value = appStore.progressData.percent
        } else if (aiProcessing.value && aiAnalyzeDone.value) {
            // Index init completed
            aiProcessing.value = false
            aiCurrentStep.value = ''
            Utils.message_notify({ content: t('setEntry.aiProcessDone'), type: 'success' })
        }
    }
}, { deep: true })

</script>

<style scoped>
.set-entry {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    display: flex;
    /* flex-direction: column; */
}

.set-options {
    width: 100%;
    height: 100%;
    margin: 0;
    background-color: var(--xc-background-color);
}

.settings-group {
    margin-bottom: 25px;
    padding: 15px;
    /* border: 1px solid #e0e0e0; */
    border-radius: 8px;
    background-color: var(--xc-background-color-hover);
}

.form-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
}

.form-item .xc-label {
    width: 100px;
    margin-right: 10px;
    text-align: right;
}

.text-base-path {
    width: calc(100% - 110px);
}

.checkbox-group {
    margin: 15px 0;
    display: flex;
    flex-direction: column;
}

.checkbox-item {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
}

.progress-text {
    margin-left: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background-color: var(--xc-primary-color, #4A6FA5);
    color: white;
    min-width: 40px;
    text-align: center;
}

.progress-text.progress-complete {
    background-color: var(--xc-success-color, #52c41a);
}

.button-group {
    margin-top: 15px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}

.ai-index-options {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 10px;
}

.option-label {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    font-size: 14px;
}

.option-label input[type="radio"] {
    cursor: pointer;
}

.select-item {
    display: flex;
    align-items: center;
    margin: 8px 0;
}

.group-title {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--xc-text-color);
    border-bottom: 1px solid var(--xc-border-color);
    padding-bottom: 8px;
}

.hint-text {
    margin-left: 10px;
    font-size: 12px;
    color: var(--xc-text-color-secondary);
}

.setting-hint {
    margin: 0 0 15px 0;
    font-size: 13px;
    color: var(--xc-text-color-secondary);
    line-height: 1.5;
}

.ai-status {
    margin: 15px 0;
    padding: 15px;
    background-color: var(--xc-background-color);
    border-radius: 6px;
    border: 1px solid var(--xc-border-color);
}

.status-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.running {
    background-color: #52c41a;
    color: white;
}

.status-text {
    font-size: 14px;
    color: var(--xc-text-color);
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--xc-border-color);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background-color: var(--xc-primary-color);
    transition: width 0.3s ease;
}

.progress-info {
    display: flex;
    gap: 20px;
    font-size: 12px;
    color: var(--xc-text-color-secondary);
}

.ai-status-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding: 8px 0;
}

.ai-status-bar .status-badge {
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.ai-status-bar .status-badge.available {
    background-color: var(--xc-success-color, #52c41a);
    color: white;
}

.ai-status-bar .status-badge.unavailable {
    background-color: var(--xc-border-color);
    color: var(--xc-text-color-secondary);
}

.ai-status-bar .status-hint {
    font-size: 13px;
    color: var(--xc-text-color-secondary);
}

.action-btn {
    padding: var(--xc-spacing-xs) var(--xc-spacing-md);
    font-size: var(--xc-font-size-sm);
    border-width: 1px;
    border-style: solid;
}

.action-btn.danger {
    background-color: var(--xc-error-color);
    color: white;
    border-color: var(--xc-error-color);
}

.action-btn.danger:hover {
    background-color: #d41920;
    border-color: #d41920;
}
</style>