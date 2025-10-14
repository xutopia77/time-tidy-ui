<template>
    <div class="file-transfer-view">
        <div class="transfer-header">
            <h2>文件转移工具</h2>
            <button class="close-button" @click="closeTransfer">&times;</button>
        </div>

        <div class="transfer-content">
            <!-- 路径选择区域 -->
            <div class="path-selection">
                <div class="path-item">
                    <label>源目录:</label>
                    <div class="path-input-container">
                        <input type="text" v-model="sourcePath" placeholder="请选择源目录" readonly />
                        <button @click="selectSourcePath">选择</button>
                    </div>
                </div>

                <div class="path-item">
                    <label>目标目录:</label>
                    <div class="path-input-container">
                        <input type="text" v-model="destinationPath" placeholder="请选择目标目录" readonly />
                        <button @click="selectDestinationPath">选择</button>
                    </div>
                </div>
            </div>

            <!-- 文件列表区域 -->
            <div class="file-list-section">
                <div class="file-list-header">
                    <h3>文件列表</h3>
                    <div class="file-actions">
                        <button @click="selectAll" :disabled="isTransferring">全选</button>
                        <button @click="clearSelection" :disabled="isTransferring">清空</button>
                    </div>
                </div>

                <div class="file-list-container">
                    <div v-for="file in sourceFiles" :key="file.name" class="file-item"
                        :class="{ selected: selectedFiles.includes(file.name) }"
                        @click="toggleFileSelection(file.name)">
                        <div class="file-info">
                            <span class="file-icon">{{ getFileIcon(file.type) }}</span>
                            <span class="file-name">{{ file.name }}</span>
                            <span class="file-size">{{ formatFileSize(file.size) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 转移操作区域 -->
            <div class="transfer-actions">
                <button class="transfer-button" @click="transferFiles"
                    :disabled="selectedFiles.length === 0 || isTransferring">
                    {{ isTransferring ? `转移中... (${progress.toFixed(0)}%)` : '开始转移' }}
                </button>

                <!-- 进度条 -->
                <div v-if="isTransferring" class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                    </div>
                    <div class="progress-text">
                        已转移: {{ transferredFiles }} / {{ selectedFiles.length }} 个文件
                    </div>
                </div>
            </div>

            <!-- 日志区域 -->
            <div v-if="transferLog.length > 0" class="log-section">
                <h3>转移日志</h3>
                <div class="log-container">
                    <div v-for="(log, index) in transferLog" :key="index" class="log-item" :class="log.type">
                        <span class="log-icon">{{ getLogIcon(log.type) }}</span>
                        <span class="log-message">{{ log.message }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import Utils from '@/utils/utils'
// import * as DatType from '@/utils/dataTypedef'
import { useAppStore } from '@/stores/AppStore';
const appStore = useAppStore()
import '@/assets/common.css'
// 文件信息接口
interface FileInfo {
    name: string
    size: number
    type: 'file' | 'folder'
}

// 日志信息接口
interface LogEntry {
    type: 'success' | 'error' | 'info'
    message: string
}

// const appStore = useAppStore()

// // 定义 emit 事件
// const emit = defineEmits<{
//     (e: 'close'): void
// }>()

// 响应式数据
const sourcePath = ref('')
const destinationPath = ref('')
const sourceFiles = ref<FileInfo[]>([
    { name: '文档.txt', size: 1024, type: 'file' },
    { name: '图片.jpg', size: 204800, type: 'file' },
    { name: '视频.mp4', size: 10485760, type: 'file' },
    { name: '项目文件夹', size: 512000, type: 'folder' },
    { name: '报告.pdf', size: 2048000, type: 'file' },
    { name: '数据.xlsx', size: 51200, type: 'file' }
])
const selectedFiles = ref<string[]>([])
const isTransferring = ref(false)
const progress = ref(0)
const transferredFiles = ref(0)
const transferLog = ref<LogEntry[]>([])

// 选择源目录（模拟）
const selectSourcePath = () => {
    sourcePath.value = 'C:\\Users\\Example\\Source'
    // appStore.addToast('源目录已选择', 'info')
}

// 选择目标目录（模拟）
const selectDestinationPath = () => {
    destinationPath.value = 'D:\\Users\\Example\\Destination'
    // appStore.addToast('目标目录已选择', 'info')
}

// 获取文件图标
const getFileIcon = (type: string) => {
    return type === 'folder' ? '📁' : '📄'
}

// 获取日志图标
const getLogIcon = (type: string) => {
    switch (type) {
        case 'success': return '✅'
        case 'error': return '❌'
        case 'info': return 'ℹ️'
        default: return 'ℹ️'
    }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 切换文件选择
const toggleFileSelection = (fileName: string) => {
    const index = selectedFiles.value.indexOf(fileName)
    if (index > -1) {
        selectedFiles.value.splice(index, 1)
    } else {
        selectedFiles.value.push(fileName)
    }
}

// 全选
const selectAll = () => {
    selectedFiles.value = sourceFiles.value.map(file => file.name)
    // appStore.addToast('已选择所有文件', 'info')
}

// 清空选择
const clearSelection = () => {
    selectedFiles.value = []
    // appStore.addToast('已清空选择', 'info')
}

// 转移文件（模拟）
const transferFiles = () => {
    if (selectedFiles.value.length === 0) {
        // appStore.addToast('请选择要转移的文件', 'warning')
        return
    }

    isTransferring.value = true
    progress.value = 0
    transferredFiles.value = 0
    transferLog.value = []

    // appStore.addToast(`开始转移 ${selectedFiles.value.length} 个文件`, 'info')

    // 模拟转移过程
    const totalFiles = selectedFiles.value.length
    let transferred = 0

    const transferInterval = setInterval(() => {
        transferred++
        transferredFiles.value = transferred
        progress.value = (transferred / totalFiles) * 100

        // 添加日志
        const fileName = selectedFiles.value[transferred - 1]
        transferLog.value.push({
            type: 'success',
            message: `已转移: ${fileName}`
        })

        if (transferred >= totalFiles) {
            clearInterval(transferInterval)
            isTransferring.value = false
            transferLog.value.push({
                type: 'info',
                message: '所有文件转移完成'
            })
            // appStore.addToast('文件转移完成', 'success')
        }
    }, 500)
}

// 关闭转移界面
const closeTransfer = () => {
    // emit('close')
    appStore.bPageFileTransfer = false
}
</script>

<style scoped>
.file-transfer-view {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.transfer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #f8f9fa;
}

.transfer-header h2 {
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

.transfer-content {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.path-selection {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.path-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.path-item label {
    font-weight: 500;
    color: #333;
}

.path-input-container {
    display: flex;
    gap: 10px;
}

.path-input-container input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
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

.file-list-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.file-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.file-list-header h3 {
    margin: 0;
    color: #333;
}

.file-actions {
    display: flex;
    gap: 10px;
}

.file-actions button {
    padding: 6px 12px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}

.file-actions button:hover {
    background-color: #5a6268;
}

.file-actions button:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
}

.file-list-container {
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
}

.file-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;
}

.file-item:last-child {
    border-bottom: none;
}

.file-item:hover {
    background-color: #f8f9fa;
}

.file-item.selected {
    background-color: #e3f2fd;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.file-icon {
    font-size: 16px;
}

.file-name {
    flex: 1;
    font-size: 14px;
}

.file-size {
    color: #666;
    font-size: 13px;
}

.transfer-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.transfer-button {
    padding: 12px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: background-color 0.2s;
}

.transfer-button:hover:not(:disabled) {
    background-color: #218838;
}

.transfer-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.progress-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background-color: #e9ecef;
    border-radius: 5px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 14px;
    color: #666;
    text-align: center;
}

.log-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.log-section h3 {
    margin: 0;
    color: #333;
}

.log-container {
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 150px;
    overflow-y: auto;
    padding: 10px;
}

.log-item {
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.log-item:last-child {
    margin-bottom: 0;
}

.log-item.success {
    background-color: rgba(40, 167, 69, 0.1);
    color: #155724;
}

.log-item.error {
    background-color: rgba(220, 53, 69, 0.1);
    color: #721c24;
}

.log-item.info {
    background-color: rgba(23, 162, 184, 0.1);
    color: #0c5460;
}

.log-icon {
    font-size: 14px;
}

.log-message {
    flex: 1;
}
</style>