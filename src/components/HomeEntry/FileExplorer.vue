<template>
    <div class="file-explorer">
        <FileNavHeader class="file-nav-header" />
        <div class="file-grid xc-scrollbar">
            <!-- 循环渲染文件和文件夹 -->
            <template v-for="(item) in items" :key="item.id">
                <ImageCard :item="item" />
            </template>
            <template v-for="item in dirs" :key="item.id">
                <!-- <hr />
                asdasdas
                <br /> -->
                <FolderCard :item="item" />
            </template>
        </div>
        <FileFooter class="file-footer" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import FileNavHeader from '@/components/HomeEntry/FileExplorer/FileNavHeader.vue';
import ImageCard from '@/components/HomeEntry/FileExplorer/ImageCard.vue';
import FolderCard from '@/components/HomeEntry/FileExplorer/FolderCard.vue';
import FileFooter from '@/components/HomeEntry/FileExplorer/FileFooter.vue';

import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'

const items = computed(() => appStore.curFiles);
const dirs = computed(() => appStore.curDirs);

// 记录 Shift 键是否按下
const isShiftPressed = ref(false);
// 记录首次点击的 ImageCard 索引
const firstCheckedIndex = ref<number | null>(null);

// 监听 Shift 键按下和释放
const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
        isShiftPressed.value = true;
    }
};

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
        isShiftPressed.value = false;
        firstCheckedIndex.value = null
    }
};

// 监听 appStore.curFiles 中 checked 状态的变化
watch(() => items.value.map(item => item.checked), (newCheckedStates, oldValue) => {
    const changedIndex = newCheckedStates.findIndex((checked, index) => {
        // 找到状态改变的项
        return oldValue[index] !== checked;
    });

    const isChecked = newCheckedStates[changedIndex];
    if (changedIndex == -1) {
        // console.log('没有发现变化', changedIndex)
        return
    }

    if (!isShiftPressed.value) {
        // console.log('变化值', changedIndex, "没有按下Shift键", isChecked)
        firstCheckedIndex.value = null
        return
    }
    if (firstCheckedIndex.value === null) {
        // console.log('变化值', changedIndex, "按下Shift键，没有首个值, 设置首个值")
        firstCheckedIndex.value = changedIndex;
        return
    }

    if (firstCheckedIndex.value === changedIndex) {
        // console.log('变化值', changedIndex, "按下Shift键，值相等")
        return
    }

    const start = Math.min(firstCheckedIndex.value, changedIndex);
    const end = Math.max(firstCheckedIndex.value, changedIndex);
    // console.log('变化值', changedIndex, "按下Shift键，值相等，区间", start, end, "新值", isChecked)
    // console.log("======", newCheckedStates)
    for (let i = start; i <= end; i++) {
        items.value[i].checked = isChecked;
    }
}, { deep: true });

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
});
</script>

<style scoped>
.file-explorer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    /* background-color: aqua; */
}

.file-nav-header {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 32px;
    /* background-color: aquamarine; */
}

.file-grid---delete {
    padding: 0px;
    margin: 0px;
    /* display: flex;
    flex-wrap: wrap; */

    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    height: calc(100% - 32px - 32px);
    /* background-color: bisque; */
}

.file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
}



/* .file-grid hr {
    display: block;
    margin: 10px 0;
    border: none;
    border-top: 1px solid #ccc;
    width: 100%;
} */


.file-footer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 32px;
}
</style>