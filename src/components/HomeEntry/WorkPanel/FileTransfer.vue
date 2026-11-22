<template>
    <div class="file-transfer-overlay">
        <div class="file-transfer-container">
            <div class="transfer-header">
                <div class="header-title">
                    <span class="header-icon">📁</span>
                    <h3>{{ t('transfer.title') }}</h3>
                </div>
                <button class="close-button" @click="btn_page_close">
                    <span>×</span>
                </button>
            </div>

            <div class="transfer-content">
                <div class="directory-section">
                    <div class="section-header">
                        <span class="section-icon">📂</span>
                        <h4>{{ t('transfer.selectTarget') }}</h4>
                    </div>

                    <div class="directory-tree-wrapper xc-scrollbar">
                        <DirTreeItem :data="dirTrees" v-model="selectedItem" />
                    </div>

                    <div class="selected-path" v-if="selectedPathItem">
                        <span class="path-label">✓ {{ t('transfer.selected') }}:</span>
                        <span class="path-value">{{ selectedPathItem.path }}</span>
                    </div>
                </div>

                <div class="preview-section">
                    <div class="section-header">
                        <span class="section-icon">📊</span>
                        <h4>{{ t('transfer.operationPreview') }}</h4>
                    </div>

                    <div class="preview-stats">
                        <div class="stat-item">
                            <span class="stat-icon">📄</span>
                            <div class="stat-info">
                                <span class="stat-label">{{ t('transfer.fileCount') }}</span>
                                <span class="stat-value">{{ selectedFileCount }} {{ t('transfer.count') }}</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">📁</span>
                            <div class="stat-info">
                                <span class="stat-label">{{ t('transfer.dirCount') }}</span>
                                <span class="stat-value">{{ selectedDirCount }} {{ t('transfer.count') }}</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">💾</span>
                            <div class="stat-info">
                                <span class="stat-label">{{ t('transfer.totalSize') }}</span>
                                <span class="stat-value">{{ selectedTotalSize }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="operation-type">
                        <span class="type-label">{{ t('transfer.operationType') }}:</span>
                        <div class="type-buttons">
                            <button
                                class="type-btn move"
                                :class="{ active: setOperateType === 'move' }"
                                @click="setOperateType = 'move'">
                                📦 {{ t('operation.move') }}
                            </button>
                            <button
                                class="type-btn copy"
                                :class="{ active: setOperateType === 'copy' }"
                                @click="setOperateType = 'copy'">
                                📋 {{ t('operation.copy') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="progress-section" v-if="appStore.progressFileMove.isRunning">
                <div class="section-header">
                    <span class="section-icon">⏳</span>
                    <h4>{{ t('transfer.operationProgress') }}</h4>
                </div>
                <div class="progress-content">
                    <div class="progress-bar-container">
                        <div class="progress-bar" :style="{ width: appStore.progressFileMove.percent + '%' }"></div>
                    </div>
                    <div class="progress-info">
                        <span class="progress-status">{{ appStore.progressFileMove.status }}</span>
                        <span class="progress-percent">{{ appStore.progressFileMove.percent }}%</span>
                    </div>
                </div>
            </div>

            <div class="transfer-footer">
                <button class="btn-secondary" @click="btn_page_close">
                    {{ t('common.cancel') }}
                </button>
                <button
                    class="btn-primary move"
                    :disabled="!canOperate"
                    @click="btn_page_save('move')">
                    <span class="btn-icon">📦</span>
                    <span>{{ t('transfer.moveFiles') }}</span>
                </button>
                <button
                    class="btn-primary copy"
                    :disabled="!canOperate"
                    @click="btn_page_save('copy')">
                    <span class="btn-icon">📋</span>
                    <span>{{ t('transfer.copyFiles') }}</span>
                </button>
            </div>
        </div>

        <div class="dialog-overlay" v-if="isSureDialogVisible" @click="btnclk_sureDialog_confirm(false)">
            <div class="dialog-card" @click.stop>
                <div class="dialog-header">
                    <span class="dialog-icon">⚠️</span>
                    <h4>{{ t('transfer.confirmOperation') }}</h4>
                </div>

                <div class="dialog-content">
                    <p class="dialog-message">{{ t('transfer.confirmMessage') }}</p>
                    <div class="dialog-details">
                        <div class="detail-item">
                            <span class="detail-label">{{ t('transfer.files') }}:</span>
                            <span class="detail-value">{{ sureDialogContent }}</span>
                        </div>
                    </div>
                </div>

                <div class="dialog-footer">
                    <button class="btn-cancel" @click="btnclk_sureDialog_confirm(false)">
                        {{ t('common.cancel') }}
                    </button>
                    <button class="btn-confirm" @click="btnclk_sureDialog_confirm(true)">
                        {{ t('common.confirm') }}
                    </button>
                </div>
            </div>
        </div>

        <div class="dialog-overlay" v-if="isDialogVisibleFileExist" @click="btnclk_fileExistDialog_confirm(false)">
            <div class="dialog-card warning" @click.stop>
                <div class="dialog-header">
                    <span class="dialog-icon">⚠️</span>
                    <h4>{{ t('transfer.fileExist') }}</h4>
                </div>

                <div class="dialog-content">
                    <p class="dialog-message">{{ sureDialogContentFileExist }}</p>
                    <div class="conflict-info">
                        <p>{{ t('transfer.fileExistMessage') }}</p>
                    </div>
                </div>

                <div class="dialog-footer">
                    <button class="btn-cancel" @click="btnclk_fileExistDialog_confirm(false)">
                        {{ t('transfer.skip') }}
                    </button>
                    <button class="btn-warning" @click="btnclk_fileExistDialog_confirm(true)">
                        {{ t('transfer.overwrite') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
import { logger } from '@/common/logger'
const appStore = useAppStore()
const { t } = useI18n()
import '@/assets/common.css'
import DirTreeItem from '@/components/HomeEntry/WorkPanel/DirTreeItem.vue'

type fileOperateType = "move" | "copy" | "";
const setOperateType = ref<fileOperateType>("")

const selectedPathItem = ref<DatType.DirItem | null>(null);
const selectedItem = ref<DatType.DirTreeItem | null>(null);
watch(selectedItem, (newValue: DatType.DirTreeItem | null) => {
    if (null == newValue) {
        return;
    }
    logger.debug('选中项已更新:', newValue);
    selectedPathItem.value = newValue.dirInfo
});

const dirTrees = computed(() => {
    return appStore.DirTrees;
});

const selectedFileCount = computed(() => {
    return appStore.curFiles.filter(f => f.checked).length;
});

const selectedDirCount = computed(() => {
    return appStore.curDirs.filter(d => d.checked).length;
});

const selectedTotalSize = computed(() => {
    const totalSize = appStore.curFiles
        .filter(f => f.checked)
        .reduce((sum, f) => sum + f.size, 0);
    return Utils.gen_size_str(totalSize);
});

const canOperate = computed(() => {
    return selectedPathItem.value && 
           (selectedFileCount.value > 0 || selectedDirCount.value > 0);
});

class FileMoveReq {
    bNeedSure: boolean = true;
    bAllFileCover: boolean = false;
    fileIdsCover: number[] = [];
}

const confirmMove = async (fileMoveReq: Partial<FileMoveReq> | null): Promise<DatType.Resp> => {
    const respOp: DatType.Resp = new DatType.Resp();

    isDialogVisibleFileExist.value = false;
    sureDialogContentFileExist.value = ``

    const bNeedSure = fileMoveReq?.bNeedSure ?? true;
    if (selectedPathItem.value == null) {
        Utils.message_notify({ content: t('transfer.selectTargetPath'), type: 'warning' })
        return { ...respOp, code: DatType.Code.Err };
    }
    const selectedPath = selectedPathItem.value?.path;
    if (!selectedPath) {
        Utils.message_notify({ content: t('transfer.selectTargetPath'), type: 'warning' })
        return { ...respOp, code: DatType.Code.Err };
    }
    const req: DatType.FilePathChgReq = {
        fileIds: [],
        dirIds: [],
        distPath: selectedPath,
        distRootPathId: 0,
        srcRootPathId: 0,
        type: 'move',
        bNeedSure: bNeedSure,
        bAllFileCover: fileMoveReq?.bAllFileCover ?? false,
        fileIdsCover: fileMoveReq?.fileIdsCover ?? [],
    };

    for (const item of appStore.curFiles) {
        if (item.checked) {
            req.fileIds.push(item.id)
        }
    }

    if (req.bAllFileCover && curResp?.data?.items) {
        for (const item of curResp.data.items) {
            if (item.code == DatType.Code.FileAlreadyExist) {
                req.fileIdsCover.push(item.id)
            }
            if (item.code == DatType.Code.Success) {
                req.fileIds.slice(req.fileIds.indexOf(item.id), 1)
            }
        }
    }
    if (req.bAllFileCover) {
        if (curResp?.data?.remainFileIds) {
            req.fileIds = curResp.data.remainFileIds
        }
    }

    for (const item of appStore.curDirs) {
        if (item.checked) {
            const srcDir = item.path;
            const distDir = selectedPathItem.value?.path;
            if (distDir.startsWith(srcDir)) {
                Utils.message_notify({ content: t('transfer.cannotSelectSubDir'), type: 'warning' })
                return { ...respOp, code: DatType.Code.Err };
            }
            req.dirIds.push(item.id)
        }
    }
    if (req.fileIds.length == 0 && req.dirIds.length == 0) {
        Utils.message_notify({ content: t('operation.selectFiles'), type: 'warning' })
        return { ...respOp, code: DatType.Code.Err };
    }
    if (setOperateType.value == '') {
        Utils.message_notify({ content: t('transfer.selectOperateType'), type: 'warning' })
        return { ...respOp, code: DatType.Code.Err };
    }
    else {
        req.type = setOperateType.value
    }
    const resp = await Utils.files_path_chg(req)
    logger.debug("files path change result:", resp)
    switch (resp.code) {
        case DatType.Code.Success:
            isDialogVisibleFileExist.value = false;
            sureDialogContentFileExist.value = ``
            if (resp.data?.bNeedSure == true) {
                isSureDialogVisible.value = true;
                const respDirInfo = new DatType.DirInfo();
                for (const item of resp.data.dirInfos) {
                    respDirInfo.count += item.count;
                    respDirInfo.dirCount += item.dirCount;
                    respDirInfo.size += item.size;
                }
                const fileTotalSizeStr = Utils.gen_size_str(respDirInfo.size)
                sureDialogContent.value = `${t('transfer.files')}: ${respDirInfo.count} ${t('transfer.count')}, ${t('transfer.folders')}: ${respDirInfo.dirCount} ${t('transfer.count')}, ${t('transfer.totalSize')}: ${fileTotalSizeStr}`
            }
            break;
        case DatType.Code.FileAlreadyExist: {
            isDialogVisibleFileExist.value = true;
            sureDialogContentFileExist.value = `${t('transfer.fileExist')}: ${resp.status}`
            curResp = resp
            break;
        }
        default: {
            isDialogVisibleFileExist.value = false;
            sureDialogContentFileExist.value = ``
            Utils.message_notify({ content: `${t('transfer.operationFailed')}: ${resp.status} `, type: 'error' })
        }
    }
    return respOp;

};

const isSureDialogVisible = ref(false);
const sureDialogContent = ref<string>('');

async function btnclk_sureDialog_confirm(bSure: boolean) {
    logger.debug(`sure: ${bSure} `, typeof (bSure))
    if (bSure) {
        const resp = await confirmMove({ bNeedSure: true, bAllFileCover: false })
        logger.debug(resp)
    }
    else {
        Utils.message_notify({ content: t('transfer.operationCancelled'), type: 'info' })
    }
    isSureDialogVisible.value = false;
}

const isDialogVisibleFileExist = ref(false);
const sureDialogContentFileExist = ref<string>('');
let curResp: DatType.Resp<DatType.FilePathChgResp> | null = null;
async function btnclk_fileExistDialog_confirm(bSure: boolean) {
    logger.debug(`sure file cover: ${bSure} `, typeof (bSure))
    if (bSure) {
        await confirmMove({ bNeedSure: false, bAllFileCover: true })
    }
    else {
        Utils.message_notify({ content: t('transfer.operationCancelled'), type: 'info' })
        isDialogVisibleFileExist.value = false;
    }
}

const btn_page_close = () => {
    appStore.bPageFileTransfer = false
}

const btn_page_save = (opType: fileOperateType = "") => {
    setOperateType.value = opType
    confirmMove(null)
    appStore.bPageFileTransfer = false
}
</script>

<style scoped>
.file-transfer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
}

.file-transfer-container {
    background-color: var(--xc-background-color);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.transfer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--xc-border-color);
    background-color: var(--xc-background-color);
}

.header-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-icon {
    font-size: 24px;
}

.header-title h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--xc-text-color);
}

.close-button {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
    color: var(--xc-text-color-secondary);
}

.close-button:hover {
    background-color: var(--xc-background-color-hover);
    color: var(--xc-text-color);
}

.transfer-content {
    flex: 1;
    display: flex;
    gap: 20px;
    padding: 20px 24px;
    overflow: hidden;
}

.directory-section,
.preview-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: 8px;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background-color: var(--xc-background-color-hover);
    border-bottom: 1px solid var(--xc-border-color);
}

.section-icon {
    font-size: 18px;
}

.section-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--xc-text-color);
}

.directory-tree-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
}

.selected-path {
    padding: 12px 16px;
    background-color: var(--xc-primary-color);
    color: white;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.path-label {
    font-weight: 500;
}

.path-value {
    font-family: monospace;
}

.preview-stats {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background-color: var(--xc-background-color-hover);
    border-radius: 6px;
}

.stat-icon {
    font-size: 20px;
}

.stat-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-label {
    font-size: 12px;
    color: var(--xc-text-color-secondary);
}

.stat-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--xc-text-color);
}

.operation-type {
    padding: 16px;
    border-top: 1px solid var(--xc-border-color);
}

.type-label {
    display: block;
    margin-bottom: 12px;
    font-size: 13px;
    font-weight: 500;
    color: var(--xc-text-color-secondary);
}

.type-buttons {
    display: flex;
    gap: 12px;
}

.type-btn {
    flex: 1;
    padding: 12px;
    border: 2px solid var(--xc-border-color);
    border-radius: 6px;
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.type-btn:hover {
    border-color: var(--xc-primary-color);
}

.type-btn.move.active {
    background-color: var(--xc-primary-color);
    border-color: var(--xc-primary-color);
    color: white;
}

.type-btn.copy.active {
    background-color: #52C41A;
    border-color: #52C41A;
    color: white;
}

.transfer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--xc-border-color);
    background-color: var(--xc-background-color);
}

.btn-secondary,
.btn-primary {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-secondary {
    background-color: var(--xc-button-bg-color);
    color: var(--xc-text-color);
}

.btn-secondary:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.btn-primary {
    color: white;
}

.btn-primary.move {
    background-color: var(--xc-primary-color);
}

.btn-primary.move:hover:not(:disabled) {
    background-color: var(--xc-primary-color-dark, #3A5A8A);
}

.btn-primary.copy {
    background-color: #52C41A;
}

.btn-primary.copy:hover:not(:disabled) {
    background-color: #389e0d;
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-icon {
    font-size: 16px;
}

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.2s ease;
}

.dialog-card {
    background-color: var(--xc-background-color);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 480px;
    overflow: hidden;
    animation: slideIn 0.3s ease;
}

.dialog-card.warning {
    border: 2px solid #FAAD14;
}

.dialog-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    background-color: var(--xc-background-color-hover);
    border-bottom: 1px solid var(--xc-border-color);
}

.dialog-icon {
    font-size: 24px;
}

.dialog-header h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--xc-text-color);
}

.dialog-content {
    padding: 24px;
}

.dialog-message {
    margin: 0 0 16px 0;
    font-size: 15px;
    color: var(--xc-text-color);
}

.dialog-details {
    padding: 16px;
    background-color: var(--xc-background-color-hover);
    border-radius: 6px;
}

.detail-item {
    display: flex;
    gap: 8px;
    font-size: 14px;
}

.detail-label {
    color: var(--xc-text-color-secondary);
}

.detail-value {
    color: var(--xc-text-color);
    font-weight: 500;
}

.conflict-info {
    padding: 16px;
    background-color: #FFF7E6;
    border: 1px solid #FFD591;
    border-radius: 6px;
}

.conflict-info p {
    margin: 0;
    font-size: 14px;
    color: #D48806;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--xc-border-color);
    background-color: var(--xc-background-color);
}

.btn-cancel,
.btn-confirm,
.btn-warning {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel {
    background-color: var(--xc-button-bg-color);
    color: var(--xc-text-color);
}

.btn-cancel:hover {
    background-color: var(--xc-button-bg-color-hover);
}

.btn-confirm {
    background-color: var(--xc-primary-color);
    color: white;
}

.btn-confirm:hover {
    background-color: var(--xc-primary-color-dark, #3A5A8A);
}

.btn-warning {
    background-color: #FF4D4F;
    color: white;
}

.btn-warning:hover {
    background-color: #D9363E;
}

.progress-section {
    margin: 20px 24px;
    padding: 16px;
    background-color: var(--xc-background-color);
    border: 1px solid var(--xc-border-color);
    border-radius: 8px;
}

.progress-content {
    margin-top: 12px;
}

.progress-bar-container {
    width: 100%;
    height: 8px;
    background-color: var(--xc-background-color-hover);
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--xc-primary-color), var(--xc-primary-color-dark, #3A5A8A));
    border-radius: 4px;
    transition: width 0.3s ease;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    font-size: 13px;
}

.progress-status {
    color: var(--xc-text-color-secondary);
}

.progress-percent {
    color: var(--xc-primary-color);
    font-weight: 600;
}

@media (max-width: 768px) {
    .transfer-content {
        flex-direction: column;
    }
    
    .directory-section,
    .preview-section {
        max-height: 300px;
    }
    
    .preview-stats {
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .stat-item {
        flex: 1;
        min-width: 140px;
    }
}
</style>
