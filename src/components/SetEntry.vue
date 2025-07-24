<template>
    <div class="set-entry">
        <div class="set-options">
            <label class="xc-label">项目路径:</label>
            <input type="text" v-model="prjPath" placeholder="输入基础路径" class="xc-input-text text-base-path" />
            <br>
            <label class="xc-label">仓库1:</label>
            <input type="text" v-model="repoPath[0].path" placeholder="输入基础路径" class="xc-input-text text-base-path" />
            <br>
            <label class="xc-label">仓库2:</label>
            <input type="text" v-model="repoPath[1].path" placeholder="输入基础路径" class="xc-input-text text-base-path" />
            <br>
            <label class="xc-label">仓库3:</label>
            <input type="text" v-model="repoPath[2].path" placeholder="输入基础路径" class="xc-input-text text-base-path" />
            <br>
            <button title="创建项目" @click="btnclk_set([DatType.PrjSetType.Create])" class="xc-button">创建项目</button>
            <button title="打开项目" @click="btnclk_set([DatType.PrjSetType.Open])" class="xc-button">打开项目</button>
            <input type="checkbox" class="xc-checkbox" v-model="bPrjSetGenThumb" />
            <label class="xc-label">生成缩略图</label>
            <input type="checkbox" class="xc-checkbox" v-model="bPrjSetScanExif" />
            <label class="xc-label">提取元信息</label>
            <input type="checkbox" class="xc-checkbox" v-model="bPrjSetGenHash" />
            <label class="xc-label">生成摘要</label>

            <button title="同步项目下的文件信息" @click="btnclk_set()" class="xc-button">同步项目</button>
            <br>
            <button title="数据健康度检查" @click="btnclk_detect_health" class="xc-button">数据检查</button>
            <button title="清理日志" @click="btnclk_clean_log" class="xc-button">清空日志</button>
        </div>
        <div class="set-log">
            <SetEntryLog />
        </div>
        <!-- <div>
            <pre>{{ appStore.heartbeat.status }}
            </pre>
        </div> -->
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
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
const repoPath = ref<DatType.Repo[]>([{ path: '' }, { path: '' }, { path: '' }])

// ------------------------------------
const bPrjSetGenThumb = ref(false)
const bPrjSetScanExif = ref(false)
const bPrjSetGenHash = ref(false)

function btnclk_set(types: DatType.PrjSetType[] = []) {
    const req: DatType.PrjSetReq = new DatType.PrjSetReq()
    if (types.length > 0) {
        req.type = types
        if (types.length == 1) {
            if (DatType.PrjSetType.Create == types[0]) {
                req.prj.path = Utils.convertToLinuxPath(prjPath.value)
                for (const repo of repoPath.value) {
                    if (repo.path != '') { req.prj.repo.push(repo) }
                }
            } else if (DatType.PrjSetType.Open == types[0]) { }
        }
    }
    else {
        if (bPrjSetGenThumb.value) { req.type.push(DatType.PrjSetType.GenThumb) }
        if (bPrjSetScanExif.value) { req.type.push(DatType.PrjSetType.ScanExif) }
        if (bPrjSetGenHash.value) { req.type.push(DatType.PrjSetType.GenHash) }
        req.prj.path = Utils.convertToLinuxPath(prjPath.value)
        for (const repo of repoPath.value) {
            if (repo.path != '') { req.prj.repo.push(repo) }
        }
    }
    Utils.project_set(req)
}

onMounted(() => {
    prjPath.value = appStore.prj.path == null ? "" : appStore.prj.path
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
    padding: 0;
}

.set-log {
    width: 40%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.text-base-path {
    width: calc(80% - 60px);
}
</style>