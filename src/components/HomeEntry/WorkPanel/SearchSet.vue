<template>
    <div class="page-view">
        <div class="page-header">
            <p>设置界面</p>
            <button class="page-close-button" @click="btn_page_close">&times;</button>
        </div>

        <div class="page-content">
            <div>
                <label> 排序依据: </label>
                <select v-model="sortBy" class="xc-select">
                    <option value="">默认</option>
                    <option value="name">名称</option>
                    <option value="size">大小</option>
                    <option value="time">时间</option>
                    <option value="type">类型</option>
                </select>
                <label> 排序顺序: </label>
                <select v-model="sortOrder" class="xc-select">
                    <option value="asc">升序</option>
                    <option value="desc">降序</option>
                </select>
                <br>
                <label>文件夹:</label>
                <select v-model="pathType" class="xc-select">
                    <option value="curPath">当前路径</option>
                    <option value="allPath">所有路径</option>
                </select>
                <br>
                <label>文件类型:</label>
                <input type="checkbox" v-model="bSltVideo" class="xc-checkbox" style="vertical-align: text-top;" /> 视频
                <input type="checkbox" v-model="bSltImage" class="xc-checkbox" style="vertical-align: text-top;" /> 图片
                <input type="checkbox" v-model="bSltOther" class="xc-checkbox" style="vertical-align: text-top;" /> 其他
                <div class="tags-panel">
                    <label> 文件标签({{ curSltTagNum }}): </label>
                    <input type="checkbox" v-model="bReverseSltTag" class="xc-checkbox" /> 反选
                    <label> 无标签: </label>
                    <select v-model="bNoTag" class="xc-select">
                        <option value="">全部</option>
                        <option value="false">有标签</option>
                        <option value="true">无标签</option>
                    </select>

                    <!-- 动态绑定 selected 类 -->
                    <div v-for="(tag, index) in fileTags" :key="index" class="xc-tag"
                        :class="{ selected: isTagSelected(tag) }" :style="{ backgroundColor: tag.color }"
                        @click="btnclk_tag(tag)">
                        {{ tag.name }}
                    </div>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <button class="page-save-button" @click="btn_page_save">确定</button>
            <button class="cancel-button" @click="btn_page_close">取消</button>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { Plus, Minus } from '@icon-park/vue-next';
import { onMounted, computed, ref, watch } from 'vue'
import '@/assets/common.css'
import Utils from '@/utils/utils'
import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

// 排序依据
const sortBy = computed({
    get: () => appStore.searchCon.sortBy,
    set: (newValue) => {
        appStore.searchCon.sortBy = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});

// 搜索排序
const sortOrder = computed({
    get: () => appStore.searchCon.sortOrder,
    set: (newValue) => {
        appStore.searchCon.sortOrder = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});

// 按照文件夹搜索
const pathType = computed({
    get: () => appStore.searchCon.pathType,
    set: (newValue) => {
        appStore.searchCon.pathType = newValue;
        Utils.files_get(null);
    }
});

// ------------------------------------ file type
const bSltVideo = ref<boolean>(false);
const bSltImage = ref<boolean>(false);
const bSltOther = ref<boolean>(false);

watch([bSltVideo, bSltImage, bSltOther], () => {
    appStore.searchCon.types = [];
    if (bSltVideo.value) { appStore.searchCon.types.push(DatType.FileType.video); }
    if (bSltImage.value) { appStore.searchCon.types.push(DatType.FileType.image); }
    if (bSltOther.value) { appStore.searchCon.types.push(DatType.FileType.other); }
    Utils.files_get(null);
}
)

// 判断标签是否被选中
const isTagSelected = (tag: DatType.FileItemTag) => {
    return appStore.searchCon.tags.includes(tag.name);
};

const curSltTagNum = computed(() => {
    return appStore.searchCon.tags.length;
});

// ------------------------------------ tag
const bReverseSltTag = computed({
    get: () => appStore.searchCon.bReverseSltTag,
    set: (newValue) => {
        appStore.searchCon.bReverseSltTag = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});
const bNoTag = computed({
    get: () => appStore.searchCon.noTag,
    set: (newValue) => {
        appStore.searchCon.noTag = newValue;
        // 触发文件重新获取以应用新的排序规则
        Utils.files_get(null);
    }
});

// 点击标签处理方法
function btnclk_tag(tag: DatType.FileItemTag) {
    const tags = appStore.searchCon.tags;
    const tagIndex = tags.indexOf(tag.name);
    if (tagIndex === -1) {
        // 标签不存在则添加
        appStore.searchCon.tags.push(tag.name);
    } else {
        // 标签已存在则移除
        appStore.searchCon.tags.splice(tagIndex, 1);
    }
    // 触发文件重新获取以应用新的标签过滤条件
    Utils.files_get(null);
}

const fileTags = computed(() => {
    const bGetAllTag = true
    if (bGetAllTag) {
        const uniqueTags: DatType.FileItemTag[] = [];
        for (const item of appStore.allTags) {
            uniqueTags.push({ name: item.name, color: item.color });
        }
        return uniqueTags;
    }
    else { // 只是根据当前的文件来获取标签
        // 初始化一个 Set 用于存储不重复标签的唯一标识
        const uniqueTagKeys = new Set<string>();
        const uniqueTags: DatType.FileItemTag[] = [];

        // 遍历 appStore.curFiles
        for (const item of appStore.curFiles) {
            if (item.tags && Array.isArray(item.tags)) {
                // 遍历每个文件的 tags 数组
                for (const tag of item.tags) {
                    // 简单类型检查，确保 tag 符合 DatType.FileItemTag 基本结构
                    if (tag && typeof tag === 'object' && 'name' in tag && 'color' in tag) {
                        // 生成标签的唯一标识
                        const tagKey = `${tag.name}-${tag.color}`;
                        if (!uniqueTagKeys.has(tagKey)) {
                            uniqueTagKeys.add(tagKey);
                            uniqueTags.push(tag as DatType.FileItemTag);
                        }
                    }
                }
            }
        }
        return uniqueTags;
    }
});

// 保存设置到本地存储
const btn_page_save = () => {
    appStore.bPageSet = false
}

// 关闭设置界面
const btn_page_close = () => {
    appStore.bPageSearchSetting = false
}

// 组件挂载时加载设置
onMounted(() => {
})
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
    display: flex;
    height: calc(100% - 40px - 40px - 30px - 80px);
}

.page-content span,
label {
    margin-left: 2px;
}

.page-content input[type="range"] {
    margin-left: 2px;
    /* vertical-align: middle; */
    height: 25px;
}

.op-button {
    margin-right: 10px;
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
</style>