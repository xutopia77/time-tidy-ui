<template>
    <div class="set-entry">
        <!-- 使用 v-model 绑定输入框的值到 basePath 变量 -->
        <input type="text" v-model="basePath" placeholder="Set base folder" />
        <button @click="btnclk_set">Set</button>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import axios from 'axios';
import * as DatType from '@/utils/dataTypedef';

// 使用 ref 创建响应式变量来存储输入框的值
const basePath = ref('');

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