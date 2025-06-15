<template>
    <div class="move-file-container">
        <div class="dirtree-content xc-scrollbar">
            <DirTreeItem :data="dirTrees" v-model="selectedItem" />
        </div>
        <div class="operate-content">
            <p class="info-content">选择目标路径:{{ selectedPathItem != null ? selectedPathItem.path : "" }}</p>
            <button class="xc-button" @click="btnclk_confirmMove" :disabled="!selectedPathItem">
                确认
            </button>
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
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
// import axios from 'axios';
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'
import DirTreeItem from '@/components/HomeEntry/WorkPanel/DirTreeItem.vue'

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

const confirmMove = async (fileMoveReq: Partial<FileMoveReq> | null) => {

    isDialogVisibleFileExist.value = false;
    sureDialogContentFileExist.value = ``

    const bNeedSure = fileMoveReq?.bNeedSure ?? true;
    if (selectedPathItem.value == null) {
        Utils.message_notify({ content: '请选择目标路径' })
        return;
    }
    const selectedPath = selectedPathItem.value?.path;
    if (!selectedPath) {
        Utils.message_notify({ content: '请选择目标路径' })
        return;
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
                Utils.message_notify({ content: '不能选择子目录' })
                return;
            }
            req.dirIds.push(item.id)
            req.srcRootPathId = item.rootPathId
        }
    }
    if (req.fileIds.length == 0 && req.dirIds.length == 0) {
        Utils.message_notify({ content: '请选择要操作的文件' })
        return;
    }
    if (appStore.setOperateType == 'files_move') {
        req.type = 'move'
    }
    else if (appStore.setOperateType == 'files_cpy') {
        req.type = 'copy'
    }
    else {
        Utils.message_notify({ content: '请选择操作类型' })
        return;
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
            Utils.message_notify({ content: `文件操作失败: ${resp.status} ` })
        }
    }


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
        Utils.message_notify({ content: '操作已取消' })
    }
    isSureDialogVisible.value = false;
}

function btnclk_confirmMove() {
    confirmMove(null)
}

// ------
const isDialogVisibleFileExist = ref(false);
const sureDialogContentFileExist = ref<string>('');
let curResp: DatType.Resp<DatType.FilePathChgResp> | null = null;
async function btnclk_fileExistDialog_confirm(bSure: boolean) {
    console.log(`sure file cover: ${bSure} `, typeof (bSure))
    if (bSure) {
        await confirmMove({ bNeedSure: false, bAllFileCover: true })
    }
    else {
        Utils.message_notify({ content: '操作已取消' })
        isDialogVisibleFileExist.value = false;
    }
}
</script>

<style scoped>
.move-file-container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    color: var(--xc-text-color);
    background-color: var(--xc-background-color);
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

.operate-content {
    width: 100%;
    height: 40px;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-end;
    background-color: var(--xc-background-color-hover);
    border-radius: 14px;
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