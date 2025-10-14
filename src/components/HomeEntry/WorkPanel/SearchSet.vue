<template>
    <div class="settings-view">
        <div class="settings-header">
            <h2>设置界面</h2>
            <button class="close-button" @click="closeSettings">&times;</button>
        </div>

        <div class="settings-content">
            <div class="setting-item">
                <label for="theme">主题:</label>
                <select id="theme" v-model="settings.theme">
                    <option value="light">浅色</option>
                    <option value="dark">深色</option>
                    <option value="auto">自动</option>
                </select>
            </div>

            <div class="setting-item">
                <label for="language">语言:</label>
                <select id="language" v-model="settings.language">
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                </select>
            </div>

            <div class="setting-item">
                <label for="defaultPath">默认路径:</label>
                <div class="path-input-container">
                    <input id="defaultPath" type="text" v-model="settings.defaultPath" placeholder="请选择默认路径" readonly />
                    <button @click="selectPath">选择</button>
                </div>
            </div>

            <div class="setting-item">
                <label class="checkbox-label">
                    <input type="checkbox" v-model="settings.autoSave" />
                    <span>自动保存</span>
                </label>
            </div>

            <div class="setting-item">
                <label for="proxy">代理设置:</label>
                <input id="proxy" type="text" v-model="settings.proxy"
                    placeholder="例如: http://proxy.example.com:8080" />
            </div>
        </div>

        <div class="settings-footer">
            <button class="save-button" @click="saveSettings">保存设置</button>
            <button class="cancel-button" @click="closeSettings">取消</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import '@/assets/common.css'
// import Utils from '@/utils/utils'
// import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()

// 定义设置数据结构
interface Settings {
    theme: 'light' | 'dark' | 'auto'
    language: 'zh' | 'en'
    defaultPath: string
    autoSave: boolean
    proxy: string
}

// const appStore = useAppStore()

// 定义 emit 事件
const emit = defineEmits<{
    (e: 'close'): void
}>()

// 初始化设置数据
const settings = reactive<Settings>({
    theme: 'light',
    language: 'zh',
    defaultPath: '',
    autoSave: true,
    proxy: ''
})

// 模拟从本地存储加载设置
const loadSettings = () => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings)
            Object.assign(settings, parsed)
        } catch (e) {
            console.error('Failed to parse settings', e)
            // appStore.addToast('加载设置失败', 'error')
        }
    }
}

// 保存设置到本地存储
const saveSettings = () => {
    try {
        localStorage.setItem('appSettings', JSON.stringify(settings))
        // appStore.addToast('设置已保存', 'success')
        emit('close')
    } catch (e) {
        console.error('Failed to save settings', e)
        // appStore.addToast('保存设置失败', 'error')
    }
}

// 选择路径（模拟）
const selectPath = () => {
    // 在实际应用中，这里会调用文件选择对话框
    settings.defaultPath = 'C:\\Users\\Example\\Documents'
    // appStore.addToast('路径已选择', 'info')
}

// 关闭设置界面
const closeSettings = () => {
    // emit('close')
    appStore.bPageSearchSetting = false
}

// 组件挂载时加载设置
onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.settings-view {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #f8f9fa;
}

.settings-header h2 {
    margin: 0;
    color: #333;
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.close-button:hover {
    background-color: #e0e0e0;
}

.settings-content {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
}

.setting-item {
    margin-bottom: 20px;
}

.setting-item label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}

.setting-item select,
.setting-item input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}

.path-input-container {
    display: flex;
    gap: 10px;
}

.path-input-container input {
    flex: 1;
}

.path-input-container button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.path-input-container button:hover {
    background-color: #0056b3;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
}

.settings-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #e0e0e0;
    background-color: #f8f9fa;
}

.save-button,
.cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.save-button {
    background-color: #28a745;
    color: white;
}

.save-button:hover {
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