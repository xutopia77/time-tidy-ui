<template>
    <div class="page-view">
        <div class="page-header">
            <p>文件操作</p>
            <button class="page-close-button" @click="btn_page_close">&times;</button>
        </div>

        <div class="page-content">
            <div class="dirtree-content xc-scrollbar">
                <DirTreeItem :data="dirTrees" v-model="selectedItem" />
            </div>
            <div class="operate-content">
                <p class="info-content">选择目标路径:{{ selectedPathItem != null ? selectedPathItem.path : "" }}</p>
            </div>
            <div class="sure-dialog" v-if="isSureDialogVisible">
                <div>
                    <p> {{ sureDialogContent }} </p>
                    <button @click="btnclk_sureDialog_confirm(true)" class="xc-button">确定</button>
                    <button @click="btnclk_sureDialog_confirm(false)" class="xc-button">取消</button>
                </div>
            </div>
            <div class="sure-dialog" v-if="isDialogVisibleFileExist">
                <div>
                    <p> {{ sureDialogContentFileExist }} </p>
                    <button @click="btnclk_fileExistDialog_confirm(true)" class="xc-button">覆盖</button>
                    <button @click="btnclk_fileExistDialog_confirm(false)" class="xc-button">取消</button>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <button class="page-save-button" @click="btn_page_save('move')">移动</button>
            <button class="page-save-button" @click="btn_page_save('copy')">复制</button>
            <button class="cancel-button" @click="btn_page_close">取消</button>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
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
    console.log('选中项已更新:', newValue);
    // Utils.dir_slt_update(newValue)
    selectedPathItem.value = newValue.dirInfo
});

const dirTrees = computed(() => {
    return appStore.DirTrees;
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
        Utils.message_notify({ content: '请选择目标路径', type: 'success' })
        return { ...respOp, code: DatType.Code.Err };
    }
    const selectedPath = selectedPathItem.value?.path;
    if (!selectedPath) {
        Utils.message_notify({ content: '请选择目标路径', type: 'success' })
        return { ...respOp, code: DatType.Code.Err };
    }
    const req: DatType.FilePathChgReq = {
        fileIds: [],
        dirIds: [],
        distPath: selectedPath,
        distRootPathId: selectedPathItem.value.rootPathId,
        srcRootPathId: 0,
        type: 'move',
        bNeedSure: bNeedSure,
        bAllFileCover: fileMoveReq?.bAllFileCover ?? false,
        fileIdsCover: fileMoveReq?.fileIdsCover ?? [],
    };

    for (const item of appStore.curFiles) {
        if (item.checked) {
            req.fileIds.push(item.id)
            req.srcRootPathId = item.rootPathId
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
                Utils.message_notify({ content: '不能选择子目录', type: 'success' })
                return { ...respOp, code: DatType.Code.Err };
            }
            req.dirIds.push(item.id)
            req.srcRootPathId = item.rootPathId
        }
    }
    if (req.fileIds.length == 0 && req.dirIds.length == 0) {
        Utils.message_notify({ content: '请选择要操作的文件', type: 'success' })
        return { ...respOp, code: DatType.Code.Err };
    }
    if (setOperateType.value == '') {
        Utils.message_notify({ content: '请选择操作类型', type: 'success' })
        return { ...respOp, code: DatType.Code.Err };
    }
    else {
        req.type = setOperateType.value
    }
    const resp = await Utils.files_path_chg(req)
    console.log("files path change result:", resp)
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
                sureDialogContent.value = `file count: ${respDirInfo.count}, dir count: ${respDirInfo.dirCount}, file size: ${fileTotalSizeStr}`
            }
            break;
        case DatType.Code.FileAlreadyExist: {
            isDialogVisibleFileExist.value = true;
            sureDialogContentFileExist.value = `文件已存在: ${resp.status}`
            curResp = resp
            break;
        }
        default: {
            isDialogVisibleFileExist.value = false;
            sureDialogContentFileExist.value = ``
            Utils.message_notify({ content: `文件操作失败: ${resp.status} `, type: 'success' })
        }
    }
    return respOp;

};

// ------
const isSureDialogVisible = ref(false);
const sureDialogContent = ref<string>('');

async function btnclk_sureDialog_confirm(bSure: boolean) {
    console.log(`sure: ${bSure} `, typeof (bSure))
    if (bSure) {
        const resp = await confirmMove({ bNeedSure: true, bAllFileCover: false })
        console.log(resp)
    }
    else {
        Utils.message_notify({ content: '操作已取消', type: 'success' })
    }
    isSureDialogVisible.value = false;
}

const isDialogVisibleFileExist = ref(false);
const sureDialogContentFileExist = ref<string>('');
let curResp: DatType.Resp<DatType.FilePathChgResp> | null = null;
async function btnclk_fileExistDialog_confirm(bSure: boolean) {
    console.log(`sure file cover: ${bSure} `, typeof (bSure))
    if (bSure) {
        await confirmMove({ bNeedSure: false, bAllFileCover: true })
    }
    else {
        Utils.message_notify({ content: '操作已取消', type: 'success' })
        isDialogVisibleFileExist.value = false;
    }
}

// 关闭转移界面
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
.page-view {
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    /* display: flex; */
    /* flex-direction: column; */
    overflow: hidden;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: var(--xc-border);
}

.page-header p {
    margin: 0;
    color: #333;
}

.page-close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.page-close-button:hover {
    background-color: var(--xc-background-color-hover);
}

.page-content {
    padding: 20px;
    /* display: flex; */
    height: calc(100% - 40px - 40px - 30px - 80px);
}

.dirtree-content {
    width: calc(100% - 0px);
    height: calc(100% - 40px);
    margin: 0;
    padding: 0;
    overflow: auto;
    text-align: center;
    overflow-x: hidden;
}

.page-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: var(--xc-border);
}

.page-save-button,
.cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.page-save-button {
    background-color: #28a745;
    color: white;
}

.page-save-button:hover {
    background-color: #218838;
}

.cancel-button {
    background-color: #6c757d;
    color: white;
}

.cancel-button:hover {
    background-color: #5a6268;
}

.operate-content {
    width: 100%;
    height: 40px;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-end;
    background-color: var(--xc-background-color-hover);
    font-size: small;
    /* border-radius: 14px; */
}

.info-content {
    margin: 0px;
    padding: 0px;
    padding-right: 16px;
}

.sure-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>