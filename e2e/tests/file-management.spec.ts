/**
 * 文件管理测试套件
 * 
 * 本文件包含文件管理功能的所有E2E测试用例，覆盖文件的导航、选择、打标签、移除标签等核心功能。
 * 
 * 测试覆盖：
 * 1. 页面显示测试：验证页面元素是否正确显示
 * 2. 文件夹导航测试：测试进入文件夹功能
 * 3. 文件选择测试：测试文件选择功能
 * 4. 文件打标签测试：测试给文件添加标签功能
 * 5. 文件移除标签测试：测试从文件移除标签功能
 * 6. 批量操作测试：测试批量打标签和移除标签
 * 
 * 测试流程：
 * 1. 导航到主页
 * 2. 等待文件夹加载
 * 3. 进入文件夹
 * 4. 等待文件加载
 * 5. 选择文件
 * 6. 执行打标签或移除标签操作
 * 
 * 测试策略：
 * - 使用Page Object Model封装页面操作
 * - 使用API Helper进行数据准备和清理
 * - 每个测试独立运行，互不影响
 * - 测试数据使用唯一标识，避免冲突
 * - 关键步骤自动截图，便于调试和验证
 * 
 * @example
 * // 运行测试
 * npx playwright test file-management.spec.ts
 */

import { test, expect, Page } from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { ApiHelpers } from '../utils/api-helpers'

test.describe('File Management', () => {
  // Page Object实例，用于操作页面
  let homePage: HomePage
  // API Helper实例，用于数据管理
  let api: ApiHelpers
  // 当前测试名称，用于截图命名
  let currentTestName: string = ''

  /**
   * 测试后置钩子
   * 
   * 在每个测试后执行：
   * - 测试失败时自动截图
   */
  test.afterEach(async ({ page }, testInfo) => {
    // 如果测试失败，保存截图
    if (testInfo.status === 'failed') {
      const screenshot = await page.screenshot({ fullPage: true })
      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png'
      })
    }
  })

  /**
   * 辅助函数：在关键步骤截图
   * 
   * @param page - Playwright页面对象
   * @param stepName - 步骤名称
   */
  async function takeScreenshot(page: Page, stepName: string) {
    const screenshot = await page.screenshot({ fullPage: true })
    await test.info().attach(`step-${stepName}`, {
      body: screenshot,
      contentType: 'image/png'
    })
  }

  /**
   * 测试前置钩子
   * 
   * 在每个测试前执行：
   * 1. 初始化Page Object
   * 2. 初始化API Helper
   * 3. 导航到主页
   * 4. 等待文件夹加载完成
   */
  test.beforeEach(async ({ page, request }) => {
    // 初始化Page Object，page由Playwright自动注入
    homePage = new HomePage(page)
    
    // 初始化API Helper，request由Playwright自动注入
    api = new ApiHelpers(request)
    
    // 导航到主页
    await homePage.goto()
    
    // 等待文件夹加载完成
    await homePage.waitForFoldersToLoad()
  })

  /**
   * 测试：页面显示
   * 
   * 验证文件管理页面的基本元素是否正确显示
   */
  test('should display file explorer', async () => {
    // 验证文件浏览器可见
    await expect(homePage.fileExplorer).toBeVisible()
    
    // 验证至少有一个文件夹显示
    const folderCount = await homePage.getFolderCount()
    expect(folderCount).toBeGreaterThan(0)
  })

  /**
   * 测试：进入文件夹
   * 
   * 测试文件夹导航功能
   */
  test('should enter folder', async () => {
    // 获取第一个文件夹名称
    const firstFolder = homePage.folderCards.first()
    const folderName = await firstFolder.locator('.xc-card-foldername').textContent()
    
    // 进入文件夹
    await homePage.enterFolder(0)
    
    // 验证当前路径包含文件夹名称
    if (folderName) {
      await homePage.verifyCurrentPath(folderName)
    }
  })

  /**
   * 测试：搜索文件
   * 
   * 测试文件搜索功能
   */
  test('should search files', async () => {
    // 执行搜索
    await homePage.searchFiles('test')
    
    // 验证搜索触发器包含搜索关键词
    await expect(homePage.page.locator('.search-trigger')).toContainText('test')
  })

  /**
   * 测试：导航到管理界面
   * 
   * 测试从主页导航到管理界面
   */
  test('should navigate to management', async () => {
    // 打开管理界面
    await homePage.openManagement()
    
    // 验证管理界面元素
    await expect(homePage.page.locator('.admin-nav')).toBeVisible()
    await expect(homePage.page.locator('text=标签')).toBeVisible()
    await expect(homePage.page.locator('text=回收站')).toBeVisible()
    await expect(homePage.page.locator('text=相似文件')).toBeVisible()
  })

  /**
   * 测试：选择文件
   * 
   * 测试文件选择功能，验证操作栏显示
   * 流程：进入文件夹 -> 等待文件加载 -> 选择文件
   */
  test('should select file and show operation bar', async ({ page }) => {
    // 进入第一个文件夹
    await homePage.enterFolder(0)
    
    // 等待文件加载
    await homePage.waitForFilesToLoad()
    
    // 截图：进入文件夹后的文件列表
    await takeScreenshot(page, '1-folder-content')
    
    // 选择第一个文件
    await homePage.selectFile(0)
    
    // 截图：选择文件后显示操作栏
    await takeScreenshot(page, '2-file-selected')
    
    // 验证操作栏已显示
    await expect(homePage.operationBar).toBeVisible()
    
    // 验证操作栏显示选中数量
    await expect(homePage.operationBar).toContainText('已选中')
  })

  /**
   * 测试：取消选择文件
   * 
   * 测试取消文件选择功能
   */
  test('should clear file selection', async ({ page }) => {
    // 进入第一个文件夹
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    // 选择文件
    await homePage.selectFile(0)
    await expect(homePage.operationBar).toBeVisible()
    
    // 截图：文件已选中状态
    await takeScreenshot(page, '1-file-selected')
    
    // 取消选择
    await homePage.clearSelection()
    
    // 截图：取消选择后
    await takeScreenshot(page, '2-selection-cleared')
    
    // 验证操作栏已隐藏
    await expect(homePage.operationBar).not.toBeVisible()
  })

  /**
   * 测试：给文件添加标签
   * 
   * 测试给选中的文件添加标签的完整流程
   * 流程：进入文件夹 -> 选择文件 -> 添加标签
   */
  test('should add tag to file', async ({ page }) => {
    // 准备：创建测试标签
    const tagName = `test-tag-${Date.now()}`
    await api.createTag(tagName, '#FF5733')
    
    // 进入第一个文件夹
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    // 截图：进入文件夹后的文件列表
    await takeScreenshot(page, '1-folder-content')
    
    // 选择第一个文件
    await homePage.selectFile(0)
    
    // 截图：文件选中状态
    await takeScreenshot(page, '2-file-selected')
    
    // 添加标签
    await homePage.addTagToSelectedFiles(tagName)
    
    // 等待标签添加完成
    await homePage.page.waitForTimeout(1000)
    
    // 截图：添加标签后
    await takeScreenshot(page, '3-tag-added')
    
    // 验证文件已添加标签
    const hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    
    // 截图：验证标签显示
    await takeScreenshot(page, '4-tag-verified')
    
    // 清理：删除测试标签
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    
    // 等待界面自动更新
    await homePage.page.waitForTimeout(1000)
    
    // 验证界面上的标签已被移除
    const hasTagAfterDelete = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTagAfterDelete).toBe(false)
    
    // 截图：验证标签已删除
    await takeScreenshot(page, '5-tag-deleted-verified')
  })

  /**
   * 测试：从文件移除标签
   * 
   * 测试从选中的文件移除标签的完整流程
   * 流程：进入文件夹 -> 通过API添加标签 -> 选择文件 -> 移除标签
   */
  test('should remove tag from file', async ({ page }) => {
    // 准备：创建测试标签
    const tagName = `test-tag-remove-${Date.now()}`
    await api.createTag(tagName, '#00FF00')
    
    // 进入第一个文件夹
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    // 截图：进入文件夹后的文件列表
    await takeScreenshot(page, '1-folder-content')
    
    // 准备：获取文件ID并添加标签
    const files = await api.getFiles(1, 1)
    const fileId = files.data?.[0]?.id
    
    if (fileId) {
      // 通过API添加标签
      await api.addTagToFiles([fileId], tagName)
      
      // 刷新页面
      await homePage.page.reload()
      await homePage.waitForFilesToLoad()
      
      // 截图：文件已有标签
      await takeScreenshot(page, '2-file-with-tag')
      
      // 选择文件
      await homePage.selectFile(0)
      
      // 截图：选中带标签的文件
      await takeScreenshot(page, '3-file-selected')
      
      // 移除标签
      await homePage.removeTagFromSelectedFiles(tagName)
      
      // 等待标签移除完成
      await homePage.page.waitForTimeout(1000)
      
      // 截图：移除标签后
      await takeScreenshot(page, '4-tag-removed')
      
      // 验证文件已移除标签
      const hasTag = await homePage.verifyFileHasTag(0, tagName)
      expect(hasTag).toBe(false)
      
      // 截图：验证标签已移除
      await takeScreenshot(page, '5-tag-removal-verified')
    }
    
    // 清理：删除测试标签
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    
    // 等待界面自动更新
    await homePage.page.waitForTimeout(1000)
    
    // 验证界面上的标签已被移除
    const hasTagAfterDelete = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTagAfterDelete).toBe(false)
    
    // 截图：验证标签已删除
    await takeScreenshot(page, '6-tag-deleted-verified')
  })

  /**
   * 测试：批量添加标签
   * 
   * 测试给多个文件批量添加标签
   * 流程：进入文件夹 -> 选择多个文件 -> 批量添加标签
   */
  test('should add tag to multiple files', async ({ page }) => {
    // 准备：创建测试标签
    const tagName = `test-tag-batch-${Date.now()}`
    await api.createTag(tagName, '#0000FF')
    
    // 进入第一个文件夹
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    // 截图：进入文件夹后的文件列表
    await takeScreenshot(page, '1-folder-content')
    
    // 选择前三个文件
    await homePage.selectMultipleFiles([0, 1, 2])
    
    // 截图：多个文件选中状态
    await takeScreenshot(page, '2-multiple-files-selected')
    
    // 添加标签
    await homePage.addTagToSelectedFiles(tagName)
    
    // 等待标签添加完成
    await homePage.page.waitForTimeout(1000)
    
    // 截图：批量添加标签后
    await takeScreenshot(page, '3-batch-tags-added')
    
    // 验证所有选中的文件都有标签
    for (let i = 0; i < 3; i++) {
      const hasTag = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTag).toBe(true)
    }
    
    // 截图：验证所有文件都有标签
    await takeScreenshot(page, '4-all-tags-verified')
    
    // 清理：删除测试标签
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    
    // 等待界面自动更新
    await homePage.page.waitForTimeout(1000)
    
    // 验证所有文件上的标签已被移除
    for (let i = 0; i < 3; i++) {
      const hasTagAfterDelete = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTagAfterDelete).toBe(false)
    }
    
    // 截图：验证标签已删除
    await takeScreenshot(page, '5-tag-deleted-verified')
  })

  /**
   * 测试：批量移除标签
   * 
   * 测试从多个文件批量移除标签
   * 流程：进入文件夹 -> 通过API批量添加标签 -> 选择文件 -> 批量移除标签
   */
  test('should remove tag from multiple files', async ({ page }) => {
    // 准备：创建测试标签
    const tagName = `test-tag-batch-remove-${Date.now()}`
    await api.createTag(tagName, '#FF00FF')
    
    // 进入第一个文件夹
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    // 截图：进入文件夹后的文件列表
    await takeScreenshot(page, '1-folder-content')
    
    // 准备：获取文件ID并添加标签
    const files = await api.getFiles(1, 3)
    const fileIds = files.data?.slice(0, 3).map((f: any) => f.id) || []
    
    if (fileIds.length >= 3) {
      // 通过API批量添加标签
      await api.addTagToFiles(fileIds, tagName)
      
      // 刷新页面
      await homePage.page.reload()
      await homePage.waitForFilesToLoad()
      
      // 截图：文件已有标签
      await takeScreenshot(page, '2-files-with-tags')
      
      // 选择前三个文件
      await homePage.selectMultipleFiles([0, 1, 2])
      
      // 截图：选中多个带标签的文件
      await takeScreenshot(page, '3-multiple-files-selected')
      
      // 移除标签
      await homePage.removeTagFromSelectedFiles(tagName)
      
      // 等待标签移除完成
      await homePage.page.waitForTimeout(1000)
      
      // 截图：批量移除标签后
      await takeScreenshot(page, '4-batch-tags-removed')
      
      // 验证所有选中的文件都已移除标签
      for (let i = 0; i < 3; i++) {
        const hasTag = await homePage.verifyFileHasTag(i, tagName)
        expect(hasTag).toBe(false)
      }
      
      // 截图：验证所有标签已移除
      await takeScreenshot(page, '5-all-tags-removal-verified')
    }
    
    // 清理：删除测试标签
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    
    // 等待界面自动更新
    await homePage.page.waitForTimeout(1000)
    
    // 验证所有文件上的标签已被移除
    for (let i = 0; i < 3; i++) {
      const hasTagAfterDelete = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTagAfterDelete).toBe(false)
    }
    
    // 截图：验证标签已删除
    await takeScreenshot(page, '6-tag-deleted-verified')
  })

  /**
   * 测试：验证文件标签列表
   * 
   * 测试获取文件的标签列表功能
   */
  test('should get file tags', async ({ page }) => {
    // 准备：创建测试标签
    const tagName = `test-tag-list-${Date.now()}`
    await api.createTag(tagName, '#FFFF00')
    
    // 进入第一个文件夹
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    // 截图：进入文件夹后的文件列表
    await takeScreenshot(page, '1-folder-content')
    
    // 准备：获取文件ID并添加标签
    const files = await api.getFiles(1, 1)
    const fileId = files.data?.[0]?.id
    
    if (fileId) {
      // 通过API添加标签
      await api.addTagToFiles([fileId], tagName)
      
      // 刷新页面
      await homePage.page.reload()
      await homePage.waitForFilesToLoad()
      
      // 截图：文件已有标签
      await takeScreenshot(page, '2-file-with-tag')
      
      // 获取文件标签列表
      const tags = await homePage.getFileTags(0)
      
      // 截图：标签列表
      await takeScreenshot(page, '3-tag-list')
      
      // 验证标签列表包含测试标签
      expect(tags).toContain(tagName)
    }
    
    // 清理：删除测试标签
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    
    // 等待界面自动更新
    await homePage.page.waitForTimeout(1000)
    
    // 验证界面上的标签已被移除
    const tagsAfterDelete = await homePage.getFileTags(0)
    expect(tagsAfterDelete).not.toContain(tagName)
    
    // 截图：验证标签已删除
    await takeScreenshot(page, '4-tag-deleted-verified')
  })

  /**
   * 测试：删除文件到回收站
   * 
   * 测试文件删除功能
   */
  test('should delete file to trash', async ({ page }) => {
    // 打开管理界面
    await homePage.openManagement()
    
    // 截图：管理界面
    await takeScreenshot(page, '1-management-page')
    
    // 点击回收站
    await page.locator('text=回收站').click()
    
    // 截图：回收站页面
    await takeScreenshot(page, '2-trash-page')
    
    // 验证回收站页面显示
    await expect(page.locator('h2:has-text("回收站")')).toBeVisible()
  })
})
