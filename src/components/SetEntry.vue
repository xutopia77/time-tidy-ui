<template>
    <div class="set-entry">
        <div class="set-options">
            <input type="text" v-model="basePath" placeholder="输入基础路径" class="text-base-path" />
            <button title="添加存储或者同步存储" @click="btnclk_set" class="xc-button">设置</button>
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
const basePath = ref('');

watch(() => appStore.prj?.basePath, () => {
    basePath.value = appStore.prj?.basePath == null ? "" : appStore.prj.basePath
})

function btnclk_detect_health() {
    Utils.project_health()
}

function btnclk_clean_log() {
    appStore.logInfo = ''
    Utils.message_notify({ content: "清理完成", type: "success" })
}

function btnclk_set() {
    // 定义一个函数来转换路径风格
    const convertToLinuxPath = (path: string) => {
        // 替换所有反斜杠为正斜杠
        return path.replace(/\\/g, '/');
    };
    const req: DatType.ProjectSetReq = {
        // 判断并转换路径风格
        basePath: convertToLinuxPath(basePath.value)
    };
    Utils.project_set(req)
}

onMounted(() => {
    basePath.value = appStore.prj?.basePath == null ? "" : appStore.prj.basePath
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
    width: calc(100% - 60px);
    height: var(--xc-normal-height);
    background-color: var(--xc-background-color);
    color: var(--xc-text-color);
    border: var(--xc-border);
    border-radius: 4px;
    outline: none;
    padding: var(--xc-normal-padding);
    margin: var(--xc-normal-margin);
}

.text-base-path:hover {
    background-color: var(--xc-background-color);
    /* 设置鼠标悬停时的背景颜色 */
    border: var(--xc-border-hover);
}
</style>