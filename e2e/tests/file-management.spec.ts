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
    const tagName = `test-tag-${Date.now()}`
    
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    await takeScreenshot(page, '1-folder-content')
    
    await homePage.selectFile(0)
    
    await takeScreenshot(page, '2-file-selected')
    
    await homePage.addTagToSelectedFiles(tagName)
    
    await homePage.page.waitForTimeout(1000)
    
    await takeScreenshot(page, '3-tag-added')
    
    const hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    
    await takeScreenshot(page, '4-tag-verified')
    
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.code).toBe(0)
    
    await takeScreenshot(page, '5-tag-deleted-verified')
  })

  /**
   * 测试：从文件移除标签
   * 
   * 测试从选中的文件移除标签的完整流程
   * 流程：进入文件夹 -> 通过API添加标签 -> 选择文件 -> 移除标签
   */
  test('should remove tag from file', async ({ page }) => {
    const tagName = `test-tag-remove-${Date.now()}`
    
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    await takeScreenshot(page, '1-folder-content')
    
    await homePage.selectFile(0)
    await takeScreenshot(page, '2-file-selected')
    
    await homePage.addTagToSelectedFiles(tagName)
    await takeScreenshot(page, '3-tag-added')
    
    await page.waitForTimeout(1000)
    
    let hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    await takeScreenshot(page, '4-tag-verified')
    
    await homePage.selectFile(0)
    await takeScreenshot(page, '5-file-reselected')
    
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '6-delete-tag-dialog-opened')
    
    await homePage.selectTagsInDialog([tagName])
    await takeScreenshot(page, '7-tag-selected-in-dialog')
    
    await homePage.confirmDeleteTags()
    await takeScreenshot(page, '8-tag-removed')
    
    await page.waitForTimeout(1000)
    
    hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(false)
    
    await takeScreenshot(page, '9-tag-removal-verified')
    
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.code).toBe(0)
  })

  /**
   * 测试：批量添加标签
   * 
   * 测试给多个文件批量添加标签
   * 流程：进入文件夹 -> 选择多个文件 -> 批量添加标签
   */
  test('should add tag to multiple files', async ({ page }) => {
    const tagName = `test-tag-batch-${Date.now()}`
    
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    await takeScreenshot(page, '1-folder-content')
    
    await homePage.selectMultipleFiles([0, 1, 2])
    
    await takeScreenshot(page, '2-files-selected')
    
    await homePage.addTagToSelectedFiles(tagName)
    
    await homePage.page.waitForTimeout(1000)
    
    await takeScreenshot(page, '3-tag-added')
    
    for (let i = 0; i < 3; i++) {
      const hasTag = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTag).toBe(true)
    }
    
    await takeScreenshot(page, '4-all-tags-verified')
    
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.code).toBe(0)
    
    await page.waitForTimeout(1000)
    
    for (let i = 0; i < 3; i++) {
      const hasTagAfterDelete = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTagAfterDelete).toBe(false)
    }
    
    await takeScreenshot(page, '5-tag-deleted-verified')
  })

  /**
   * 测试：批量移除标签
   * 
   * 测试从多个文件批量移除标签
   * 流程：进入文件夹 -> 通过API批量添加标签 -> 选择文件 -> 批量移除标签
   */
  test('should remove tag from multiple files', async ({ page }) => {
    const tagName = `test-tag-batch-remove-${Date.now()}`
    
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    await takeScreenshot(page, '1-folder-content')
    
    await homePage.selectMultipleFiles([0, 1, 2])
    await takeScreenshot(page, '2-files-selected')
    
    await homePage.addTagToSelectedFiles(tagName)
    await takeScreenshot(page, '3-tag-added')
    
    await page.waitForTimeout(500)
    
    for (let i = 0; i < 3; i++) {
      const hasTag = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTag).toBe(true)
    }
    await takeScreenshot(page, '4-tags-verified')
    
    await homePage.clearSelection()
    
    await homePage.selectMultipleFiles([0, 1, 2])
    await takeScreenshot(page, '5-files-reselected')
    
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '6-delete-tag-dialog-opened')
    
    await homePage.selectTagsInDialog([tagName])
    await takeScreenshot(page, '7-tag-selected-in-dialog')
    
    await homePage.confirmDeleteTags()
    await takeScreenshot(page, '8-batch-tags-removed')
    
    await page.waitForTimeout(1000)
    
    for (let i = 0; i < 3; i++) {
      const hasTag = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTag).toBe(false)
    }
    
    await takeScreenshot(page, '9-all-tags-removal-verified')
    
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.code).toBe(0)
  })

  /**
   * 测试：验证文件标签列表
   * 
   * 测试获取文件的标签列表功能
   */
  test('should get file tags', async ({ page }) => {
    const tagName = `test-tag-list-${Date.now()}`
    
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    await takeScreenshot(page, '1-folder-content')
    
    await homePage.selectFile(0)
    await takeScreenshot(page, '2-file-selected')
    
    await homePage.addTagToSelectedFiles(tagName)
    await takeScreenshot(page, '3-tag-added')
    
    await page.waitForTimeout(500)
    
    const tags = await homePage.getFileTags(0)
    await takeScreenshot(page, '4-tag-list')
    
    expect(tags).toContain(tagName)
    
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.code).toBe(0)
    
    await page.waitForTimeout(1000)
    
    const tagsAfterDelete = await homePage.getFileTags(0)
    expect(tagsAfterDelete).not.toContain(tagName)
    
    await takeScreenshot(page, '5-tag-deleted-verified')
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

  /**
   * Test: Delete tags from selected files using dialog
   * 
   * Test the tag deletion feature using the delete tag dialog
   */
  test('should delete tags from selected files using dialog', async ({ page }) => {
    const tagName = `test-delete-dialog-${Date.now()}`
    
    // Open management interface
    await homePage.openManagement()
    await takeScreenshot(page, '1-management-page')
    
    // Navigate to test folder
    await homePage.navigateToFolders(['测试文件夹'])
    await homePage.waitForFilesToLoad()
    await takeScreenshot(page, '2-test-folder')
    
    // Select first file
    await homePage.selectFile(0)
    await takeScreenshot(page, '3-file-selected')
    
    // Add tag to selected file
    await homePage.addTagToSelectedFiles(tagName)
    await takeScreenshot(page, '4-tag-added')
    
    // Wait for tag to appear
    await page.waitForTimeout(500)
    
    // Verify tag is added
    let hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    await takeScreenshot(page, '5-tag-verified')
    
    // Clear selection
    await homePage.clearSelection()
    
    // Select the file again
    await homePage.selectFile(0)
    await takeScreenshot(page, '6-file-reselected')
    
    // Open delete tag dialog
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '7-delete-tag-dialog-opened')
    
    // Select tag to delete
    await homePage.selectTagsInDialog([tagName])
    await takeScreenshot(page, '8-tag-selected-in-dialog')
    
    // Confirm deletion
    await homePage.confirmDeleteTags()
    await takeScreenshot(page, '9-tag-deletion-confirmed')
    
    // Wait for UI to update
    await page.waitForTimeout(1000)
    
    // Verify tag is removed
    hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(false)
    await takeScreenshot(page, '10-tag-removed-verified')
    
    // Cleanup: delete test tag
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.code).toBe(0)
  })

  /**
   * Test: Delete multiple tags from multiple files using dialog
   * 
   * Test batch tag deletion using the delete tag dialog
   */
  test('should delete multiple tags from multiple files using dialog', async ({ page }) => {
    const tagName1 = `test-batch-delete-1-${Date.now()}`
    const tagName2 = `test-batch-delete-2-${Date.now()}`
    
    // Open management interface
    await homePage.openManagement()
    await takeScreenshot(page, '1-management-page')
    
    // Navigate to test folder
    await homePage.navigateToFolders(['测试文件夹'])
    await homePage.waitForFilesToLoad()
    await takeScreenshot(page, '2-test-folder')
    
    // Select first 3 files
    for (let i = 0; i < 3; i++) {
      await homePage.selectFile(i)
    }
    await takeScreenshot(page, '3-files-selected')
    
    // Add first tag
    await homePage.addTagToSelectedFiles(tagName1)
    await takeScreenshot(page, '4-first-tag-added')
    
    // Add second tag
    await homePage.addTagToSelectedFiles(tagName2)
    await takeScreenshot(page, '5-second-tag-added')
    
    // Wait for tags to appear
    await page.waitForTimeout(500)
    
    // Verify tags are added
    for (let i = 0; i < 3; i++) {
      let hasTag = await homePage.verifyFileHasTag(i, tagName1)
      expect(hasTag).toBe(true)
      hasTag = await homePage.verifyFileHasTag(i, tagName2)
      expect(hasTag).toBe(true)
    }
    await takeScreenshot(page, '6-tags-verified')
    
    // Clear selection
    await homePage.clearSelection()
    
    // Select files again
    for (let i = 0; i < 3; i++) {
      await homePage.selectFile(i)
    }
    await takeScreenshot(page, '7-files-reselected')
    
    // Open delete tag dialog
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '8-delete-tag-dialog-opened')
    
    // Select both tags to delete
    await homePage.selectTagsInDialog([tagName1, tagName2])
    await takeScreenshot(page, '9-tags-selected-in-dialog')
    
    // Confirm deletion
    await homePage.confirmDeleteTags()
    await takeScreenshot(page, '10-tags-deletion-confirmed')
    
    // Wait for UI to update
    await page.waitForTimeout(1000)
    
    // Verify tags are removed
    for (let i = 0; i < 3; i++) {
      let hasTag = await homePage.verifyFileHasTag(i, tagName1)
      expect(hasTag).toBe(false)
      hasTag = await homePage.verifyFileHasTag(i, tagName2)
      expect(hasTag).toBe(false)
    }
    await takeScreenshot(page, '11-tags-removed-verified')
    
    // Cleanup: delete test tags
    await api.deleteTag(tagName1)
    await api.deleteTag(tagName2)
  })

  /**
   * Test: Cancel tag deletion in dialog
   * 
   * Test canceling tag deletion in the dialog
   */
  test('should cancel tag deletion in dialog', async ({ page }) => {
    const tagName = `test-cancel-delete-${Date.now()}`
    
    // Open management interface
    await homePage.openManagement()
    await takeScreenshot(page, '1-management-page')
    
    // Navigate to test folder
    await homePage.navigateToFolders(['测试文件夹'])
    await homePage.waitForFilesToLoad()
    await takeScreenshot(page, '2-test-folder')
    
    // Select first file
    await homePage.selectFile(0)
    await takeScreenshot(page, '3-file-selected')
    
    // Add tag to selected file
    await homePage.addTagToSelectedFiles(tagName)
    await takeScreenshot(page, '4-tag-added')
    
    // Wait for tag to appear
    await page.waitForTimeout(500)
    
    // Verify tag is added
    let hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    await takeScreenshot(page, '5-tag-verified')
    
    // Clear selection
    await homePage.clearSelection()
    
    // Select the file again
    await homePage.selectFile(0)
    await takeScreenshot(page, '6-file-reselected')
    
    // Open delete tag dialog
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '7-delete-tag-dialog-opened')
    
    // Select tag to delete
    await homePage.selectTagsInDialog([tagName])
    await takeScreenshot(page, '8-tag-selected-in-dialog')
    
    // Cancel deletion
    await homePage.cancelDeleteTagDialog()
    await takeScreenshot(page, '9-deletion-canceled')
    
    // Verify tag still exists
    hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    await takeScreenshot(page, '10-tag-still-exists')
    
    // Cleanup: delete test tag
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.code).toBe(0)
  })
})
