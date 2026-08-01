<template>
    <div class="set-entry">
        <div class="set-options xc-scrollbar">
            <div class="settings-group">
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
                        class="xc-button">{{ t('setEntry.createProject') }}</button>
                    <button :title="t('setEntry.openProject')" @click="btnclk_set([DatType.PrjSetType.Open])" class="xc-button">{{ t('setEntry.openProject') }}</button>
                </div>
                <div class="button-group">
                    <button :title="t('setEntry.buildDatabase')" @click="btnclk_set()" class="xc-button">{{ t('setEntry.buildDatabase') }}</button>
                    <div class="form-item select-item" style="margin-bottom: 0;">
                        <label class="xc-label">{{ t('setEntry.buildMode') }}</label>
                        <select v-model="selectedBuildMode" class="xc-select">
                            <option value="incremental">{{ t('setEntry.buildIncremental') }}</option>
                            <option value="full">{{ t('setEntry.buildFull') }}</option>
                        </select>
                        <span v-if="showBuildProgress" class="progress-text"
                            :class="{ 'progress-complete': buildProgress.percent === 100 }">
                            {{ buildProgress.percent }}%
                        </span>
                    </div>
                </div>
            </div>

            <div class="settings-group">
                <h3 class="group-title">{{ t('setEntry.aiSettings') }}</h3>

                <h4 class="sub-group-title">{{ t('setEntry.aiBackgroundAnalyze') }}</h4>
                <div class="form-item select-item">
                    <label class="xc-label">{{ t('setEntry.analyzeMode') }}</label>
                    <select v-model="aiAnalyzeMode" class="xc-select">
                        <option value="incremental">{{ t('setEntry.analyzeIncremental') }}</option>
                        <option value="full">{{ t('setEntry.analyzeFull') }}</option>
                    </select>
                </div>
                <div v-if="aiAnalyzeStatus.isRunning" class="ai-status">
                    <div class="status-info">
                        <span class="status-badge running">{{ t('setEntry.running') }}</span>
                        <span class="status-text">{{ aiAnalyzeStatus.status }}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"
                            :style="{ width: (aiAnalyzeStatus.processedFiles / aiAnalyzeStatus.totalFiles * 100) + '%' }">
                        </div>
                    </div>
                    <div class="progress-info">
                        <span>{{ t('setEntry.progress') }} {{ aiAnalyzeStatus.processedFiles }} / {{ aiAnalyzeStatus.totalFiles }}</span>
                        <span>{{ t('setEntry.success') }} {{ aiAnalyzeStatus.successCount }}</span>
                        <span>{{ t('setEntry.fail') }} {{ aiAnalyzeStatus.failCount }}</span>
                    </div>
                </div>
                <div class="button-group">
                    <button v-if="!aiAnalyzeStatus.isRunning"
                        :title="t('setEntry.startAnalyze')" @click="startAIBackgroundAnalyze"
                        class="xc-button">{{ t('setEntry.startAnalyze') }}</button>
                    <button v-else
                        :title="t('setEntry.stopAnalyze')" @click="stopAIBackgroundAnalyze"
                        class="xc-button" style="background-color: #ff4d4f;">{{ t('setEntry.stopAnalyze') }}</button>
                </div>

                <h4 class="sub-group-title">{{ t('setEntry.aiVectorIndex') }}</h4>
                <p class="setting-hint">{{ t('setEntry.aiVectorIndexDesc') }}</p>
                <div v-if="aiIndexInitStatus.isRunning" class="ai-status">
                    <div class="status-info">
                        <span class="status-badge running">{{ t('setEntry.running') }}</span>
                        <span class="status-text">{{ aiIndexInitStatus.status }}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"
                            :style="{ width: aiIndexInitStatus.percent + '%' }">
                        </div>
                    </div>
                    <div class="progress-info">
                        <span>{{ t('setEntry.progress') }} {{ aiIndexInitStatus.current }} / {{ aiIndexInitStatus.total }}</span>
                        <span v-if="aiIndexInitStatus.processedFiles > 0">
                            {{ t('setEntry.processed') }} {{ aiIndexInitStatus.processedFiles }}
                        </span>
                        <span v-if="aiIndexInitStatus.skippedFiles > 0">
                            {{ t('setEntry.skipped') }} {{ aiIndexInitStatus.skippedFiles }}
                        </span>
                    </div>
                </div>
                <div class="button-group">
                    <div v-if="!aiIndexInitStatus.isRunning" class="ai-index-options">
                        <label class="option-label">
                            <input type="radio" v-model="aiIndexMode" value="incre" />
                            {{ t('setEntry.incrementalUpdate') }}
                        </label>
                        <label class="option-label">
                            <input type="radio" v-model="aiIndexMode" value="full" />
                            {{ t('setEntry.fullRebuild') }}
                        </label>
                    </div>
                    <button v-if="!aiIndexInitStatus.isRunning"
                        :title="t('setEntry.createIndex')" @click="startAIIndexInit"
                        class="xc-button">{{ t('setEntry.createIndex') }}</button>
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
})

const aiAnalyzeMode = ref('incremental')
const aiAnalyzeStatus = ref(new DatType.AIBackgroundAnalyzeStatus())

const startAIBackgroundAnalyze = async () => {
    try {
        const req = new DatType.AIBackgroundAnalyzeReq()
        req.mode = aiAnalyzeMode.value
        
        const resp = await ApiService.aiBackgroundAnalyze(req)
        if (resp.code === 0) {
            Utils.message_notify({ content: t('setEntry.aiAnalyzeStarted'), type: 'success' })
        } else {
            Utils.message_notify({ content: t('setEntry.aiAnalyzeStartFailed') + ': ' + (resp.status || ''), type: 'error' })
        }
    } catch (error) {
        console.error('启动后台AI分析失败:', error)
        Utils.message_notify({ content: t('setEntry.aiAnalyzeStartError'), type: 'error' })
    }
}

const stopAIBackgroundAnalyze = async () => {
    try {
        const resp = await ApiService.aiBackgroundAnalyzeStop()
        if (resp.code === 0) {
            Utils.message_notify({ content: t('setEntry.aiAnalyzeStopped'), type: 'info' })
        } else {
            Utils.message_notify({ content: t('setEntry.aiAnalyzeStopFailed') + ': ' + (resp.status || ''), type: 'error' })
        }
    } catch (error) {
        console.error('停止后台AI分析失败:', error)
        Utils.message_notify({ content: t('setEntry.aiAnalyzeStopError'), type: 'error' })
    }
}

watch(() => appStore.progressData, () => {
    if (appStore.progressData.step === DatType.ProgressStep.AIBackgroundAnalyze) {
        aiAnalyzeStatus.value.processedFiles = appStore.progressData.current
        aiAnalyzeStatus.value.totalFiles = appStore.progressData.total
        aiAnalyzeStatus.value.status = appStore.progressData.status
        aiAnalyzeStatus.value.isRunning = appStore.progressData.isRunning
        
        const successMatch = appStore.progressData.status.match(/success:\s*(\d+)/)
        const failMatch = appStore.progressData.status.match(/fail:\s*(\d+)/)
        if (successMatch) {
            aiAnalyzeStatus.value.successCount = parseInt(successMatch[1])
        }
        if (failMatch) {
            aiAnalyzeStatus.value.failCount = parseInt(failMatch[1])
        }
    }
    
    // AI index init progress
    if (appStore.progressData.step === DatType.ProgressStep.AiIndexInit) {
        aiIndexInitStatus.value.current = appStore.progressData.current
        aiIndexInitStatus.value.total = appStore.progressData.total
        aiIndexInitStatus.value.percent = appStore.progressData.percent
        aiIndexInitStatus.value.status = appStore.progressData.status
        aiIndexInitStatus.value.isRunning = appStore.progressData.isRunning
        
        // Parse processed and skipped from status
        const processedMatch = appStore.progressData.status.match(/processed=(\d+)/)
        const skippedMatch = appStore.progressData.status.match(/skipped=(\d+)/)
        if (processedMatch) {
            aiIndexInitStatus.value.processedFiles = parseInt(processedMatch[1])
        }
        if (skippedMatch) {
            aiIndexInitStatus.value.skippedFiles = parseInt(skippedMatch[1])
        }
    }
}, { deep: true })

// AI Index Init
const aiIndexInitStatus = ref({
    isRunning: false,
    current: 0,
    total: 0,
    percent: 0,
    status: '',
    processedFiles: 0,
    skippedFiles: 0
})

const aiIndexMode = ref<'incre' | 'full'>('incre') // 'incre'=incremental, 'full'=full rebuild

const startAIIndexInit = async () => {
    try {
        const req = new DatType.PrjSetReq()
        req.type = [aiIndexMode.value === 'full' ? DatType.PrjSetType.AiIndexInitFull : DatType.PrjSetType.AiIndexInitIncre]
        req.prj.path = Utils.convertToLinuxPath(prjPath.value)

        await Utils.project_set(req)
        const modeText = aiIndexMode.value === 'full' ? t('setEntry.fullRebuild') : t('setEntry.incrementalUpdate')
        Utils.message_notify({ content: t('setEntry.aiVectorIndex') + modeText, type: 'success' })
    } catch (error) {
        console.error('启动AI索引创建失败:', error)
        Utils.message_notify({ content: t('setEntry.aiIndexStartFailed'), type: 'error' })
    }
}

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

.checkbox-item {
    margin-left: 8px;
    margin-bottom: 0;
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
}

.ai-index-options {
    display: flex;
    gap: 15px;
    align-items: center;
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

.sub-group-title {
    margin: 20px 0 10px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--xc-text-color);
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
</style>