/**
 * API辅助工具类
 * 
 * 本文件提供了一组用于直接调用后端API的辅助方法，主要用于：
 * 1. 测试数据准备：在测试开始前创建必要的测试数据
 * 2. 测试数据清理：在测试结束后删除测试数据
 * 3. 测试结果验证：通过API验证UI操作的结果
 * 
 * 优势：
 * - 比UI操作更快，提高测试执行速度
 * - 不依赖UI实现，更加稳定可靠
 * - 可以直接操作数据，便于测试隔离
 * 
 * 使用场景：
 * - beforeEach: 准备测试数据
 * - afterEach: 清理测试数据
 * - 测试中: 验证API层面的结果
 */

import { APIRequestContext } from '@playwright/test'

/**
 * API辅助类
 * 
 * 封装了所有与后端API交互的方法，提供简洁的接口用于测试数据管理
 * 
 * @example
 * // 在测试中使用
 * test('should create a tag', async ({ request }) => {
 *   const api = new ApiHelpers(request)
 *   await api.createTag('test-tag', '#FF0000')
 * })
 */
export class ApiHelpers {
  /**
   * 构造函数
   * 
   * @param request - Playwright提供的API请求上下文
   *                  由Playwright自动注入，无需手动创建
   *                  支持HTTP请求、自动重试、超时控制等功能
   */
  constructor(private request: APIRequestContext) {}

  /**
   * 创建标签
   * 
   * 通过API创建一个新的标签，比UI操作更快更可靠
   * 
   * @param name - 标签名称，建议使用唯一标识（如时间戳）避免冲突
   * @param color - 标签颜色，十六进制格式，默认为红色 '#FF0000'
   * @returns Promise<any> - API响应数据，包含创建结果
   * 
   * @example
   * // 创建红色标签
   * await api.createTag('important', '#FF0000')
   * 
   * // 创建默认颜色标签
   * await api.createTag('test-tag')
   * 
   * @remarks
   * - id设为0表示创建新标签，后端会自动分配ID
   * - 如果标签名已存在，后端可能会返回错误
   * - 建议在测试中使用 `test-tag-${Date.now()}` 格式确保唯一性
   */
  async createTag(name: string, color: string = '#FF0000') {
    const response = await this.request.post('/api/v1/tags_set', {
      data: {
        tags: [{ id: 0, name, color }]  // id=0表示创建新标签
      }
    })
    return response.json()
  }

  /**
   * 删除标签
   * 
   * 通过标签名称删除标签，同时会删除相关的文件标签关联
   * 
   * @param name - 要删除的标签名称
   * @returns Promise<any> - API响应数据，包含删除结果
   * 
   * @example
   * // 删除测试标签
   * await api.deleteTag('test-tag')
   * 
   * @remarks
   * - 系统标签（sys_score1等）不能被删除
   * - 删除标签会同时删除file_tags表中的关联记录
   * - 如果标签不存在，后端会返回错误
   */
  async deleteTag(name: string) {
    const response = await this.request.post('/api/v1/tags_delete', {
      data: { tagName: name }
    })
    return response.json()
  }

  /**
   * 获取所有标签
   * 
   * 获取系统中所有标签的列表，用于验证或数据清理
   * 
   * @returns Promise<any> - 标签列表数据，格式为 { data: TagItem[] }
   * 
   * @example
   * // 获取所有标签
   * const tags = await api.getAllTags()
   * console.log(tags.data)  // 标签数组
   * 
   * // 查找特定标签
   * const tag = tags.data?.find(t => t.name === 'test-tag')
   * 
   * @remarks
   * - 包含系统标签和用户标签
   * - 如果解析失败，返回空数组 { data: [] }
   * - 用于测试数据清理时，建议过滤掉系统标签
   */
  async getAllTags() {
    const response = await this.request.post('/api/v1/tags_get')
    
    // 先获取文本响应，避免JSON解析错误导致测试失败
    const text = await response.text()
    
    try {
      return JSON.parse(text)
    } catch (error) {
      // 解析失败时返回空数组，避免测试中断
      console.log('Failed to parse tags response:', text)
      return { data: [] }
    }
  }

  /**
   * 创建项目
   * 
   * 创建一个新的文件管理项目，用于测试文件管理功能
   * 
   * @param name - 项目名称
   * @param path - 项目路径（文件仓库路径）
   * @returns Promise<any> - API响应数据，包含创建结果
   * 
   * @example
   * // 创建测试项目
   * await api.createProject('Test Project', 'D:/TestPhotos')
   * 
   * @remarks
   * - 项目路径需要是有效的文件系统路径
   * - 项目名称应该唯一，避免冲突
   */
  async createProject(name: string, path: string) {
    const response = await this.request.post('/api/v1/project_set', {
      data: { name, path }
    })
    return response.json()
  }

  /**
   * 获取项目信息
   * 
   * 获取当前项目的配置信息，包括仓库路径等
   * 
   * @returns Promise<any> - 项目配置数据
   * 
   * @example
   * // 获取项目信息
   * const project = await api.getProject()
   * console.log(project.repo.path)  // 仓库路径
   */
  async getProject() {
    const response = await this.request.post('/api/v1/project')
    return response.json()
  }

  /**
   * 删除文件
   * 
   * 删除指定的文件，可以选择移入回收站或永久删除
   * 
   * @param fileId - 文件ID，从数据库或API获取
   * @param removeToTrash - 是否移入回收站，默认为true
   *                        true: 移入回收站，可以恢复
   *                        false: 永久删除，不可恢复
   * @returns Promise<any> - API响应数据，包含删除结果
   * 
   * @example
   * // 移入回收站
   * await api.deleteFile(123, true)
   * 
   * // 永久删除
   * await api.deleteFile(123, false)
   * 
   * @remarks
   * - 删除文件会同时删除file_tags表中的关联记录
   * - 移入回收站的文件可以通过restoreFile恢复
   * - 永久删除的文件无法恢复
   */
  async deleteFile(fileId: number, removeToTrash: boolean = true) {
    const response = await this.request.post('/api/v1/files_delete', {
      data: { 
        fileIds: [fileId],           // 文件ID数组，支持批量删除
        bRemoveToDtrash: removeToTrash  // 是否移入回收站
      }
    })
    return response.json()
  }

  /**
   * 恢复文件
   * 
   * 从回收站恢复已删除的文件
   * 
   * @param fileId - 要恢复的文件ID
   * @returns Promise<any> - API响应数据，包含恢复结果
   * 
   * @example
   * // 恢复文件
   * await api.restoreFile(123)
   * 
   * @remarks
   * - 只能恢复在回收站中的文件
   * - 永久删除的文件无法恢复
   * - 恢复后文件会回到原来的位置
   */
  async restoreFile(fileId: number) {
    const response = await this.request.post('/api/v1/files_restore', {
      data: { fileIds: [fileId] }  // 文件ID数组，支持批量恢复
    })
    return response.json()
  }

  /**
   * 获取文件列表
   * 
   * 分页获取文件列表，用于验证文件操作结果
   * 
   * @param page - 页码，从1开始，默认为1
   * @param pageSize - 每页数量，默认为20
   * @returns Promise<any> - 文件列表数据，包含文件信息和分页信息
   * 
   * @example
   * // 获取第一页文件
   * const files = await api.getFiles(1, 20)
   * console.log(files.data)  // 文件数组
   * 
   * // 获取特定文件
   * const file = files.data?.find(f => f.name === 'test.jpg')
   * 
   * @remarks
   * - 返回的文件按时间倒序排列
   * - 包含文件的元数据信息（名称、大小、类型等）
   * - 可以通过分页参数控制返回数量
   */
  async getFiles(page: number = 1, pageSize: number = 20) {
    const response = await this.request.post('/api/v1/files_get', {
      data: { page, pageSize }
    })
    return response.json()
  }

  /**
   * 给文件添加标签
   * 
   * 为指定的文件列表添加标签，支持批量操作
   * 
   * @param fileIds - 文件ID数组
   * @param tagName - 标签名称
   * @param tagColor - 标签颜色（可选），如果不指定，系统会自动分配
   * @returns Promise<any> - API响应数据，包含操作结果
   * 
   * @example
   * // 给单个文件添加标签
   * await api.addTagToFiles([123], 'important')
   * 
   * // 给多个文件添加标签
   * await api.addTagToFiles([123, 456, 789], 'vacation', '#00FF00')
   * 
   * @remarks
   * - 如果标签不存在，会自动创建
   * - 如果文件已有该标签，不会重复添加
   * - 标签颜色如果不指定，系统会自动分配一个颜色
   */
  async addTagToFiles(fileIds: number[], tagName: string, tagColor?: string) {
    const response = await this.request.post('/api/v1/files_tag_set', {
      data: {
        fileIds,
        tagName,
        tagColor
      }
    })
    return response.json()
  }

  /**
   * 从文件移除标签
   * 
   * 从指定的文件列表移除标签，支持批量操作
   * 
   * @param fileIds - 文件ID数组
   * @param tagName - 标签名称
   * @returns Promise<any> - API响应数据，包含操作结果
   * 
   * @example
   * // 从单个文件移除标签
   * await api.removeTagFromFiles([123], 'important')
   * 
   * // 从多个文件移除标签
   * await api.removeTagFromFiles([123, 456, 789], 'vacation')
   * 
   * @remarks
   * - 如果文件没有该标签，操作会被忽略
   * - 不会删除标签本身，只是移除文件与标签的关联
   * - 系统标签（sys_score1等）也可以移除
   */
  async removeTagFromFiles(fileIds: number[], tagName: string) {
    const response = await this.request.post('/api/v1/files_tag_delete', {
      data: {
        fileIds,
        tagName
      }
    })
    return response.json()
  }

  /**
   * 根据标签获取文件列表
   * 
   * 获取包含指定标签的所有文件
   * 
   * @param tagName - 标签名称
   * @param page - 页码，从1开始，默认为1
   * @param pageSize - 每页数量，默认为20
   * @returns Promise<any> - 文件列表数据，包含文件信息和分页信息
   * 
   * @example
   * // 获取所有标记为"important"的文件
   * const files = await api.getFilesByTag('important')
   * console.log(files.data)  // 文件数组
   * 
   * @remarks
   * - 返回的文件按时间倒序排列
   * - 包含文件的元数据信息和标签信息
   * - 如果标签不存在，返回空数组
   */
  async getFilesByTag(tagName: string, page: number = 1, pageSize: number = 20) {
    const response = await this.request.post('/api/v1/files_get', {
      data: {
        page,
        pageSize,
        tags: [tagName]  // 按标签过滤
      }
    })
    return response.json()
  }
}
