<template>
    <div>
        <!-- 新增过滤条件选择项 -->
        <label>
            排序依据:
            <select v-model="sortBy">
                <option value="">默认</option>
                <option value="name">名称</option>
                <option value="size">大小</option>
                <option value="time">时间</option>
                <option value="type">类型</option>
            </select>
        </label>
        <label>
            排序顺序:
            <select v-model="sortOrder">
                <option value="asc">升序</option>
                <option value="desc">降序</option>
            </select>
        </label>
        <hr>
        <button @click="btnclk_operate_file('files_move')">移动</button>
        <button @click="btnclk_operate_file('files_cpy')">复制</button>
        <button @click="btnclk_delete_file">删除</button>

    </div>
</template>

<script setup lang="ts">
import Utils from '@/utils/utils';
import * as DatType from '@/utils/dataTypedef';
import { useAppStore } from '@/stores/AppStore';
import { computed } from 'vue';
const appStore = useAppStore()

function btnclk_operate_file(op: string) {
    appStore.bShowSetting = !appStore.bShowSetting
    appStore.setOperateType = op
}

function btnclk_delete_file() {
    const req: DatType.FileDeleteReq = {
        fileIds: [],
        bRemoveToDtrash: true,
    };
    for (const item of appStore.curFiles) {
        if (item.checked) {
            req.fileIds.push(item.id)
        }
    }
    if (req.fileIds.length == 0) {
        Utils.message_notify({ content: '请选择要操作的文件' })
        return;
    }
    Utils.files_delete(req)
}

// 双向绑定 sortBy
const sortBy = computed({
    get: () => appStore.searchCon.sortBy,
    set: (newValue) => {
        appStore.searchCon.sortBy = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});

// 双向绑定 sortOrder
const sortOrder = computed({
    get: () => appStore.searchCon.sortOrder,
    set: (newValue) => {
        appStore.searchCon.sortOrder = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});
</script>

<style scoped>
/* 可以添加一些样式来美化选择框 */
button,
label {
    margin-left: 2px;
}

select {
    margin-left: 2px;
}
</style>