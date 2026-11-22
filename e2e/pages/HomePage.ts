/**
 * 主页Page Object
 * 
 * 本文件实现了主页的Page Object Model，封装了主页的元素定位和操作方法。
 * 主页是用户进入应用后看到的第一个页面，包含导航菜单、文件浏览器、搜索功能等。
 * 
 * Page Object Model优势：
 * 1. 可维护性：页面变化只需修改Page Object，不影响测试用例
 * 2. 可重用性：多个测试可以重用同一个Page Object
 * 3. 可读性：测试代码更易读，像自然语言描述
 * 4. 稳定性：封装了等待和重试逻辑，提高测试稳定性
 * 
 * 设计原则：
 * - 元素定位器集中管理：所有定位器在构造函数中定义
 * - 方法语义化：方法名清晰表达操作意图
 * - 包含验证：方法内部包含必要的验证逻辑
 * 
 * @example
 * // 在测试中使用
 * test('should navigate to management', async ({ page }) => {
 *   const homePage = new HomePage(page)
 *   await homePage.goto()
 *   await homePage.openManagement()
 * })
 */

import { Page, Locator, expect } from '@playwright/test'

/**
 * 主页Page Object类
 * 
 * 封装了主页的所有元素和操作，提供简洁的接口供测试使用
 * 
 * @example
 * const homePage = new HomePage(page)
 * await homePage.goto()
 * await homePage.openManagement()
 */
export class HomePage {
  // ==================== 页面元素定义 ====================
  
  /**
   * Page对象引用
   * 用于执行页面级别的操作，如导航、等待等
   */
  readonly page: Page
  
  /**
   * 导航菜单
   * 侧边栏导航菜单，包含主页、管理、设置等入口
   */
  readonly navMenu: Locator
  
  /**
   * 管理按钮
   * 点击后进入管理界面，包含标签管理、回收站、相似度检测等功能
   */
  readonly managementButton: Locator
  
  /**
   * 设置按钮
   * 点击后进入设置界面，配置应用参数
   */
  readonly settingsButton: Locator
  
  /**
   * 文件浏览器
   * 主页中央区域，显示当前仓库的文件列表
   */
  readonly fileExplorer: Locator
  
  /**
   * 搜索触发器
   * 点击后展开搜索面板
   */
  readonly searchTrigger: Locator
  
  /**
   * 搜索输入框
   * 用于输入搜索关键词
   */
  readonly searchInput: Locator
  
  /**
   * 文件卡片列表
   * 所有文件卡片的容器
   */
  readonly fileCards: Locator
  
  /**
   * 文件夹卡片列表
   * 所有文件夹卡片的容器
   */
  readonly folderCards: Locator
  
  /**
   * 卡片右上角三个点菜单（NDropdown 弹出层）
   * 点击卡片菜单按钮后显示的操作选项
   */
  readonly cardMenu: Locator

  /**
   * 标签输入框
   * 用于添加标签
   */
  readonly tagInput: Locator

  /**
   * 浮动操作按钮（FAB）
   * 点击后显示新建文件夹、展开面板等选项
   */
  readonly fab: Locator

  /**
   * 浮动操作栏
   * FAB点击后显示的操作选项
   */
  readonly fabMenu: Locator

  /**
   * 新建文件夹按钮
   * FAB菜单中的新建文件夹选项
   */
  readonly newFolderButton: Locator

  /**
   * 展开面板按钮
   * FAB菜单中的展开信息面板选项
   */
  readonly expandPanelButton: Locator

  /**
   * 信息面板（Info Sidebar）
   * 右侧信息面板，包含文件信息、标签信息、文件夹列表
   */
  readonly infoSidebar: Locator

  /**
   * 文件信息区域
   * 信息面板中的文件信息Section
   */
  readonly fileInfoSection: Locator

  /**
   * 标签信息区域
   * 信息面板中的标签信息Section
   */
  readonly tagInfoSection: Locator

  /**
   * 文件夹列表区域
   * 信息面板中的文件夹列表Section
   */
  readonly folderListSection: Locator

  /**
   * 搜索面板
   * 搜索功能面板
   */
  readonly searchPanel: Locator

  /**
   * 搜索面板取消按钮
   */
  readonly searchCancelButton: Locator

  /**
   * 搜索面板清空按钮
   */
  readonly searchClearButton: Locator

  /**
   * 新建文件夹对话框
   */
  readonly newFolderDialog: Locator

  // ==================== 构造函数 ====================
  
  /**
   * 构造函数：初始化所有页面元素定位器
   * 
   * @param page - Playwright的Page对象，由测试框架自动注入
   * 
   * 定位器说明：
   * - 使用CSS选择器和文本选择器组合
   * - 选择器应该稳定，不易受UI变化影响
   * - 避免使用脆弱的选择器（如nth-child、复杂的DOM结构）
   * 
   * @example
   * // Playwright会自动注入page对象
   * test('test', async ({ page }) => {
   *   const homePage = new HomePage(page)
   * })
   */
  constructor(page: Page) {
    this.page = page
    
    // 导航菜单：侧边栏导航区域
    this.navMenu = page.locator('.sidebar-nav')
    
    // 管理按钮：包含"管理"文本的菜单项
    this.managementButton = page.locator('.menu-item:has-text("管理")')
    
    // 设置按钮：包含"设置"文本的菜单项
    this.settingsButton = page.locator('.menu-item:has-text("设置")')
    
    // 文件浏览器：文件列表展示区域
    this.fileExplorer = page.locator('.file-explorer-section')
    
    // 搜索触发器：搜索按钮或图标
    this.searchTrigger = page.locator('.search-trigger')
    
    // 搜索输入框：搜索面板中的输入框
    this.searchInput = page.locator('.search-input-large')
    
    // 文件卡片列表：所有文件卡片
    this.fileCards = page.locator('.xc-card').filter({ hasNot: page.locator('.xc-card-foldername') })
    
    // 文件夹卡片列表：所有文件夹卡片
    this.folderCards = page.locator('.xc-card').filter({ has: page.locator('.xc-card-foldername') })
    
    // 卡片三个点菜单（NDropdown 弹出层，仅可见时存在）
    this.cardMenu = page.locator('.n-dropdown-menu:visible')

    // 标签输入框：添加标签的输入框
    this.tagInput = page.locator('.tag-input')

    // 浮动操作按钮（FAB）
    this.fab = page.locator('.fab-button')

    // 浮动操作栏
    this.fabMenu = page.locator('.fab-menu')

    // 新建文件夹按钮
    this.newFolderButton = this.fabMenu.locator('.fab-menu-item:has-text("创建文件夹")')

    // 展开面板按钮
    this.expandPanelButton = this.fabMenu.locator('.fab-menu-item:has-text("展开面板")')

    // 信息面板（Info Sidebar）
    this.infoSidebar = page.locator('.info-sidebar')

    // 文件信息区域
    this.fileInfoSection = this.infoSidebar.locator('.sidebar-section').filter({ hasText: '文件信息' })

    // 标签信息区域
    this.tagInfoSection = this.infoSidebar.locator('.sidebar-section').filter({ hasText: '标签信息' })

    // 文件夹列表区域
    this.folderListSection = this.infoSidebar.locator('.folder-tree-section')

    // 搜索面板
    this.searchPanel = page.locator('.search-panel')

    // 搜索面板取消按钮
    this.searchCancelButton = this.searchPanel.locator('.cancel-btn')

    // 搜索面板清空按钮
    this.searchClearButton = this.searchPanel.locator('.clear-all-btn')

    // 新建文件夹对话框
    this.newFolderDialog = page.locator('.dialog-overlay').filter({ hasText: '创建新文件夹' })
  }

  // ==================== 页面操作方法 ====================
  
  /**
   * 导航到主页
   * 
   * 访问应用根路径，并等待导航菜单加载完成
   * 这是测试的起点，应该在beforeEach或测试开始时调用
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.goto()
   * 
   * @remarks
   * - 使用expect断言确保页面加载成功
   * - Playwright会自动等待元素可见
   * - 如果页面加载失败，测试会自动失败
   */
  async goto() {
    // 导航到根路径
    await this.page.goto('/')
    
    // 验证导航菜单已加载，确保页面加载成功
    await expect(this.navMenu).toBeVisible()
  }

  /**
   * 打开管理界面
   * 
   * 点击管理按钮，进入管理界面
   * 管理界面包含标签管理、回收站、相似度检测等功能模块
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.goto()
   * await homePage.openManagement()
   * 
   * @remarks
   * - 点击后会导航到管理界面
   * - 不包含验证逻辑，由调用者根据需要验证
   */
  async openManagement() {
    await this.managementButton.click()
  }

  /**
   * 打开设置界面
   * 
   * 点击设置按钮，进入设置界面
   * 设置界面可以配置应用参数，如仓库路径、界面主题等
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.goto()
   * await homePage.openSettings()
   */
  async openSettings() {
    await this.settingsButton.click()
  }

  /**
   * 搜索文件
   * 
   * 执行文件搜索操作，包括打开搜索面板、输入关键词、提交搜索
   * 
   * @param query - 搜索关键词
   * @returns Promise<void>
   * 
   * @example
   * await homePage.searchFiles('vacation')
   * 
   * @remarks
   * - 搜索操作包含多个步骤，确保每个步骤都完成
   * - 使用waitForSelector等待搜索面板展开
   * - 使用keyboard.press('Enter')提交搜索，模拟真实用户操作
   */
  async searchFiles(query: string) {
    // 步骤1: 点击搜索触发器，打开搜索面板
    await this.searchTrigger.click()
    
    // 步骤2: 等待搜索面板展开
    await this.page.waitForSelector('.search-panel', { state: 'visible' })
    
    // 步骤3: 在搜索框中输入关键词
    await this.searchInput.fill(query)
    
    // 步骤4: 按Enter键提交搜索
    await this.page.keyboard.press('Enter')
  }

  // ==================== 文件操作方法 ====================
  
  /**
   * 选择文件
   *
   * 通过索引选择文件卡片，勾选复选框
   *
   * @param index - 文件索引，从0开始
   * @returns Promise<void>
   *
   * @example
   * await homePage.selectFile(0)  // 选择第一个文件
   *
   * @remarks
   * - 文件卡片会显示选中状态（checked 样式）
   */
  async selectFile(index: number = 0) {
    const fileCard = this.fileCards.nth(index)

    await fileCard.scrollIntoViewIfNeeded()

    const checkbox = fileCard.locator('.xc-checkbox')
    await checkbox.check()

    await expect(fileCard).toHaveClass(/checked/)
  }

  /**
   * 选择多个文件
   *
   * 通过索引数组选择多个文件卡片
   *
   * @param indices - 文件索引数组
   * @returns Promise<void>
   *
   * @example
   * await homePage.selectMultipleFiles([0, 1, 2])  // 选择前三个文件
   */
  async selectMultipleFiles(indices: number[]) {
    for (const index of indices) {
      await this.selectFile(index)
    }
  }

  /**
   * 取消选择文件
   *
   * 取消所有已选择的文件
   *
   * @returns Promise<void>
   *
   * @example
   * await homePage.clearSelection()
   */
  async clearSelection() {
    const checkedBoxes = this.page.locator('.xc-card .xc-checkbox:checked')
    const count = await checkedBoxes.count()
    for (let i = 0; i < count; i++) {
      // locator 重新求值，每次取消第一个仍处于勾选状态的复选框
      await checkedBoxes.first().uncheck()
    }
  }

  // ==================== 卡片菜单（kebab）操作方法 ====================

  /**
   * 打开第一个选中卡片的三个点菜单
   *
   * @returns Promise<void>
   */
  async openSelectedCardMenu() {
    const card = this.page.locator('.xc-card.checked').first()
    await expect(card).toBeVisible()
    await card.scrollIntoViewIfNeeded()
    await card.hover()
    await card.locator('[data-testid="file-card-menu"]').click()
    await expect(this.cardMenu).toBeVisible()
  }

  /**
   * 点击卡片菜单中的选项
   *
   * @param label - 选项文本
   * @returns Promise<void>
   */
  async clickCardMenuItem(label: string) {
    const option = this.cardMenu.locator('.n-dropdown-option').filter({ hasText: label }).first()
    await expect(option).toBeVisible()
    await option.click()
  }

  /**
   * 添加标签到选中的文件
   *
   * 通过卡片菜单打开标签编辑弹窗，输入标签名称并提交
   *
   * @param tagName - 标签名称
   * @returns Promise<void>
   *
   * @example
   * await homePage.selectFile(0)
   * await homePage.addTagToSelectedFiles('important')
   */
  async addTagToSelectedFiles(tagName: string) {
    await this.openSelectedCardMenu()
    await this.clickCardMenuItem('标签')

    const tagInput = this.page.locator('.n-modal .card-tag-input')
    await expect(tagInput).toBeVisible()
    await tagInput.fill(tagName)
    await tagInput.press('Enter')

    // 提交后标签弹窗自动关闭
    await expect(tagInput).not.toBeVisible()
  }

  /**
   * 打开删除标签对话框
   *
   * 通过卡片菜单打开标签编辑弹窗（其中包含已有标签删除列表）
   *
   * @returns Promise<void>
   *
   * @example
   * await homePage.selectFile(0)
   * await homePage.openDeleteTagDialog()
   */
  async openDeleteTagDialog() {
    await this.openSelectedCardMenu()
    await this.clickCardMenuItem('标签')

    const tagInput = this.page.locator('.n-modal .card-tag-input')
    await expect(tagInput).toBeVisible()
  }

  /**
   * 在标签编辑弹窗中删除指定标签
   *
   * 点击标签条目上的删除按钮（立即生效）
   *
   * @param tagNames - 要删除的标签名称数组
   * @returns Promise<void>
   *
   * @example
   * await homePage.openDeleteTagDialog()
   * await homePage.selectTagsInDialog(['tag1', 'tag2'])
   */
  async selectTagsInDialog(tagNames: string[]) {
    const modal = this.page.locator('.n-modal')
    await expect(modal.locator('.card-tag-input')).toBeVisible()

    for (const tagName of tagNames) {
      const deleteBtn = modal.locator('.card-tag-item', { hasText: tagName }).locator('.card-tag-delete-btn')
      await expect(deleteBtn).toBeVisible()
      await deleteBtn.click()
    }
  }

  /**
   * 关闭标签编辑弹窗
   *
   * @returns Promise<void>
   *
   * @example
   * await homePage.openDeleteTagDialog()
   * await homePage.selectTagsInDialog(['tag1'])
   * await homePage.confirmDeleteTags()
   */
  async confirmDeleteTags() {
    const modal = this.page.locator('.n-modal')
    await expect(modal.locator('.card-tag-input')).toBeVisible()

    await modal.locator('button:has-text("取消")').click()
    await expect(modal.locator('.card-tag-input')).not.toBeVisible()
  }

  /**
   * 取消删除标签对话框
   *
   * @returns Promise<void>
   *
   * @example
   * await homePage.openDeleteTagDialog()
   * await homePage.cancelDeleteTagDialog()
   */
  async cancelDeleteTagDialog() {
    await this.confirmDeleteTags()
  }

  /**
   * 验证文件是否有指定标签
   * 
   * 检查文件卡片上是否显示指定标签
   * 
   * @param fileIndex - 文件索引
   * @param tagName - 标签名称
   * @returns Promise<boolean> - 是否有该标签
   * 
   * @example
   * const hasTag = await homePage.verifyFileHasTag(0, 'important')
   * expect(hasTag).toBe(true)
   */
  async verifyFileHasTag(fileIndex: number, tagName: string): Promise<boolean> {
    const fileCard = this.fileCards.nth(fileIndex)
    const tag = fileCard.locator(`.xc-tag:has-text("${tagName}")`)
    return await tag.isVisible()
  }

  /**
   * Delete tag from selected files
   *
   * Opens the tag edit modal via card menu and removes the specified tag
   *
   * @param tagName - Tag name to delete (supports partial match)
   * @returns Promise<void>
   *
   * @example
   * await homePage.selectMultipleFiles([0, 1, 2])
   * await homePage.deleteTagFromSelectedFiles('test-tag-')
   */
  async deleteTagFromSelectedFiles(tagName: string) {
    await this.openSelectedCardMenu()
    await this.clickCardMenuItem('标签')

    const modal = this.page.locator('.n-modal')
    await expect(modal.locator('.card-tag-input')).toBeVisible({ timeout: 5000 })

    const deleteBtn = modal.locator('.card-tag-item', { hasText: tagName }).locator('.card-tag-delete-btn')
    await expect(deleteBtn).toBeVisible({ timeout: 5000 })
    await deleteBtn.click({ timeout: 5000 })

    await modal.locator('button:has-text("取消")').click()
    await expect(modal.locator('.card-tag-input')).not.toBeVisible({ timeout: 5000 })
    await this.page.waitForTimeout(500)
  }

  /**
   * 获取文件的标签列表
   *
   * 获取文件卡片上显示的所有标签名称
   *
   * @param fileIndex - 文件索引
   * @returns Promise<string[]> - 标签名称数组
   *
   * @example
   * const tags = await homePage.getFileTags(0)
   * expect(tags).toContain('important')
   */
  async getFileTags(fileIndex: number): Promise<string[]> {
    const fileCard = this.fileCards.nth(fileIndex)
    const tags = fileCard.locator('.xc-tag')
    const count = await tags.count()
    
    const tagNames: string[] = []
    for (let i = 0; i < count; i++) {
      const tagText = await tags.nth(i).textContent()
      if (tagText) {
        tagNames.push(tagText.trim())
      }
    }
    
    return tagNames
  }

  /**
   * 获取文件数量
   * 
   * 获取当前页面显示的文件卡片数量
   * 
   * @returns Promise<number> - 文件数量
   * 
   * @example
   * const count = await homePage.getFileCount()
   * expect(count).toBeGreaterThan(0)
   */
  async getFileCount(): Promise<number> {
    return await this.fileCards.count()
  }

  /**
   * 删除选中的文件
   *
   * 通过卡片菜单中的"删除"选项，将文件移入回收站
   *
   * @returns Promise<void>
   *
   * @example
   * await homePage.selectFile(0)
   * await homePage.deleteSelectedFiles()
   *
   * @remarks
   * - 必须先选择文件（通过复选框勾选）
   * - 文件会被移入回收站，可以恢复
   */
  async deleteSelectedFiles() {
    await this.openSelectedCardMenu()
    await this.clickCardMenuItem('删除')

    await this.page.waitForTimeout(500)
  }

  /**
   * 设置文件评分
   *
   * 通过卡片菜单的评分子菜单为文件设置等级（1-5星）
   *
   * @param level - 等级（1-5）
   * @returns Promise<void>
   *
   * @example
   * await homePage.selectFile(0)
   * await homePage.setFileLevel(3)
   *
   * @remarks
   * - 必须先选择文件（通过复选框勾选）
   * - 等级会覆盖之前的等级
   */
  async setFileLevel(level: number) {
    await this.openSelectedCardMenu()

    // Step 1: hover 评分 option to open the score submenu
    const scoreOption = this.cardMenu.locator('.n-dropdown-option').filter({ hasText: '评分' }).first()
    await expect(scoreOption).toBeVisible()
    await scoreOption.hover()

    // Step 2: click the target score item in the submenu
    const scoreItem = this.cardMenu.locator('.n-dropdown-option').filter({ hasText: `${level}☆` }).first()
    await expect(scoreItem).toBeVisible()
    await scoreItem.click()

    await this.page.waitForTimeout(500)
  }

  /**
   * 验证文件是否有指定等级
   * 
   * 检查文件卡片上是否显示指定等级
   * 
   * @param fileIndex - 文件索引
   * @param level - 等级（1-5）
   * @returns Promise<boolean> - 是否有该等级
   * 
   * @example
   * const hasLevel = await homePage.verifyFileHasLevel(0, 3)
   * expect(hasLevel).toBe(true)
   */
  async verifyFileHasLevel(fileIndex: number, level: number): Promise<boolean> {
    const fileCard = this.fileCards.nth(fileIndex)
    const levelTag = fileCard.locator(`.xc-tag:has-text("${level}☆")`)
    return await levelTag.isVisible()
  }

  /**
   * 验证文件是否有指定等级标签
   * 
   * 检查文件卡片上是否显示指定等级标签（sys_score格式）
   * 
   * @param fileIndex - 文件索引
   * @param level - 等级（1-5）
   * @returns Promise<boolean> - 是否有该等级标签
   * 
   * @example
   * const hasLevel = await homePage.verifyFileHasLevelTag(0, 3)
   * expect(hasLevel).toBe(true)
   */
  async verifyFileHasLevelTag(fileIndex: number, level: number): Promise<boolean> {
    const fileCard = this.fileCards.nth(fileIndex)
    const levelTag = fileCard.locator('.xc-tag').filter({ hasText: `${level}☆` })
    return await levelTag.isVisible()
  }

  /**
   * 获取文件名称
   * 
   * 通过索引获取文件卡片的名称
   * 
   * @param index - 文件索引，从0开始
   * @returns Promise<string> - 文件名称
   * 
   * @example
   * const fileName = await homePage.getFileName(0)
   * console.log(fileName)
   */
  async getFileName(index: number = 0): Promise<string> {
    const fileCard = this.fileCards.nth(index)
    const nameElement = fileCard.locator('.xc-card-filename')
    return await nameElement.textContent() || ''
  }

  /**
   * 获取文件ID
   * 
   * 通过索引获取文件卡片的ID
   * 
   * @param index - 文件索引，从0开始
   * @returns Promise<number> - 文件ID
   * 
   * @example
   * const fileId = await homePage.getFileId(0)
   * console.log(fileId)
   */
  async getFileId(index: number = 0): Promise<number> {
    const fileCard = this.fileCards.nth(index)
    const id = await fileCard.getAttribute('data-file-id')
    return parseInt(id || '0')
  }

  /**
   * 等待文件加载完成
   * 
   * 等待文件列表加载完成，至少有一个文件显示
   * 
   * @param timeout - 超时时间，默认10秒
   * @returns Promise<void>
   * 
   * @example
   * await homePage.waitForFilesToLoad()
   */
  async waitForFilesToLoad(timeout: number = 10000) {
    await expect(this.fileCards.first()).toBeVisible({ timeout })
  }

  // ==================== 文件夹导航方法 ====================
  
  /**
   * 进入文件夹
   * 
   * 通过文件夹名称或索引点击进入文件夹
   * 
   * @param folderNameOrIndex - 文件夹名称或索引（从0开始）
   * @returns Promise<void>
   * 
   * @example
   * // 通过名称进入文件夹
   * await homePage.enterFolder('Photos')
   * 
   * // 通过索引进入第一个文件夹
   * await homePage.enterFolder(0)
   * 
   * @remarks
   * - 进入文件夹后会显示该文件夹内的文件
   * - 如果文件夹不存在，测试会失败
   */
  async enterFolder(folderNameOrIndex: string | number) {
    let folderCard: Locator
    
    if (typeof folderNameOrIndex === 'string') {
      // 通过名称查找文件夹
      folderCard = this.folderCards.filter({ hasText: folderNameOrIndex }).first()
    } else {
      // 通过索引查找文件夹
      folderCard = this.folderCards.nth(folderNameOrIndex)
    }
    
    await folderCard.waitFor({ state: 'visible', timeout: 10000 })
    await folderCard.click({ force: true })
    
    await this.page.waitForTimeout(500)
  }

  /**
   * Navigate through multiple folders
   * 
   * Navigate through a sequence of folders by entering them one by one
   * 
   * @param folderNames - Array of folder names to navigate through
   * @returns Promise<void>
   * 
   * @example
   * await homePage.navigateToFolders(['测试文件夹', '子文件夹'])
   */
  async navigateToFolders(folderNames: string[]): Promise<void> {
    for (const folderName of folderNames) {
      await this.enterFolder(folderName)
      await this.waitForFilesToLoad()
    }
  }

  /**
   * 获取文件夹数量
   * 
   * 获取当前页面显示的文件夹卡片数量
   * 
   * @returns Promise<number> - 文件夹数量
   * 
   * @example
   * const count = await homePage.getFolderCount()
   * expect(count).toBeGreaterThan(0)
   */
  async getFolderCount(): Promise<number> {
    return await this.folderCards.count()
  }

  /**
   * 验证当前路径
   * 
   * 验证当前所在的路径是否正确
   * 
   * @param expectedPath - 预期的路径名称
   * @returns Promise<void>
   * 
   * @example
   * await homePage.enterFolder('Photos')
   * await homePage.verifyCurrentPath('Photos')
   */
  async verifyCurrentPath(expectedPath: string) {
    const pathDisplay = this.page.locator('.path-display')
    await expect(pathDisplay).toContainText(expectedPath)
  }

  /**
   * 等待文件夹加载完成
   * 
   * 等待文件夹列表加载完成，至少有一个文件夹显示
   * 
   * @param timeout - 超时时间，默认10秒
   * @returns Promise<void>
   * 
   * @example
   * await homePage.waitForFoldersToLoad()
   */
  async waitForFoldersToLoad(timeout: number = 10000) {
    await expect(this.folderCards.first()).toBeVisible({ timeout })
  }

  // ==================== FAB操作方法 ====================

  /**
   * 点击浮动操作按钮（FAB）
   * 
   * 点击FAB按钮，显示浮动操作菜单
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.clickFab()
   */
  async clickFab() {
    await this.fab.click()
    await expect(this.fabMenu).toBeVisible()
  }

  /**
   * 打开新建文件夹对话框
   * 
   * 通过FAB菜单打开新建文件夹对话框
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.clickFab()
   * await homePage.openNewFolderDialog()
   */
  async openNewFolderDialog() {
    await this.clickFab()
    await this.newFolderButton.click()
    await expect(this.newFolderDialog).toBeVisible()
  }

  /**
   * 展开信息面板
   * 
   * 通过FAB菜单展开右侧信息面板
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.clickFab()
   * await homePage.expandInfoSidebar()
   */
  async expandInfoSidebar() {
    await this.clickFab()
    await this.expandPanelButton.click()
    await expect(this.infoSidebar).toBeVisible()
  }

  /**
   * 关闭信息面板
   * 
   * 点击信息面板的关闭按钮
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.closeInfoSidebar()
   */
  async closeInfoSidebar() {
    const closeBtn = this.infoSidebar.locator('.sidebar-close-btn')
    await closeBtn.click()
    await expect(this.infoSidebar).not.toBeVisible()
  }

  /**
   * 点击文件夹树项
   * 
   * 在信息面板的文件夹列表中点击指定索引的文件夹
   * 
   * @param index - 文件夹索引
   * @returns Promise<void>
   * 
   * @example
   * await homePage.clickFolderTreeItem(0)
   */
  async clickFolderTreeItem(index: number) {
    const folderItem = this.folderListSection.locator('.dir-item').nth(index)
    await folderItem.click()
  }

  /**
   * 折叠文件夹树节点
   * 
   * 点击文件夹树项的折叠按钮
   * 
   * @param index - 文件夹索引
   * @returns Promise<void>
   * 
   * @example
   * await homePage.collapseFolderTreeNode(0)
   */
  async collapseFolderTreeNode(index: number) {
    const dirItem = this.folderListSection.locator('.dir-item-group').nth(index).locator('.dir-item')
    const collapseIcon = dirItem.locator('svg').first()
    await collapseIcon.click()
  }

  /**
   * 展开文件夹树节点
   * 
   * 点击文件夹树项的展开按钮
   * 
   * @param index - 文件夹索引
   * @returns Promise<void>
   * 
   * @example
   * await homePage.expandFolderTreeNode(0)
   */
  async expandFolderTreeNode(index: number) {
    const dirItem = this.folderListSection.locator('.dir-item-group').nth(index).locator('.dir-item')
    const expandIcon = dirItem.locator('svg').first()
    await expandIcon.click()
  }

  /**
   * 获取文件夹总数
   * 
   * 从信息面板文件夹列表头部获取文件夹总数
   * 
   * @returns Promise<number> - 文件夹总数
   * 
   * @example
   * const count = await homePage.getFolderTotalCount()
   */
  async getFolderTotalCount(): Promise<number> {
    const header = this.folderListSection.locator('.section-title')
    const text = await header.textContent() || ''
    const match = text.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  // ==================== 搜索面板操作方法 ====================

  /**
   * 打开搜索面板
   * 
   * 点击搜索触发器打开搜索面板
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.openSearchPanel()
   */
  async openSearchPanel() {
    await this.searchTrigger.click()
    await expect(this.searchPanel).toBeVisible()
  }

  /**
   * 关闭搜索面板
   * 
   * 点击取消按钮关闭搜索面板
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.closeSearchPanel()
   */
  async closeSearchPanel() {
    await this.searchCancelButton.click()
    await expect(this.searchPanel).not.toBeVisible()
  }

  /**
   * 清空所有搜索条件
   * 
   * 点击清空按钮重置所有搜索条件
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.clearAllSearchFilters()
   */
  async clearAllSearchFilters() {
    await this.searchClearButton.click()
  }

  /**
   * 设置搜索关键词
   * 
   * 在搜索输入框中输入关键词
   * 
   * @param keyword - 搜索关键词
   * @returns Promise<void>
   * 
   * @example
   * await homePage.setSearchKeyword('vacation')
   */
  async setSearchKeyword(keyword: string) {
    await this.searchInput.fill(keyword)
  }

  /**
   * 选择文件类型过滤器
   * 
   * 在搜索面板中选择文件类型
   * 
   * @param fileType - 文件类型（图片、视频、音频、文本、其他）
   * @returns Promise<void>
   * 
   * @example
   * await homePage.selectFileType('图片')
   */
  async selectFileType(fileType: string) {
    const typeOption = this.searchPanel.locator('.filter-option-btn').filter({ hasText: fileType })
    await typeOption.click()
  }

  /**
   * 选择排序方式
   * 
   * 在搜索面板中选择排序方式
   * 
   * @param sortBy - 排序方式（时间、大小、名称）
   * @returns Promise<void>
   * 
   * @example
   * await homePage.selectSortBy('时间')
   */
  async selectSortBy(sortBy: string) {
    const sortSection = this.searchPanel.locator('.filter-section').filter({ hasText: '排序方式' })
    const sortOption = sortSection.locator('.filter-option-btn').filter({ hasText: sortBy })
    await sortOption.click()
  }

  /**
   * 选择排序顺序
   * 
   * 在搜索面板中选择升序或降序
   * 
   * @param order - 排序顺序（升序、降序）
   * @returns Promise<void>
   * 
   * @example
   * await homePage.selectSortOrder('升序')
   */
  async selectSortOrder(order: string) {
    const orderBtn = this.searchPanel.locator('.order-btn').filter({ hasText: order })
    await orderBtn.click()
  }

  /**
   * 选择搜索范围
   * 
   * 在搜索面板中选择搜索范围
   * 
   * @param scope - 搜索范围（当前目录、全部文件）
   * @returns Promise<void>
   * 
   * @example
   * await homePage.selectSearchScope('当前目录')
   */
  async selectSearchScope(scope: string) {
    const scopeSection = this.searchPanel.locator('.filter-section').filter({ hasText: '搜索范围' })
    const scopeOption = scopeSection.locator('.filter-option-btn').filter({ hasText: scope })
    await scopeOption.click()
  }

  /**
   * 设置文件大小范围
   * 
   * 在搜索面板中设置文件大小范围
   * 
   * @param minSize - 最小文件大小（MB）
   * @param maxSize - 最大文件大小（MB）
   * @returns Promise<void>
   * 
   * @example
   * await homePage.setFileSizeRange(1, 10)
   */
  async setFileSizeRange(minSize: number, maxSize: number) {
    const sizeSection = this.searchPanel.locator('.filter-section').filter({ hasText: '文件大小' })
    const inputs = sizeSection.locator('.range-input')
    await inputs.nth(0).fill(minSize.toString())
    await inputs.nth(1).fill(maxSize.toString())
  }

  /**
   * 设置视频时长范围
   * 
   * 在搜索面板中设置视频时长范围
   * 
   * @param minDuration - 最小时长（分钟）
   * @param maxDuration - 最大时长（分钟）
   * @returns Promise<void>
   * 
   * @example
   * await homePage.setVideoDurationRange(60, 300)
   */
  async setVideoDurationRange(minDuration: number, maxDuration: number) {
    const durationSection = this.searchPanel.locator('.filter-section').filter({ hasText: '视频时长' })
    const inputs = durationSection.locator('.range-input')
    await inputs.nth(0).fill(minDuration.toString())
    await inputs.nth(1).fill(maxDuration.toString())
  }

  /**
   * 设置图片/视频尺寸
   * 
   * 在搜索面板中设置图片或视频的宽高
   * 
   * @param width - 宽度
   * @param height - 高度
   * @returns Promise<void>
   * 
   * @example
   * await homePage.setMediaDimensions(1920, 1080)
   */
  async setMediaDimensions(width: number, height: number) {
    const dimensionSection = this.searchPanel.locator('.filter-section').filter({ hasText: '图片/视频尺寸' })
    const inputs = dimensionSection.locator('.range-input')
    await inputs.nth(0).fill(width.toString())
    await inputs.nth(1).fill(height.toString())
  }

  /**
   * 切换反向选择
   * 
   * 在搜索面板中切换反向选择复选框
   * 
   * @param checked - 是否选中
   * @returns Promise<void>
   * 
   * @example
   * await homePage.toggleInverseSelect(true)
   */
  async toggleInverseSelect(checked: boolean) {
    const checkbox = this.searchPanel.locator('.tag-checkbox')
    if (checked) {
      await checkbox.check()
    } else {
      await checkbox.uncheck()
    }
  }

  /**
   * 验证搜索面板输入框是否为空
   * 
   * @returns Promise<boolean>
   * 
   * @example
   * const isEmpty = await homePage.isSearchInputEmpty()
   */
  async isSearchInputEmpty(): Promise<boolean> {
    const value = await this.searchInput.inputValue()
    return value === ''
  }

  // ==================== 文件移动/复制操作方法 ====================

  /**
   * 移动选中的文件
   * 
   * 点击操作栏中的"移动"按钮，选择目标文件夹并确认移动
   * 
   * @param targetFolderPath - 目标文件夹路径（如 "test-move-copy-delete/moved"）
   * @returns Promise<void>
   * 
   * @example
   * await homePage.selectFile(0)
   * await homePage.moveSelectedFiles('test-move-copy-delete/moved')
   * 
   * @remarks
   * - 必须先选择文件，否则操作栏不会显示
   * - 文件会从当前文件夹移动到目标文件夹
   */
  async moveSelectedFiles(targetFolderPath: string) {
    await this.openSelectedCardMenu()
    await this.clickCardMenuItem('移动')
    
    const fileTransferOverlay = this.page.locator('.file-transfer-overlay')
    await expect(fileTransferOverlay).toBeVisible({ timeout: 5000 })
    
    const pathParts = targetFolderPath.split('/')
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]
      const expectedPath = pathParts.slice(0, i + 1).join('/')
      
      const dirItems = fileTransferOverlay.locator('.dir-item').filter({ hasText: part })
      const count = await dirItems.count()
      
      let found = false
      for (let j = 0; j < count; j++) {
        const dirItem = dirItems.nth(j)
        const folderName = dirItem.locator('.no-wrap')

        await folderName.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(200)
        
        await folderName.click()
        await this.page.waitForTimeout(1000)
        
        const pathValue = fileTransferOverlay.locator('.path-value')
        const selectedPath = await pathValue.textContent() || ''
        
        if (selectedPath.includes(expectedPath)) {
          found = true
          break
        }
      }
      
      if (!found) {
        throw new Error(`Cannot find folder with path: ${expectedPath}`)
      }
    }
    
    const confirmBtn = fileTransferOverlay.locator('.btn-primary.move:has-text("移动文件")')
    await confirmBtn.click()
    
    await expect(fileTransferOverlay).not.toBeVisible({ timeout: 5000 })
    await this.page.waitForTimeout(500)
  }

  /**
   * 复制选中的文件
   * 
   * 点击操作栏中的"复制"按钮，选择目标文件夹并确认复制
   * 
   * @param targetFolderPath - 目标文件夹路径（如 "test-move-copy-delete/moved"）
   * @returns Promise<void>
   * 
   * @example
   * await homePage.selectFile(0)
   * await homePage.copySelectedFiles('test-move-copy-delete/moved')
   * 
   * @remarks
   * - 必须先选择文件，否则操作栏不会显示
   * - 文件会复制到目标文件夹，原文件保留
   */
  async copySelectedFiles(targetFolderPath: string) {
    await this.openSelectedCardMenu()
    await this.clickCardMenuItem('复制')
    
    const fileTransferOverlay = this.page.locator('.file-transfer-overlay')
    await expect(fileTransferOverlay).toBeVisible({ timeout: 5000 })
    
    const pathParts = targetFolderPath.split('/')
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]
      const expectedPath = pathParts.slice(0, i + 1).join('/')
      
      const dirItems = fileTransferOverlay.locator('.dir-item').filter({ hasText: part })
      const count = await dirItems.count()
      
      let found = false
      for (let j = 0; j < count; j++) {
        const dirItem = dirItems.nth(j)
        const folderName = dirItem.locator('.no-wrap')
        
        await folderName.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(200)
        
        await folderName.click()
        await this.page.waitForTimeout(1000)
        
        const pathValue = fileTransferOverlay.locator('.path-value')
        const selectedPath = await pathValue.textContent() || ''
        
        if (selectedPath.includes(expectedPath)) {
          found = true
          break
        }
      }
      
      if (!found) {
        throw new Error(`Cannot find folder with path: ${expectedPath}`)
      }
    }
    
    const confirmBtn = fileTransferOverlay.locator('.btn-primary.copy:has-text("复制文件")')
    await confirmBtn.click()
    
    await expect(fileTransferOverlay).not.toBeVisible({ timeout: 30000 })
    await this.page.waitForTimeout(500)
  }

  /**
   * 全选当前文件夹所有文件
   * 
   * 使用Ctrl+点击方式选中所有文件
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.selectAllFiles()
   */
  async selectAllFiles() {
    const fileCount = await this.getFileCount()
    
    await this.page.keyboard.down('Control')
    for (let i = 0; i < fileCount; i++) {
      await this.selectFile(i)
      await this.page.waitForTimeout(100)
    }
    await this.page.keyboard.up('Control')
  }

  /**
   * 导航到根目录
   * 
   * 点击导航栏的第一个路径项返回根目录
   * 
   * @returns Promise<void>
   * 
   * @example
   * await homePage.navigateToRoot()
   */
  async navigateToRoot() {
    const rootPathItem = this.page.locator('.path-display .path-item:first-child .path-part').first()
    if (await rootPathItem.isVisible()) {
      await rootPathItem.click()
      await this.page.waitForTimeout(500)
    }
  }

  // ==================== 文件夹创建操作方法 ====================

  /**
   * 创建新文件夹
   * 
   * 通过FAB按钮打开创建文件夹对话框，输入文件夹名称并确认
   * 
   * @param folderName - 新文件夹名称
   * @returns Promise<void>
   * 
   * @example
   * await homePage.createNewFolder('moved')
   * 
   * @remarks
   * - 文件夹将在当前目录下创建
   */
  async createNewFolder(folderName: string) {
    const fabButton = this.page.locator('.fab-button')
    await fabButton.click()
    await this.page.waitForTimeout(300)
    
    const createFolderMenuItem = this.page.locator('.fab-menu-item:has-text("创建文件夹")')
    await createFolderMenuItem.click()
    await this.page.waitForTimeout(300)
    
    const dialogOverlay = this.page.locator('.dialog-overlay')
    await expect(dialogOverlay).toBeVisible({ timeout: 5000 })
    
    const folderNameInput = dialogOverlay.locator('.folder-name-input')
    await folderNameInput.fill(folderName)
    
    const confirmBtn = dialogOverlay.locator('.confirm-btn')
    await confirmBtn.click()
    
    await expect(dialogOverlay).not.toBeVisible({ timeout: 5000 })
    await this.page.waitForTimeout(500)
  }
}
