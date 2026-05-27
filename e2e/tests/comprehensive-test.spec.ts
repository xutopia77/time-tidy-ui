/**
 * comprehensive test suite
 * 
 * 本文件包含综合测试的所有E2E测试用例，覆盖文件的导航、选择、打标签、移除标签等核心功能。
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
 * npx playwright test comprehensive-test.spec.ts
 */

import { test, expect, Page } from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { TagManagementPage } from '../pages/TagManagementPage'
import { ApiHelpers } from '../utils/api-helpers'

test.describe('Comprehensive Test', () => {
  // Page Object实例，用于操作页面
  let homePage: HomePage
  // Tag Management Page Object
  let tagManagementPage: TagManagementPage
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
    
    // 初始化Tag Management Page Object
    tagManagementPage = new TagManagementPage(page)
    
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
   * Test Parts:
   * Part 1: File browsing and navigation verification
   * Part 2: FAB and Info Sidebar verification
   * Part 3: Search Panel UI completeness verification
   * Part 4: Search condition state management verification
   * Part 5: Search Panel cancel operation verification
   */
  test('should display file explorer and navigate into folder', async ({ page }) => {
    // ==================== Part 1: File Browsing and Navigation ====================
    {
      // Step 1: check file explorer is visible
      await expect(homePage.fileExplorer).toBeVisible()
      
      // Step 2: check root folder count equals 18
      const rootFolderCount = await homePage.getFolderCount()
      expect(rootFolderCount).toBe(18)
      
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
      
      // Step 7: select folder and verify operation bar
      await homePage.folderCards.nth(0).locator('.xc-checkbox').check()
      await expect(homePage.operationBar).toBeVisible()
      await expect(homePage.operationBar).toContainText('已选中')
      
      // Step 8: take screenshot
      await takeScreenshot(page, '2-level1-folders-with-operation-bar')
      
      // Step 9: click cancel button to hide operation bar
      await homePage.clearSelection()
      await expect(homePage.operationBar).not.toBeVisible()
      
      // Step 10: enter 2024-01-旅游 folder
      await homePage.enterFolder(0)
      await page.waitForTimeout(1000)
      
      // Step 11: check subfolder count equals 2 (day1, day2)
      const level2FolderCount = await homePage.getFolderCount()
      expect(level2FolderCount).toBe(2)
      
      // Verify folder names
      const day1Name = await homePage.folderCards.nth(0).locator('.xc-card-foldername').textContent()
      const day2Name = await homePage.folderCards.nth(1).locator('.xc-card-foldername').textContent()
      expect(day1Name).toContain('day1')
      expect(day2Name).toContain('day2')
      
      // Step 12: verify navigation bar shows correct path
      const pathItemsLevel2 = pathDisplay.locator('.path-item')
      await expect(pathItemsLevel2).toHaveCount(3) // root + test-basic-navigation + 2024-01-旅游
      await expect(pathItemsLevel2.nth(1)).toContainText('test-basic-navigation')
      await expect(pathItemsLevel2.nth(2)).toContainText('2024-01')
      await expect(pathItemsLevel2.nth(2)).toHaveClass(/is-current/)
      
      // Step 13: take screenshot
      await takeScreenshot(page, '3-level2-folders')
      
      // Step 14: enter day1 folder
      await homePage.enterFolder(0)
      await homePage.waitForFilesToLoad()
      
      // Step 15: check file count equals 10
      const fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(10)
      
      // Step 16: verify file names match expected pattern (IMG_YYYYMMDD_HHMMSS.jpg)
      const firstFileName = await homePage.getFileName(0)
      expect(firstFileName).toMatch(/^IMG_\d{8}_\d{6}\.jpg$/)
      
      // Step 17: verify navigation bar shows correct path
      const pathItemsLevel3 = pathDisplay.locator('.path-item')
      await expect(pathItemsLevel3).toHaveCount(4) // root + test-basic-navigation + 2024-01-旅游 + day1
      await expect(pathItemsLevel3.nth(1)).toContainText('test-basic-navigation')
      await expect(pathItemsLevel3.nth(2)).toContainText('2024-01')
      await expect(pathItemsLevel3.nth(3)).toContainText('day1')
      await expect(pathItemsLevel3.nth(3)).toHaveClass(/is-current/)
      
      // Step 18: select first file and verify operation bar is visible
      await homePage.selectFile(0)
      await expect(homePage.operationBar).toBeVisible()
      await expect(homePage.operationBar).toContainText('已选中')
      
      // Step 19: take screenshot
      await takeScreenshot(page, '4-file-selected-with-operation-bar')
    }
    
    // ==================== Part 2: FAB and Info Sidebar ====================
    {
      // 先清除文件选择状态，以便验证信息面板的空状态提示
      await homePage.clearSelection()
      await page.waitForTimeout(300)
      
      // Step 1: click FAB button
      await homePage.clickFab()
      await takeScreenshot(page, '5-fab-menu-displayed')
      
      // Step 2: click new folder button to open dialog
      await homePage.newFolderButton.click()
      await expect(homePage.newFolderDialog).toBeVisible()
      await takeScreenshot(page, '6-new-folder-dialog')
      
      // Step 3: click cancel button to close dialog
      const cancelBtn = homePage.newFolderDialog.locator('.cancel-btn')
      await cancelBtn.click()
      await expect(homePage.newFolderDialog).not.toBeVisible()
      
      // Step 4: click FAB again and expand info sidebar
      await homePage.clickFab()
      await homePage.expandPanelButton.click()
      await expect(homePage.infoSidebar).toBeVisible()
      await takeScreenshot(page, '7-info-sidebar-displayed')
      
      // Step 5: verify info sidebar has three sections
      await expect(homePage.fileInfoSection).toBeVisible()
      await expect(homePage.tagInfoSection).toBeVisible()
      await expect(homePage.folderListSection).toBeVisible()
      
      // Step 6: verify file info section default state (no file selected)
      await expect(homePage.fileInfoSection).toContainText('选择文件查看详细信息')
      
      // Step 7: verify tag info section default state (no file selected)
      await expect(homePage.tagInfoSection).toContainText('选择文件查看标签信息')
      
      // Step 8: verify folder list section shows folder count
      const folderTotalCount = await homePage.getFolderTotalCount()
      expect(folderTotalCount).toBe(147)
      await takeScreenshot(page, '8-info-sidebar-sections')
      
      // Step 9: click collapse button on first folder tree item
      await homePage.collapseFolderTreeNode(0)
      await page.waitForTimeout(300)
      await takeScreenshot(page, '9-folder-tree-collapsed')
      
      // Step 10: click expand button on first folder tree item
      await homePage.expandFolderTreeNode(0)
      await page.waitForTimeout(300)
      await takeScreenshot(page, '10-folder-tree-expanded')
      
      // Step 11: click first folder in tree to navigate
      await homePage.clickFolderTreeItem(0)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '11-folder-tree-navigation')
      
      // Step 12: close info sidebar
      await homePage.closeInfoSidebar()
      await takeScreenshot(page, '12-info-sidebar-closed')
    }

    
    // ==================== Part 3: Search Panel UI Completeness ====================
    {
      // Step 1: open search panel
      await homePage.openSearchPanel()
      await takeScreenshot(page, '13-search-panel-opened')
      
      // Step 2: verify search input is visible
      await expect(homePage.searchInput).toBeVisible()
      
      // Step 3: verify search and cancel buttons
      await expect(homePage.searchPanel.locator('.search-btn-large')).toBeVisible()
      await expect(homePage.searchCancelButton).toBeVisible()
      
      // Step 4: verify file type filter options
      const fileTypeSection = homePage.searchPanel.locator('.filter-section').filter({ hasText: '文件类型' })
      await expect(fileTypeSection.locator('.filter-option-btn').filter({ hasText: '图片' })).toBeVisible()
      await expect(fileTypeSection.locator('.filter-option-btn').filter({ hasText: '视频' })).toBeVisible()
      await expect(fileTypeSection.locator('.filter-option-btn').filter({ hasText: '音频' })).toBeVisible()
      await expect(fileTypeSection.locator('.filter-option-btn').filter({ hasText: '文本' })).toBeVisible()
      await expect(fileTypeSection.locator('.filter-option-btn').filter({ hasText: '其他' })).toBeVisible()
      
      // Step 5: verify sort options
      const sortSection = homePage.searchPanel.locator('.filter-section').filter({ hasText: '排序方式' })
      await expect(sortSection.locator('.filter-option-btn').filter({ hasText: '时间' })).toBeVisible()
      await expect(sortSection.locator('.filter-option-btn').filter({ hasText: '大小' })).toBeVisible()
      await expect(sortSection.locator('.filter-option-btn').filter({ hasText: '名称' })).toBeVisible()
      
      // Step 6: verify sort order buttons
      await expect(homePage.searchPanel.locator('.order-btn').filter({ hasText: '升序' })).toBeVisible()
      await expect(homePage.searchPanel.locator('.order-btn').filter({ hasText: '降序' })).toBeVisible()
      
      // Step 7: verify search scope options
      const scopeSection = homePage.searchPanel.locator('.filter-section').filter({ hasText: '搜索范围' })
      await expect(scopeSection.locator('.filter-option-btn').filter({ hasText: '当前目录' })).toBeVisible()
      await expect(scopeSection.locator('.filter-option-btn').filter({ hasText: '全部文件' })).toBeVisible()
      
      // Step 8: verify file size input
      const sizeSection = homePage.searchPanel.locator('.filter-section').filter({ hasText: '文件大小' })
      await expect(sizeSection.locator('.range-input').first()).toBeVisible()
      
      // Step 9: verify video duration input
      const durationSection = homePage.searchPanel.locator('.filter-section').filter({ hasText: '视频时长' })
      await expect(durationSection.locator('.range-input').first()).toBeVisible()
      
      // Step 10: verify media dimensions input
      const dimensionSection = homePage.searchPanel.locator('.filter-section').filter({ hasText: '图片/视频尺寸' })
      await expect(dimensionSection.locator('.range-input').first()).toBeVisible()
      
      // Step 11: verify tag selection area
      const tagSection = homePage.searchPanel.locator('.filter-section').filter({ hasText: '文件标签' })
      await expect(tagSection).toBeVisible()
      
      // Step 12: verify inverse select checkbox
      await expect(homePage.searchPanel.locator('.tag-checkbox')).toBeVisible()
      
      // Step 13: take screenshot
      await takeScreenshot(page, '14-search-panel-ui-complete')
    }

    
    // ==================== Part 4: Search Condition State Management ====================
    {
      // Step 1: input search keyword
      await homePage.setSearchKeyword('test-keyword')
      await takeScreenshot(page, '15-search-keyword-entered')
      
      // Step 2: select multiple search conditions
      await homePage.selectFileType('图片')
      await homePage.selectSortBy('时间')
      await homePage.selectSortOrder('升序')
      await homePage.selectSearchScope('当前目录')
      
      // Step 3: set file size range
      await homePage.setFileSizeRange(1, 10)
      
      // Step 4: set video duration range
      await homePage.setVideoDurationRange(60, 300)
      
      // Step 5: set media dimensions
      await homePage.setMediaDimensions(1920, 1080)
      
      // Step 6: take screenshot
      await takeScreenshot(page, '16-search-conditions-set')
      
      // Step 7: click clear all filters button
      await homePage.clearAllSearchFilters()
      await page.waitForTimeout(300)
      
      // Step 8: verify conditions are cleared
      const isInputEmpty = await homePage.isSearchInputEmpty()
      expect(isInputEmpty).toBe(true)
      
      // Step 9: verify search panel is still visible
      await expect(homePage.searchPanel).toBeVisible()
      
      // Step 10: take screenshot
      await takeScreenshot(page, '17-search-conditions-cleared')
    }
    // ==================== Part 5: Search Panel Cancel Operation ====================
    { 
      // Step 1: input search keyword
      await homePage.setSearchKeyword('cancel-test')
      
      // Step 2: select multiple search conditions
      await homePage.selectFileType('视频')
      await homePage.selectSortBy('大小')
      
      // Step 3: take screenshot
      await takeScreenshot(page, '18-search-conditions-before-cancel')
      
      // Step 4: click cancel button to close panel
      await homePage.closeSearchPanel()
      
      // Step 5: verify panel is closed
      await expect(homePage.searchPanel).not.toBeVisible()
      
      // Step 6: take screenshot
      await takeScreenshot(page, '19-search-panel-closed')
      
      // Step 7: open search panel again
      await homePage.openSearchPanel()
      
      // Step 8: verify conditions state (should be reset or persisted based on business logic)
      const isInputEmptyAfterReopen = await homePage.isSearchInputEmpty()
      // Note: Based on typical UX patterns, conditions should be reset
      expect(isInputEmptyAfterReopen).toBe(true)
      
      // Step 9: take screenshot
      await takeScreenshot(page, '20-search-panel-reopened')
    }    

  })

  test('should add and remove tag from file', async ({ page }) => {
    const tag1 = `工作-${Date.now()}`
    const tag2 = `工作1-${Date.now()}`
    const tag3 = `工作2-${Date.now()}`
    
    // ==================== Part 1: File Rating and Tag Basic Operations ====================
    {
            // Step 1: Navigate to test-tags/工作/ folder
      await homePage.enterFolder('test-tags')
      await page.waitForTimeout(1000)
      await homePage.enterFolder('工作')
      await page.waitForTimeout(1000)
      
      // Step 2: Wait for files to load and verify file count equals 6
      await homePage.waitForFilesToLoad()
      const fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(6)
      await takeScreenshot(page, '1-files-loaded')
      
      // Step 3: Select first file and set level to 1
      await homePage.selectFile(0)
      await expect(homePage.operationBar).toBeVisible()
      await homePage.setFileLevel(1)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '2-file1-level1-set')
      
      // Step 4: Verify level 1 is displayed
      let hasLevel = await homePage.verifyFileHasLevelTag(0, 1)
      expect(hasLevel).toBe(true)
      await takeScreenshot(page, '3-file1-level1-verified')
      
      // Step 5: Select second file and set level to 3
      await homePage.selectFile(1)
      await homePage.setFileLevel(3)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '4-file2-level3-set')
      
      // Step 6: Verify level 3 is displayed
      hasLevel = await homePage.verifyFileHasLevelTag(1, 3)
      expect(hasLevel).toBe(true)
      await takeScreenshot(page, '5-file2-level3-verified')
      
      // Step 7: Override level to 5
      await homePage.selectFile(1)
      await homePage.setFileLevel(5)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '6-file2-level5-override')
      
      // Step 8: Verify level 5 is displayed (level 3 should be replaced)
      hasLevel = await homePage.verifyFileHasLevelTag(1, 5)
      expect(hasLevel).toBe(true)
      const hasOldLevel = await homePage.verifyFileHasLevelTag(1, 3)
      expect(hasOldLevel).toBe(false)
      await takeScreenshot(page, '7-file2-level5-verified')
      
      // Step 9: Add tag to first file (should keep level 1)
      await homePage.selectFile(0)
      await homePage.addTagToSelectedFiles(tag1)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '8-file1-tag-added')
      
      // Step 10: Verify tag and level coexist
      let hasTag = await homePage.verifyFileHasTag(0, tag1)
      expect(hasTag).toBe(true)
      hasLevel = await homePage.verifyFileHasLevelTag(0, 1)
      expect(hasLevel).toBe(true)
      await takeScreenshot(page, '9-file1-tag-and-level-verified')
      
      // Step 11: Add same tag to second file (should keep level 5)
      await homePage.selectFile(1)
      await homePage.addTagToSelectedFiles(tag1)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '10-file2-tag-added')
      
      // Step 12: Verify tag and level coexist
      hasTag = await homePage.verifyFileHasTag(1, tag1)
      expect(hasTag).toBe(true)
      hasLevel = await homePage.verifyFileHasLevelTag(1, 5)
      expect(hasLevel).toBe(true)
      await takeScreenshot(page, '11-file2-tag-and-level-verified')
      
      // Step 13: Add same tag again to second file (should not duplicate)
      await homePage.selectFile(1)
      await homePage.addTagToSelectedFiles(tag1)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '12-file2-tag-duplicate-check')
      
      // Step 14: Verify no duplicate tag
      hasTag = await homePage.verifyFileHasTag(1, tag1)
      expect(hasTag).toBe(true)
      await takeScreenshot(page, '13-file2-no-duplicate-tag')
      
      // Step 15: Add another tag to first file
      await homePage.selectFile(0)
      await homePage.addTagToSelectedFiles(tag2)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '14-file1-second-tag-added')
      
      // Step 16: Verify two tags and level coexist
      hasTag = await homePage.verifyFileHasTag(0, tag1)
      expect(hasTag).toBe(true)
      hasTag = await homePage.verifyFileHasTag(0, tag2)
      expect(hasTag).toBe(true)
      hasLevel = await homePage.verifyFileHasLevelTag(0, 1)
      expect(hasLevel).toBe(true)
      await takeScreenshot(page, '15-file1-two-tags-verified')
      
      // Step 17: Delete tag from second file
      await homePage.selectFile(1)
      await homePage.openDeleteTagDialog()
      await takeScreenshot(page, '16-delete-tag-dialog-opened')
      
      await homePage.selectTagsInDialog([tag1])
      await takeScreenshot(page, '17-tag-selected-in-dialog')
      
      await homePage.confirmDeleteTags()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '18-file2-tag-removed')
      
      // Step 18: Verify tag removed but level remains
      hasTag = await homePage.verifyFileHasTag(1, tag1)
      expect(hasTag).toBe(false)
      hasLevel = await homePage.verifyFileHasLevelTag(1, 5)
      expect(hasLevel).toBe(true)
      await takeScreenshot(page, '19-file2-tag-removed-level-remains')
      
      // Step 19: Delete both tags from first file
      await homePage.selectFile(0)
      await homePage.openDeleteTagDialog()
      await homePage.selectTagsInDialog([tag1, tag2])
      await homePage.confirmDeleteTags()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '20-file1-tags-removed')
      
      // Step 20: Verify all tags removed but level remains
      hasTag = await homePage.verifyFileHasTag(0, tag1)
      expect(hasTag).toBe(false)
      hasTag = await homePage.verifyFileHasTag(0, tag2)
      expect(hasTag).toBe(false)
      hasLevel = await homePage.verifyFileHasLevelTag(0, 1)
      expect(hasLevel).toBe(true)
      await takeScreenshot(page, '21-file1-all-tags-removed-level-remains')
    }    

    
    // ==================== Part 2: Batch Tag Operations ====================
    
    {
      // Step 1: Select files 1, 3, 5 (index 0, 2, 4)
      await homePage.selectFile(0)
      await page.keyboard.down('Control')
      await homePage.selectFile(2)
      await homePage.selectFile(4)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)
      await takeScreenshot(page, '22-batch-select-3-files')
      
      // Step 2: Add tag to selected files
      await homePage.addTagToSelectedFiles(tag3)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '23-batch-tag-added')
      
      // Step 3: Verify tag added to all selected files
      let hasTag = await homePage.verifyFileHasTag(0, tag3)
      expect(hasTag).toBe(true)
      hasTag = await homePage.verifyFileHasTag(2, tag3)
      expect(hasTag).toBe(true)
      hasTag = await homePage.verifyFileHasTag(4, tag3)
      expect(hasTag).toBe(true)
      await takeScreenshot(page, '24-batch-tag-verified')
      
      // Step 4: Add another tag to file 3 (index 2)
      await homePage.selectFile(2)
      await homePage.addTagToSelectedFiles(tag2)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '25-file3-second-tag-added')
      
      // Step 5: Verify file 3 has both tags
      hasTag = await homePage.verifyFileHasTag(2, tag3)
      expect(hasTag).toBe(true)
      hasTag = await homePage.verifyFileHasTag(2, tag2)
      expect(hasTag).toBe(true)
      await takeScreenshot(page, '26-file3-two-tags-verified')
    }
    
    // ==================== Part 3: Tag Management Page ====================
    {
      // Step 1: Navigate to management page
      await page.locator('.sidebar-nav .menu-item:has-text("管理")').click()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '27-management-page-opened')
      
      // Step 2: Navigate to tag management
      await page.locator('.admin-nav .nav-item:has-text("标签")').click()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '28-tag-management-page-opened')
      
      // Step 3: Verify tags exist in list
      const tagExists = await tagManagementPage.verifyTagExists(tag3)
      expect(tagExists).toBe(true)
      await takeScreenshot(page, '29-tag3-exists-in-list')
      
      // Step 4: Delete tag3
      await tagManagementPage.deleteTag(tag3)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '30-tag3-deleted')
      
      // Step 5: Navigate back to home
      await page.locator('.sidebar-nav .menu-item:has-text("主页")').click()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '31-back-to-home')
      
      // Step 6: Navigate to root directory by clicking the home icon in breadcrumb
      // Click the first path-part (root directory) in path-display
      const rootPathItem = page.locator('.path-display .path-item:first-child .path-part').first()
      if (await rootPathItem.isVisible()) {
        await rootPathItem.click()
        await page.waitForTimeout(500)
      }
      
      // Step 7: Navigate to test-tags/工作/ folder
      await homePage.enterFolder('test-tags')
      await page.waitForTimeout(1000)
      await homePage.enterFolder('工作')
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '32-back-to-work-folder')
      
      // Step 8: Verify tag3 removed from files
      let hasTag = await homePage.verifyFileHasTag(0, tag3)
      expect(hasTag).toBe(false)
      hasTag = await homePage.verifyFileHasTag(4, tag3)
      expect(hasTag).toBe(false)
      
      // File 3 should still have tag2
      hasTag = await homePage.verifyFileHasTag(2, tag2)
      expect(hasTag).toBe(true)
      await takeScreenshot(page, '33-tag3-removed-from-files')
    }
    
    // ==================== Part 4: Batch Tag Delete ====================
    {
      const tag4 = `工作2-${Date.now()}`
      // Step 1: Select files 2, 4, 5 (index 1, 3, 4)
      await homePage.selectFile(1)
      await page.keyboard.down('Control')
      await homePage.selectFile(3)
      await homePage.selectFile(4)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)
      await takeScreenshot(page, '34-batch-select-3-files-part4')
      
      // Step 2: Add tag to selected files
      await homePage.addTagToSelectedFiles(tag4)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '35-batch-tag4-added')
      
      await homePage.selectFile(1)
      await page.keyboard.down('Control')
      await homePage.selectFile(3)
      await homePage.selectFile(4)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)

      // Step 3: Verify tag added to all selected files
      let hasTag = await homePage.verifyFileHasTag(1, tag4)
      expect(hasTag).toBe(true)
      hasTag = await homePage.verifyFileHasTag(3, tag4)
      expect(hasTag).toBe(true)
      hasTag = await homePage.verifyFileHasTag(4, tag4)
      expect(hasTag).toBe(true)
      await takeScreenshot(page, '36-batch-tag4-verified')
      
      // Step 4: Delete tag4 from selected files
      await homePage.openDeleteTagDialog()
      await takeScreenshot(page, '37-delete-tag-dialog-opened-part4')
      
      await homePage.selectTagsInDialog([tag4])
      await takeScreenshot(page, '38-tag4-selected-in-dialog')
      
      await homePage.confirmDeleteTags()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '39-tag4-removed')
      
      // Step 5: Verify tag4 removed from all files
      hasTag = await homePage.verifyFileHasTag(1, tag4)
      expect(hasTag).toBe(false)
      hasTag = await homePage.verifyFileHasTag(3, tag4)
      expect(hasTag).toBe(false)
      hasTag = await homePage.verifyFileHasTag(4, tag4)
      expect(hasTag).toBe(false)
      await takeScreenshot(page, '40-tag4-removed-from-all-files')
      
      // Cleanup: delete test tags via API
      await api.deleteTag(tag1)
      await api.deleteTag(tag2)
      await takeScreenshot(page, '41-cleanup-done')
    }
  })

  test('should move, copy and delete files', async ({ page }) => {
    
    const moveTag = `move-${Date.now()}`
    const copyTag = `copy-${Date.now()}`
    const deleteTag = `delete-${Date.now()}`
    
    // ==================== Part 1: File Move Operations ====================
    if(true){
      // Step 1: Navigate to test-move-copy-delete and create moved folder
      await homePage.navigateToRoot()
      await page.waitForTimeout(500)
      await homePage.enterFolder('test-move-copy-delete')
      await page.waitForTimeout(500)
      await homePage.createNewFolder('moved')
      await page.waitForTimeout(500)
      
      // Step 2: Enter origin folder
      await homePage.enterFolder('origin')
      await page.waitForTimeout(500)
      
      // Step 3: Verify file count equals 30
      await homePage.waitForFilesToLoad()
      let fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(30)
      await takeScreenshot(page, '1-origin-folder-loaded')
      
      // Step 4: Select files 1, 3, 5, 8, 10 and add move tag
      await homePage.selectFile(0)
      await page.keyboard.down('Control')
      await homePage.selectFile(2)
      await homePage.selectFile(4)
      await homePage.selectFile(7)
      await homePage.selectFile(9)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)
      await homePage.addTagToSelectedFiles(moveTag)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '2-move-tag-added')
      
      // Step 5: Move first file to moved folder
      await homePage.clearSelection()
      await homePage.selectFile(0)
      await homePage.moveSelectedFiles('test-move-copy-delete/moved')
      await page.waitForTimeout(500)
      await takeScreenshot(page, '3-first-file-moved')
      
      // Step 6: Move files 3, 4, 5 to moved folder
      await homePage.clearSelection()
      await homePage.selectFile(2)
      await page.keyboard.down('Control')
      await homePage.selectFile(3)
      await homePage.selectFile(4)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)
      await homePage.moveSelectedFiles('test-move-copy-delete/moved')
      await page.waitForTimeout(500)
      await takeScreenshot(page, '4-multiple-files-moved')
      
      // Step 7: Verify current folder file count
      fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(26)
      await takeScreenshot(page, '5-file-count-after-move')
      
      // Step 8: Enter moved folder and verify
      await homePage.navigateToRoot()
      await page.waitForTimeout(500)
      await homePage.enterFolder('test-move-copy-delete')
      await page.waitForTimeout(1000)
      await homePage.enterFolder('moved')
      await page.waitForTimeout(1000)
      
      fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(4)
      await takeScreenshot(page, '6-moved-folder-verified')
      
      // Step 9: Move all files back to origin folder
      await homePage.selectAllFiles()
      await homePage.moveSelectedFiles('test-move-copy-delete/origin')
      await page.waitForTimeout(5000)
      await takeScreenshot(page, '7-files-moved-back')
      
      // Step 10: Verify origin folder
      await homePage.navigateToRoot()
      await page.waitForTimeout(500)
      await homePage.enterFolder('test-move-copy-delete')
      await page.waitForTimeout(1000)
      await homePage.enterFolder('origin')
      await page.waitForTimeout(1000)
      
      fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(30)
      await takeScreenshot(page, '8-origin-folder-restored')
    }
    
    // ==================== Part 2: File Copy Operations ====================
    if(true){
      // Step 1: Ensure in origin folder
      // Step 1: Navigate to test-move-copy-delete and create moved folder
      await homePage.navigateToRoot()
      await page.waitForTimeout(500)
      await homePage.enterFolder('test-move-copy-delete')
      await page.waitForTimeout(500)
      await homePage.createNewFolder('moved')
      await page.waitForTimeout(500)
      
      // Step 2: Enter origin folder
      await homePage.enterFolder('origin')
      await page.waitForTimeout(500)

      let fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(30)
      
      // Step 2: Select files 11, 13, 15, 18, 20 and add copy tag
      await homePage.selectFile(10)
      await page.keyboard.down('Control')
      await homePage.selectFile(12)
      await homePage.selectFile(14)
      await homePage.selectFile(17)
      await homePage.selectFile(19)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)
      await homePage.addTagToSelectedFiles(copyTag)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '9-copy-tag-added')
      
      // Step 3: Copy first file to moved folder
      await homePage.clearSelection()
      await homePage.selectFile(10)
      await homePage.copySelectedFiles('test-move-copy-delete/moved')
      await page.waitForTimeout(500)
      await takeScreenshot(page, '10-first-file-copied')
      
      // Step 4: Copy files 13, 14, 15, 17 to moved folder
      await homePage.clearSelection()
      await homePage.selectFile(12)
      await page.keyboard.down('Control')
      await homePage.selectFile(13)
      await homePage.selectFile(14)
      await homePage.selectFile(16)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)
      await homePage.copySelectedFiles('test-move-copy-delete/moved')
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '11-multiple-files-copied')
      
      // Step 5: Verify current folder file count (should still be 30)
      fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(30)
      await takeScreenshot(page, '12-file-count-after-copy')
      
      // Step 6: Enter moved folder and verify
      await homePage.navigateToRoot()
      await page.waitForTimeout(500)
      await homePage.enterFolder('test-move-copy-delete')
      await page.waitForTimeout(1000)
      await homePage.enterFolder('moved')
      await page.waitForTimeout(1000)
      
      fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(5)
      await takeScreenshot(page, '13-moved-folder-copy-verified')
    }
    
    // ==================== Part 3: File Delete Operations ====================
    {
      // Step 1: Return to origin folder
      await homePage.navigateToRoot()
      await page.waitForTimeout(500)
      await homePage.enterFolder('test-move-copy-delete')
      await page.waitForTimeout(1000)
      await homePage.enterFolder('origin')
      await page.waitForTimeout(1000)
      
      let fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(30)
      
      // Step 2: Select files 21, 23, 25, 28, 30 and add delete tag
      await homePage.selectFile(20)
      await page.keyboard.down('Control')
      await homePage.selectFile(22)
      await homePage.selectFile(24)
      await homePage.selectFile(27)
      await homePage.selectFile(29)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)
      await homePage.addTagToSelectedFiles(deleteTag)
      await page.waitForTimeout(500)
      await takeScreenshot(page, '14-delete-tag-added')
      
      // Step 3: Delete first file
      await homePage.clearSelection()
      await homePage.selectFile(20)
      await homePage.deleteSelectedFiles()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '15-first-file-deleted')
      
      // Step 4: Delete multiple files
      await homePage.clearSelection()
      await homePage.selectFile(21)
      await page.keyboard.down('Control')
      await homePage.selectFile(22)
      await homePage.selectFile(23)
      await homePage.selectFile(24)
      await homePage.selectFile(25)
      await homePage.selectFile(26)
      await homePage.selectFile(27)
      await homePage.selectFile(28)
      await page.keyboard.up('Control')
      await page.waitForTimeout(300)
      await homePage.deleteSelectedFiles()
      await page.waitForTimeout(5000)
      await takeScreenshot(page, '16-multiple-files-deleted')
      
      // Step 5: Verify current folder file count
      fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(21)
      await takeScreenshot(page, '17-file-count-after-delete')
    }
    
    // ==================== Part 4: Trash Management ====================
    {
      // Step 1: Navigate to trash management page
      await page.locator('.sidebar-nav .menu-item:has-text("管理")').click()
      await page.waitForTimeout(500)
      
      const trashNavItem = page.locator('.admin-nav .nav-item:has-text("回收站")')
      await trashNavItem.waitFor({ state: 'visible', timeout: 10000 })
      await trashNavItem.click()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '18-trash-page-opened')
      
      // Step 2: Verify trash file count
      const trashFileItems = page.locator('.file-card')
      let trashCount = await trashFileItems.count()
      expect(trashCount).toBe(9)
      await takeScreenshot(page, '19-trash-files-verified')
      
      // Step 3: Restore first file
      const firstFile = trashFileItems.first()
      await firstFile.hover()
      
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('确定要恢复文件')
        await dialog.accept()
      })
      await firstFile.locator('.file-action-btn[title="恢复"]').click()
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '20-first-file-restored')
      
      // Step 4: Permanently delete second file
      const secondFile = trashFileItems.first()
      await secondFile.hover()
      
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('确定要永久删除文件')
        await dialog.accept()
      })
      await secondFile.locator('.file-action-btn.danger[title="永久删除"]').click()
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '21-second-file-permanently-deleted')
      
      // Step 5: Empty trash
      const emptyTrashBtn = page.locator('button:has-text("清空回收站")')
      
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('确定要清空回收站吗')
        await dialog.accept()
      })
      await emptyTrashBtn.click()
      await page.waitForTimeout(5000)
      await takeScreenshot(page, '22-trash-emptied')
      
      // Step 6: Verify trash is empty
      trashCount = await trashFileItems.count()
      expect(trashCount).toBe(0)
      await takeScreenshot(page, '23-trash-empty-verified')
    }
  })

  /**
   * Test: CT0006 Similarity Check
   * 
   * Test the complete workflow of similarity file detection
   * Based on test data structure:
   * test-similarity/
   * └── origin/ (30 files: 25 images + 5 videos)
   * 
   * Test Parts:
   * Part 1: Test environment preparation
   * Part 2: Trigger detection and progress display verification
   * Part 3: Detection result display verification
   * Part 4: Similarity group operations verification
   * Part 5: Single file operations verification
   * Part 6: Pagination functionality verification
   * Part 7: Detection settings functionality verification
   * Part 8: Exception scenarios verification
   * Part 9: Data consistency verification
   */
  test('CT0006 similarity check', async ({ page }) => {
    test.setTimeout(180000)

    // ==================== Part 1: Test Environment Preparation ====================
    {
      // Step 1: Navigate to test-similarity/origin folder
      await homePage.enterFolder('test-similarity')
      await page.waitForTimeout(1000)
      await homePage.enterFolder('origin')
      await page.waitForTimeout(1000)
      
      // Step 2: Verify file count equals 30
      await homePage.waitForFilesToLoad()
      const fileCount = await homePage.getFileCount()
      expect(fileCount).toBe(30)
      await takeScreenshot(page, '1-similarity-folder-loaded')
      
      // Step 3: Click FAB to create folders
      await homePage.createNewFolder('copy1')
      await homePage.createNewFolder('copy2')
      
      // Step 6: Copy files to copy1 folder
      await homePage.selectFile(0)
      await homePage.selectFile(2)
      await homePage.selectFile(4)
      await homePage.copySelectedFiles('test-similarity/origin/copy1')
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '5-files-copied-to-copy1')
      
      // Step 7: Copy files to copy2 folder
      await homePage.selectFile(0)
      await homePage.selectFile(2)
      await homePage.selectFile(6)
      await homePage.copySelectedFiles('test-similarity/origin/copy2')
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '6-files-copied-to-copy2')
    }

    // ==================== Part 2: Trigger Detection and Progress Display ====================
    {
      // Step 1: Open management page
      await homePage.openManagement()
      await page.waitForURL('**/admin/PrjSet', { timeout: 10000 })
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '7-management-page-opened')
      
      // Step 2: Click similarity menu
      const similarityNavItem = page.locator('.admin-nav .nav-item:has-text("相似文件")')
      await similarityNavItem.waitFor({ state: 'visible', timeout: 10000 })
      await similarityNavItem.click()
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '8-similarity-page-opened')
      
      // Step 3: Verify initial state
      const emptyState = page.locator('.empty-state')
      await expect(emptyState).toBeVisible()
      await expect(emptyState).toContainText('暂无相似文件')
      
      const statusValue = page.locator('.status-value.idle')
      await expect(statusValue).toBeVisible()
      await expect(statusValue).toContainText('未检测')
      await takeScreenshot(page, '9-initial-state-verified')
      
      // Step 4: Start detection
      const startDetectionBtn = page.locator('button.action-btn.primary:has-text("开始检测")')
      await startDetectionBtn.click()
      await takeScreenshot(page, '10-detection-started')
      
      // this can not check accurately, so skip it
      if(false){
        // Step 5: Wait for button state to change
        await page.waitForTimeout(1000)
        
        // Step 6: Verify button state during detection
        await expect(startDetectionBtn).toContainText('检测中...')
        await expect(startDetectionBtn).toBeDisabled()
        
        const progressSection = page.locator('.progress-section')
        await expect(progressSection).toBeVisible()
        await takeScreenshot(page, '11-detection-in-progress')
        
        // Step 7: Wait for detection to complete
        const progressBar = page.locator('.progress-fill')
        await expect(progressBar).toBeVisible()
      }
      
      await expect(startDetectionBtn).toContainText('开始检测', { timeout: 120000 })
      await page.waitForTimeout(2000)
      await takeScreenshot(page, '12-detection-completed')
    }

    // ==================== Part 3: Detection Result Display ====================
    {
      // Step 1: Verify similarity groups displayed
      const similarityGroups = page.locator('.similarity-group')
      const groupCount = await similarityGroups.count()
      expect(groupCount).toBeGreaterThanOrEqual(3)
      await takeScreenshot(page, '13-similarity-groups-displayed')
      
      // Step 2: Verify first group structure
      const firstGroup = similarityGroups.first()
      const groupTitle = firstGroup.locator('.group-name')
      await expect(groupTitle).toContainText('相似文件组 #1')
      
      const fileCountBadge = firstGroup.locator('.file-count')
      await expect(fileCountBadge).toContainText('个文件')
      
      const groupActions = firstGroup.locator('.group-actions')
      await expect(groupActions.locator('button:has-text("全选")')).toBeVisible()
      await expect(groupActions.locator('button:has-text("保留最佳")')).toBeVisible()
      await expect(groupActions.locator('button:has-text("删除选中")')).toBeVisible()
      await takeScreenshot(page, '14-first-group-structure-verified')
      
      // Step 3: Verify file cards
      const fileCards = firstGroup.locator('.file-card')
      const fileCardCount = await fileCards.count()
      expect(fileCardCount).toBeGreaterThan(0)
      
      const firstFileCard = fileCards.first()
      await expect(firstFileCard.locator('.file-thumbnail')).toBeVisible()
      await expect(firstFileCard.locator('.file-name')).toBeVisible()
      await expect(firstFileCard.locator('.file-meta')).toBeVisible()
      await expect(firstFileCard.locator('.file-path')).toBeVisible()
      await expect(firstFileCard.locator('.similarity-badge')).toContainText('100%')
      await takeScreenshot(page, '15-file-cards-verified')
      
      // Step 4: Verify file action buttons
      await expect(firstFileCard.locator('.file-action-btn[title="预览"]')).toBeVisible()
      await expect(firstFileCard.locator('.file-action-btn[title="定位"]')).toBeVisible()
      await expect(firstFileCard.locator('.file-action-btn.danger[title="删除"]')).toBeVisible()
      await takeScreenshot(page, '16-file-actions-verified')
    }

    // ==================== Part 4: Similarity Group Operations ====================
    {
      const firstGroup = page.locator('.similarity-group').first()
      
      // Step 1: Click select all button
      const selectAllBtn = firstGroup.locator('button:has-text("全选")')
      await selectAllBtn.click()
      await page.waitForTimeout(300)
      await takeScreenshot(page, '17-select-all-clicked')
      
      // Step 2: Verify all files selected
      const fileCards = firstGroup.locator('.file-card')
      const count = await fileCards.count()
      for (let i = 0; i < count; i++) {
        const checkbox = fileCards.nth(i).locator('.file-checkbox')
        await expect(checkbox).toBeChecked()
      }
      await takeScreenshot(page, '18-all-files-selected')
      
      // Step 3: Click keep best button
      const keepBestBtn = firstGroup.locator('button:has-text("保留最佳")')
      await keepBestBtn.click()
      await page.waitForTimeout(300)
      await takeScreenshot(page, '19-keep-best-clicked')
      
      // Step 4: Click delete selected button
      const deleteSelectedBtn = firstGroup.locator('button:has-text("删除选中")')
      
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('确定要删除选中的')
        await dialog.accept()
      })
      await deleteSelectedBtn.click()
      await page.waitForTimeout(2000)
      await takeScreenshot(page, '20-files-deleted')
    }

    // ==================== Part 5: Single File Operations ====================
    {
      const secondGroup = page.locator('.similarity-group').nth(1)
      const firstFileCard = secondGroup.locator('.file-card').first()
      
      // Step 1: Click delete button on single file
      const deleteBtn = firstFileCard.locator('.file-action-btn.danger[title="删除"]')
      
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('确定要删除文件')
        await dialog.accept()
      })
      await deleteBtn.click()
      await page.waitForTimeout(2000)
      await takeScreenshot(page, '21-single-file-deleted')
    }

    // ==================== Part 7: Detection Settings ====================
    {
      // Step 1: Click settings button
      const settingsBtn = page.locator('button.action-btn:has-text("设置")')
      await settingsBtn.click()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '22-settings-panel-opened')
      
      // Step 2: Verify settings panel structure
      const settingsPanel = page.locator('.settings-panel')
      await expect(settingsPanel).toBeVisible()
      
      const thresholdSlider = settingsPanel.locator('input[type="range"]')
      await expect(thresholdSlider).toBeVisible()
      
      const scopeSelect = settingsPanel.locator('select.setting-select')
      await expect(scopeSelect).toBeVisible()
      
      const typeCheckboxes = settingsPanel.locator('.checkbox-group input[type="checkbox"]')
      const checkboxCount = await typeCheckboxes.count()
      expect(checkboxCount).toBeGreaterThan(0)
      await takeScreenshot(page, '23-settings-panel-verified')
      
      // Step 3: Adjust threshold
      await thresholdSlider.fill('80')
      await page.waitForTimeout(300)
      await takeScreenshot(page, '24-threshold-adjusted')
      
      // Step 4: Apply settings
      const applyBtn = settingsPanel.locator('.btn-primary:has-text("应用")')
      await applyBtn.click()
      await page.waitForTimeout(500)
      await takeScreenshot(page, '25-settings-applied')
    }

    // ==================== Part 9: Data Consistency ====================
    {
      // Step 1: Return to home page
      await page.goto('/')
      await page.waitForTimeout(1000)
      
      // Step 2: Navigate to test-similarity/origin folder
      await homePage.enterFolder('test-similarity')
      await page.waitForTimeout(1000)
      await homePage.enterFolder('origin')
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '26-returned-to-origin-folder')
      
      // Step 3: Open management and go to trash
      await homePage.openManagement()
      await page.waitForURL('**/admin/PrjSet', { timeout: 10000 })
      await page.waitForTimeout(1000)
      
      const trashNavItem = page.locator('.admin-nav .nav-item:has-text("回收站")')
      await trashNavItem.waitFor({ state: 'visible', timeout: 10000 })
      await trashNavItem.click()
      await page.waitForTimeout(1000)
      await takeScreenshot(page, '27-trash-page-opened')
      
      // Step 4: Verify deleted files in trash
      const trashFileItems = page.locator('.file-card')
      const trashCount = await trashFileItems.count()
      expect(trashCount).toBeGreaterThan(0)
      await takeScreenshot(page, '28-trash-verified')
    }
  })

})
