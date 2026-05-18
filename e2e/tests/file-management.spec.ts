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
   * 测试前置钩子, 在每个测试前执行
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
   * Test: Display file explorer and navigate into folder
   * 
   * Test the complete flow of displaying file explorer and navigating into folders
   * Based on test data structure:
   * test-basic-navigation/
   * ├── 2024-01-旅游/
   * │   ├── day1/ (10 images)
   * │   └── day2/ (10 images)
   * └── 2024-02-聚会/ (5 images)
   * 
   * Steps:
   * 1. Check file explorer is visible
   * 2. Check root folder count equals 14
   * 3. Take screenshot
   * 4. Enter test-basic-navigation folder
   * 5. Check subfolder count equals 2 (2024-01-旅游, 2024-02-聚会)
   * 6. Verify navigation bar shows correct path
   * 7. Take screenshot
   * 8. Enter 2024-01-旅游 folder
   * 9. Check subfolder count equals 2 (day1, day2)
   * 10. Verify navigation bar shows correct path
   * 11. Take screenshot
   * 12. Enter day1 folder
   * 13. Check file count equals 10
   * 14. Verify file names match expected pattern
   * 15. Verify navigation bar shows correct path
   * 16. Take screenshot
   */
  test('should display file explorer and navigate into folder', async ({ page }) => {
    // Step 1: check file explorer is visible
    await expect(homePage.fileExplorer).toBeVisible()
    
    // Step 2: check root folder count equals 14
    const rootFolderCount = await homePage.getFolderCount()
    expect(rootFolderCount).toBe(14)
    
    // Step 3: take screenshot
    await takeScreenshot(page, '1-root-folders-displayed')
    
    // Step 4: enter test-basic-navigation folder
    await homePage.enterFolder('test-basic-navigation')
    await page.waitForTimeout(1000)
    
    // Step 5: check subfolder count equals 2 (2024-01-旅游, 2024-02-聚会)
    const level1FolderCount = await homePage.getFolderCount()
    expect(level1FolderCount).toBe(2)
    
    // Verify folder names
    const folder1Name = await homePage.folderCards.nth(0).locator('.xc-card-foldername').textContent()
    const folder2Name = await homePage.folderCards.nth(1).locator('.xc-card-foldername').textContent()
    expect(folder1Name).toContain('2024-01')
    expect(folder2Name).toContain('2024-02')
    
    // Step 6: verify navigation bar shows correct path
    const pathDisplay = page.locator('.path-display')
    await expect(pathDisplay).toBeVisible()
    const pathItems = pathDisplay.locator('.path-item')
    await expect(pathItems).toHaveCount(2) // root + test-basic-navigation
    await expect(pathItems.nth(1)).toContainText('test-basic-navigation')
    await expect(pathItems.nth(1)).toHaveClass(/is-current/)
    
    // Step 7: take screenshot
    await takeScreenshot(page, '2-level1-folders')
    
    // Step 8: enter 2024-01-旅游 folder
    await homePage.enterFolder(0)
    await page.waitForTimeout(1000)
    
    // Step 9: check subfolder count equals 2 (day1, day2)
    const level2FolderCount = await homePage.getFolderCount()
    expect(level2FolderCount).toBe(2)
    
    // Verify folder names
    const day1Name = await homePage.folderCards.nth(0).locator('.xc-card-foldername').textContent()
    const day2Name = await homePage.folderCards.nth(1).locator('.xc-card-foldername').textContent()
    expect(day1Name).toContain('day1')
    expect(day2Name).toContain('day2')
    
    // Step 10: verify navigation bar shows correct path
    const pathItemsLevel2 = pathDisplay.locator('.path-item')
    await expect(pathItemsLevel2).toHaveCount(3) // root + test-basic-navigation + 2024-01-旅游
    await expect(pathItemsLevel2.nth(1)).toContainText('test-basic-navigation')
    await expect(pathItemsLevel2.nth(2)).toContainText('2024-01')
    await expect(pathItemsLevel2.nth(2)).toHaveClass(/is-current/)
    
    // Step 11: take screenshot
    await takeScreenshot(page, '3-level2-folders')
    
    // Step 12: enter day1 folder
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    
    // Step 13: check file count equals 10
    const fileCount = await homePage.getFileCount()
    expect(fileCount).toBe(10)
    
    // Step 14: verify file names match expected pattern (IMG_YYYYMMDD_HHMMSS.jpg)
    const firstFileName = await homePage.getFileName(0)
    expect(firstFileName).toMatch(/^IMG_\d{8}_\d{6}\.jpg$/)
    
    // Step 15: verify navigation bar shows correct path
    const pathItemsLevel3 = pathDisplay.locator('.path-item')
    await expect(pathItemsLevel3).toHaveCount(4) // root + test-basic-navigation + 2024-01-旅游 + day1
    await expect(pathItemsLevel3.nth(1)).toContainText('test-basic-navigation')
    await expect(pathItemsLevel3.nth(2)).toContainText('2024-01')
    await expect(pathItemsLevel3.nth(3)).toContainText('day1')
    await expect(pathItemsLevel3.nth(3)).toHaveClass(/is-current/)
    
    // Step 16: take screenshot
    await takeScreenshot(page, '4-files-in-day1')
  })

  /**
   * Test: Add and remove tag from file
   * 
   * Test the complete flow of adding and removing a tag from a single file
   * Based on test data: test-basic-navigation/2024-01-旅游/day1/ (10 images)
   * 
   * Steps:
   * 1. Navigate to test-basic-navigation/2024-01-旅游/day1 folder
   * 2. Wait for files to load and verify file count equals 10
   * 3. Select first file
   * 4. Verify operation bar is visible
   * 5. Add tag to selected file
   * 6. Verify tag is added to file
   * 7. Select file again
   * 8. Open delete tag dialog
   * 9. Select the tag in dialog
   * 10. Confirm tag deletion
   * 11. Verify tag is removed from file
   * 12. Cleanup: delete the test tag via API
   */
  test('should add and remove tag from file', async ({ page }) => {
    const tagName = `test-tag-add-remove-${Date.now()}`
    
    // Step 1: Navigate to test-basic-navigation/2024-01-旅游/day1 folder
    await homePage.enterFolder('test-basic-navigation')
    await page.waitForTimeout(1000)
    await homePage.enterFolder(0) // 2024-01-旅游
    await page.waitForTimeout(1000)
    await homePage.enterFolder(0) // day1
    
    // Step 2: Wait for files to load and verify file count equals 10
    await homePage.waitForFilesToLoad()
    const fileCount = await homePage.getFileCount()
    expect(fileCount).toBe(10)
    await takeScreenshot(page, '1-files-loaded')
    
    // Step 3: Select first file
    await homePage.selectFile(0)
    
    // Step 4: Verify operation bar is visible
    await expect(homePage.operationBar).toBeVisible()
    await takeScreenshot(page, '2-file-selected')
    
    // Step 5: Add tag to selected file
    await homePage.addTagToSelectedFiles(tagName)
    await page.waitForTimeout(1000)
    await takeScreenshot(page, '3-tag-added')
    
    // Step 6: Verify tag is added to file
    let hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    await takeScreenshot(page, '4-tag-verified')
    
    // Step 7: Select file again
    await homePage.selectFile(0)
    await takeScreenshot(page, '5-file-reselected')
    
    // Step 8: Open delete tag dialog
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '6-delete-tag-dialog-opened')
    
    // Step 9: Select the tag in dialog
    await homePage.selectTagsInDialog([tagName])
    await takeScreenshot(page, '7-tag-selected-in-dialog')
    
    // Step 10: Confirm tag deletion
    await homePage.confirmDeleteTags()
    await page.waitForTimeout(1000)
    await takeScreenshot(page, '8-tag-removed')
    
    // Step 11: Verify tag is removed from file
    hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(false)
    await takeScreenshot(page, '9-tag-removal-verified')
    
    // Step 12: Cleanup: delete the test tag via API
    const deleteResult = await api.deleteTag(tagName)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.code).toBe(0)
    await takeScreenshot(page, '10-cleanup-done')
  })

  /**
   * Test: Select file
   * 
   * check file selection works and operation bar is visible
   */
  test('should select file and show operation bar', async ({ page }) => {
    // enter first folder
    await homePage.enterFolder(0)
    
    // 等待文件加载
    await homePage.waitForFilesToLoad()
    
    // 截图：进入文件夹后的文件列表
    await takeScreenshot(page, '1-folder-content')
    
    // 选择第一个文件
    await homePage.selectFile(0)
    
    // 截图：选择文件后显示操作栏
    await takeScreenshot(page, '2-file-selected')
    
    await homePage.waitForFilesToLoad()

    // 验证操作栏已显示
    await expect(homePage.operationBar).toBeVisible()
    
    // 验证操作栏显示选中数量
    await expect(homePage.operationBar).toContainText('已选中')
    
    await takeScreenshot(page, '3-operation-bar')
  
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
    
    await homePage.selectMultipleFiles([0, 1, 2])
    await takeScreenshot(page, '5-files-reselected')
    // Delete tag from selected files using Page Object method
    await homePage.deleteTagFromSelectedFiles(tagName)
    
    await page.waitForTimeout(1000)
    
    for (let i = 0; i < 3; i++) {
      const hasTagAfterDelete = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTagAfterDelete).toBe(false)
    }
    
    await takeScreenshot(page, '5-tag-deleted-verified')
  })

  /**
   * Test: remove tag from multiple files using dialog, and delete tag from file using dialog
   * 
   * 1, enter folder 0
   * 2, select multiple files 0, 1, 2
   * 3, add tag to selected files using dialog method
   * 4, verify tags are added
   * 5, select first file 0,
   * 6, open delete tag dialog
   * 7, select tag in dialog
   * 8, confirm delete tags
   * 9, verify tags are removed
   * 10, select multiple files 0, 1, 2
   * 11, open delete tag dialog
   * 12, select tag in dialog
   * 13, confirm delete tags
   * 14, verify tags are removed
   */
  test('should add and remove tag from multiple files', async ({ page }) => {
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
        
    await homePage.selectMultipleFiles([0])
    await takeScreenshot(page, '5-files-reselected')
    
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '6-delete-tag-dialog-opened')
    
    await homePage.selectTagsInDialog([tagName])
    await takeScreenshot(page, '7-tag-selected-in-dialog')
    
    await homePage.confirmDeleteTags()
    await takeScreenshot(page, '8-batch-tags-removed')
    
    await page.waitForTimeout(500)
    
    for (let i = 0; i < 1; i++) {
      const hasTag = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTag).toBe(false)
    }

    await homePage.selectMultipleFiles([0, 1, 2])
    await takeScreenshot(page, '10-files-reselected')
    
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '11-delete-tag-dialog-opened')
    
    await homePage.selectTagsInDialog([tagName])
    await takeScreenshot(page, '12-tag-selected-in-dialog')
    
    await homePage.confirmDeleteTags()
    await takeScreenshot(page, '13-all-tags-removed')
    
    await page.waitForTimeout(500)
    
    for (let i = 0; i < 3; i++) {
      const hasTag = await homePage.verifyFileHasTag(i, tagName)
      expect(hasTag).toBe(false)
    }
    await takeScreenshot(page, '14-all-tags-removal-verified')
  })

  /**
   * Test: Cancel tag deletion in dialog
   * 
   * Test canceling tag deletion in the dialog
   */
  test('should cancel tag deletion in dialog', async ({ page }) => {
    const tagName = `test-cancel-delete-${Date.now()}`
    
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    await takeScreenshot(page, '1-cancel-delete-dialog')
    
    // Select first file
    await homePage.selectFile(0)
    await takeScreenshot(page, '2-file-selected-dialog')
    
    // Add tag to selected file
    await homePage.addTagToSelectedFiles(tagName)
    await takeScreenshot(page, '3-tag-added-dialog')
    
    // Wait for tag to appear
    await page.waitForTimeout(500)
    
    // Verify tag is added
    let hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    await takeScreenshot(page, '4-tag-verified-dialog')
    
    // Select the file again
    await homePage.selectFile(0)
    await takeScreenshot(page, '5-file-reselected-dialog')
    
    // Open delete tag dialog
    await homePage.openDeleteTagDialog()
    await takeScreenshot(page, '6-delete-tag-dialog-opened')
    
    // Select tag to delete
    await homePage.selectTagsInDialog([tagName])
    await takeScreenshot(page, '7-tag-selected-in-dialog')
    
    // Cancel deletion
    await homePage.cancelDeleteTagDialog()
    await takeScreenshot(page, '8-deletion-canceled-dialog')
    
    // Verify tag still exists
    hasTag = await homePage.verifyFileHasTag(0, tagName)
    expect(hasTag).toBe(true)
    await takeScreenshot(page, '9-tag-still-exists-dialog')
  })
})
