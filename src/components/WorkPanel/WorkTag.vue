<template>
    <div>
        <!-- 标签输入框 -->
        <input v-model="newTag" @keyup.enter="addTag" placeholder="输入新标签并按回车键添加" class="tag-input" />
        <!-- 循环渲染标签列表 -->
        <div v-for="(tag, index) in tags" :key="index" class="tag">
            {{ tag }}
            <!-- 删除标签按钮 -->
            <button @click="removeTag(index)" class="delete-btn">×</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义标签列表
const tags = ref(['标签1', '标签2', '标签3', '标签4', '标签5']);
// 新标签输入值
const newTag = ref('');

// 添加标签方法
const addTag = () => {
    if (newTag.value.trim()) {
        tags.value.push(newTag.value.trim());
        newTag.value = '';
    }
};

// 删除标签方法
const removeTag = (index: number) => {
    tags.value.splice(index, 1);
};
</script>

<style scoped>
.tag-input {
    padding: 4px 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
}

.tag {
    display: inline-block;
    margin: 4px;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f5f5f5;
    transition: all 0.3s;
}

.delete-btn {
    margin-left: 8px;
    padding: 0 4px;
    border: none;
    background: none;
    cursor: pointer;
    color: #ff4444;
    font-weight: bold;
}

.delete-btn:hover {
    color: #cc0000;
}
</style>