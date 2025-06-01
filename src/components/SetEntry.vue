<template>
    <div class="set-entry">
        <input type="text" v-model="basePath" placeholder="Set base folder" />
        <button title="添加存储或者同步存储" @click="btnclk_set">Set</button>
        <div>
            <pre>{{ appStore.heartbeat.status }}
            </pre>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import axios from 'axios';
import * as DatType from '@/utils/dataTypedef';
import Utils from '@/utils/utils';

// 使用 ref 创建响应式变量来存储输入框的值
const basePath = ref('');

watch(() => appStore.prj?.basePath, () => {
    basePath.value = appStore.prj?.basePath == null ? "" : appStore.prj.basePath
})


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
    axios.post(`${appStore.srvPrefix}/api/v1/project_set`, JSON.stringify(req))
        .then((response) => {
            console.log('file info:', response.data);
            const resp = response.data
            if (resp.code != 0) {
                Utils.message_notify({ content: resp.msg, type: "error" })
            }
            else {
                if (resp.doing == true) {
                    Utils.message_notify({ content: "设置中", type: "warning" })
                }
                else {
                    Utils.message_notify({ content: "设置完成", type: "success" })
                }
            }
        })
        .catch((error) => {
            console.error('Error fetching project info:', error);
        });
}

</script>

<style scoped>
.set-entry {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
</style>