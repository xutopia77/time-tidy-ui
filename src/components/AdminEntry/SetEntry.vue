<template>
    <div class="set-entry">
        <div class="set-options">
            <div class="settings-group">
                <div class="form-item">
                    <label class="xc-label">项目路径:</label>
                    <input type="text" v-model="prjPath" placeholder="输入项目路径" class="xc-input-text text-base-path" />
                </div>
                <div class="form-item">
                    <label class="xc-label">仓库路径:</label>
                    <input type="text" v-model="repoPath.path" placeholder="输入仓库路径"
                        class="xc-input-text text-base-path" />
                </div>
                <div class="button-group">
                    <button title="创建项目" @click="btnclk_set([DatType.PrjSetType.Create])"
                        class="xc-button">创建项目</button>
                    <button title="打开项目" @click="btnclk_set([DatType.PrjSetType.Open])" class="xc-button">打开项目</button>
                </div>
            </div>

            <div class="settings-group">
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" class="xc-checkbox" v-model="bPrjSetSave" id="save-option" />
                        <label class="xc-label" for="save-option">保存项目信息</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" class="xc-checkbox" v-model="bPrjSetSync" id="sync-option" />
                        <label class="xc-label" for="sync-option">同步仓库文件信息</label>
                    </div>
                    <div class="form-item select-item">
                        <label class="xc-label">缩略图选项:</label>
                        <select v-model="selectedThumbOption" class="xc-select">
                            <option value="none">不生成缩略图</option>
                            <option value="full">生成缩略图(全量)</option>
                            <option value="incremental">生成缩略图(增量)</option>
                        </select>
                        <span v-if="showThumbProgress" class="progress-text"
                            :class="{ 'progress-complete': thumbProgress.percent === 100 }">
                            {{ thumbProgress.percent }}%
                        </span>
                    </div>
                    <div class="form-item select-item">
                        <label class="xc-label">元信息选项:</label>
                        <select v-model="selectedExifOption" class="xc-select">
                            <option value="none">不提取元信息</option>
                            <option value="full">提取元信息(全量)</option>
                            <option value="incremental">提取元信息(增量)</option>
                        </select>
                        <span v-if="showExifProgress" class="progress-text"
                            :class="{ 'progress-complete': exifProgress.percent === 100 }">
                            {{ exifProgress.percent }}%
                        </span>
                    </div>
                    <div class="form-item select-item">
                        <label class="xc-label">指纹选项:</label>
                        <select v-model="selectedHashOption" class="xc-select">
                            <option value="none">不生成指纹</option>
                            <option value="full">生成指纹(全量)</option>
                            <option value="incremental">生成指纹(增量)</option>
                        </select>
                        <span v-if="showHashProgress" class="progress-text"
                            :class="{ 'progress-complete': hashProgress.percent === 100 }">
                            {{ hashProgress.percent }}%
                        </span>
                    </div>
                </div>
                <div class="button-group">
                    <button title="同步项目下的文件信息" @click="btnclk_set()" class="xc-button">同步项目</button>
                </div>
            </div>

            <div class="settings-group">
                <div class="button-group">
                    <button title="数据检查" @click="btnclk_detect_health()" class="xc-button">数据检查</button>
                </div>
            </div>
        </div>
        <div class="set-log">
            <SetEntryLog />
            <div class="log-actions">
                <button title="清理日志" @click="btnclk_clean_log" class="xc-button">清空日志</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
// import axios from 'axios';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils';

import SetEntryLog from '@/components/SetEntry/SetEntryLog.vue';

// 使用 ref 创建响应式变量来存储输入框的值
const prjPath = ref('');
watch(() => appStore.prj.path, () => {
    prjPath.value = appStore.prj.path == null ? "" : appStore.prj.path
})

function btnclk_detect_health() {
    Utils.project_health()
}

function btnclk_clean_log() {
    appStore.logInfo = ''
    Utils.message_notify({ content: "清理完成", type: "success" })
}

// ------------------------------------
const repoPath = ref<DatType.Repo>(new DatType.Repo())
watch(() => appStore.prj.repo, () => {
    repoPath.value = appStore.prj.repo
})

// ------------------------------------
// 缩略图选项：'none' - 不生成, 'full' - 全量, 'incremental' - 增量
const selectedThumbOption = ref('none')
// 元信息选项：'none' - 不提取, 'full' - 全量, 'incremental' - 增量
const selectedExifOption = ref('none')
// 指纹选项：'none' - 不生成, 'full' - 全量, 'incremental' - 增量
const selectedHashOption = ref('none')
const bPrjSetSave = ref(true)
const bPrjSetSync = ref(false)

// 进度状态
const thumbProgress = computed(() => appStore.progressThumbnail)
const exifProgress = computed(() => appStore.progressExif)
const hashProgress = computed(() => appStore.progressHash)

// 是否显示进度（只有选择了对应选项且正在运行或刚完成时显示）
const showThumbProgress = computed(() => {
    return selectedThumbOption.value !== 'none' && thumbProgress.value.isRunning
})
const showExifProgress = computed(() => {
    return selectedExifOption.value !== 'none' && exifProgress.value.isRunning
})
const showHashProgress = computed(() => {
    return selectedHashOption.value !== 'none' && hashProgress.value.isRunning
})

// 重置进度
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
                            reject(new Error('请选择有效的 JSON 文件'));
                        }
                    } else {
                        reject(new Error('未选择文件'));
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
                        reject(new Error('读取文件内容失败'));
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
                    Utils.message_notify({ content: "解析 JSON 文件出错，请检查文件格式", type: "error" });
                    resp.code = 1;
                }
            } catch (error) {
                console.error('选择或读取文件出错:', error);
                Utils.message_notify({ content: "选择或读取文件出错，请重试", type: "error" });
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
        if (bPrjSetSave.value) { req.type.push(DatType.PrjSetType.Save) }
        if (bPrjSetSync.value) { req.type.push(DatType.PrjSetType.Sync) }
        if (selectedThumbOption.value == 'full') {
            req.type.push(DatType.PrjSetType.GenThumbFull)
        }
        else if (selectedThumbOption.value == 'incremental') {
            req.type.push(DatType.PrjSetType.GenThumbIncre)
        }
        if (selectedExifOption.value == 'full') {
            req.type.push(DatType.PrjSetType.ScanExifFull)
        }
        else if (selectedExifOption.value == 'incremental') {
            req.type.push(DatType.PrjSetType.ScanExifIncre)
        }
        if (selectedHashOption.value == 'full') {
            req.type.push(DatType.PrjSetType.GenHashFull)
        }
        else if (selectedHashOption.value == 'incremental') {
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
    prjPath.value = appStore.prj.path == null ? "" : appStore.prj.path
    repoPath.value = appStore.prj.repo
})

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
    width: 60%;
    height: 100%;
    margin: 0;
    /* padding: 20px; */
    overflow-y: auto;
    background-color: var(--xc-background-color);
}

.set-log {
    width: 40%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.log-actions {
    padding: 10px;
    text-align: right;
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

.select-item {
    display: flex;
    align-items: center;
    margin: 8px 0;
}
</style>