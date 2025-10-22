<template>
    <div class="set-entry">
        <div class="set-options">
            <label class="xc-label">项目路径:</label>
            <input type="text" v-model="prjPath" placeholder="输入项目路径" class="xc-input-text text-base-path" />
            <br>
            <label class="xc-label">仓库1:</label>
            <input type="text" v-model="repoPath[0].path" placeholder="输入仓库路径" class="xc-input-text text-base-path" />
            <br>
            <label class="xc-label">仓库2:</label>
            <input type="text" v-model="repoPath[1].path" placeholder="输入仓库路径" class="xc-input-text text-base-path" />
            <br>
            <label class="xc-label">仓库3:</label>
            <input type="text" v-model="repoPath[2].path" placeholder="输入仓库路径" class="xc-input-text text-base-path" />
            <br>
            <button title="创建项目" @click="btnclk_set([DatType.PrjSetType.Create])" class="xc-button">创建项目</button>
            <button title="打开项目" @click="btnclk_set([DatType.PrjSetType.Open])" class="xc-button">打开项目</button>
            <br>
            <input type="checkbox" class="xc-checkbox" v-model="bPrjSetSave" />
            <label class="xc-label">保存项目信息</label>
            <input type="checkbox" class="xc-checkbox" v-model="bPrjSetSync" />
            <label class="xc-label">同步仓库文件信息</label>
            <input type="checkbox" class="xc-checkbox" v-model="bPrjSetGenThumb" />
            <label class="xc-label">生成缩略图</label>
            <input type="checkbox" class="xc-checkbox" v-model="bPrjSetScanExif" />
            <label class="xc-label">提取元信息</label>
            <input type="checkbox" class="xc-checkbox" v-model="bPrjSetGenHash" />
            <label class="xc-label">生成摘要</label>

            <button title="同步项目下的文件信息" @click="btnclk_set()" class="xc-button">同步项目</button>
            <br>
            <button title="数据检查" @click="btnclk_detect_health()" class="xc-button">数据检查</button>
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
watch(() => appStore.prj.repo, () => {
    for (let i = 0; i < appStore.prj.repo.length; i++) {
        repoPath.value[i] = appStore.prj.repo[i]
    }
})

// ------------------------------------
const bPrjSetGenThumb = ref(false)
const bPrjSetScanExif = ref(false)
const bPrjSetGenHash = ref(false)
const bPrjSetSave = ref(true)
const bPrjSetSync = ref(false)

async function btnclk_set(types: DatType.PrjSetType[] = []) {

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


    for (const repo of repoPath.value) {
        repo.path = Utils.convertToLinuxPath(repo.path)
    }
    const req: DatType.PrjSetReq = new DatType.PrjSetReq()
    if (types.length > 0) {
        req.type = types
        if (types.length == 1) {
            if (DatType.PrjSetType.Create == types[0]) {
                req.prj.path = Utils.convertToLinuxPath(prjPath.value)
                for (const repo of repoPath.value) {
                    if (repo.path != '') { req.prj.repo.push(repo) }
                }
            } else if (DatType.PrjSetType.Open == types[0]) {
                req.prj.path = Utils.convertToLinuxPath(prjPath.value)
            }
        }
    }
    else {
        if (bPrjSetSave.value) { req.type.push(DatType.PrjSetType.Save) }
        if (bPrjSetSync.value) { req.type.push(DatType.PrjSetType.Sync) }
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
    for (let i = 0; i < appStore.prj.repo.length; i++) {
        repoPath.value[i] = appStore.prj.repo[i]
    }
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