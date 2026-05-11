/**
 * 标签管理Page Object
 * 
 * 本文件实现了标签管理页面的Page Object Model，封装了标签管理的所有操作。
 * 标签管理是应用的核心功能之一，允许用户创建、编辑、删除标签，用于文件分类和组织。
 * 
 * 功能覆盖：
 * 1. 标签创建：创建新的标签，设置名称和颜色
 * 2. 标签编辑：修改现有标签的名称和颜色
 * 3. 标签删除：删除不需要的标签（系统标签除外）
 * 4. 标签列表：查看所有标签
 * 
 * 测试场景：
 * - 创建新标签并验证
 * - 编辑标签名称和颜色
 * - 删除标签并确认对话框
 * - 验证系统标签不可删除
 * - 批量操作标签
 * 
 * @example
 * // 在测试中使用
 * test('should manage tags', async ({ page }) => {
 *   const tagPage = new TagManagementPage(page)
 *   await tagPage.goto()
 *   await tagPage.createTag('test-tag', '#FF0000')
 * })
 */

import { Page, Locator, expect } from '@playwright/test'

/**
 * 标签管理Page Object类
 * 
 * 封装了标签管理页面的所有元素和操作方法
 * 
 * @example
 * const tagPage = new TagManagementPage(page)
 * await tagPage.goto()
 * await tagPage.createTag('important', '#FF0000')
 */
export class TagManagementPage {
  // ==================== 页面元素定义 ====================
  
  /**
   * Page对象引用
   */
  readonly page: Page
  
  /**
   * 页面标题
   * 显示"标签管理"文本，用于验证页面加载成功
   */
  readonly pageTitle: Locator
  
  /**
   * 新建标签按钮
   * 点击后打开创建标签对话框
   */
  readonly newTagButton: Locator
  
  /**
   * 标签名称输入框
   * 用于输入标签名称
   */
  readonly tagNameInput: Locator
  
  /**
   * 标签颜色输入框
   * 用于选择或输入标签颜色（十六进制格式）
   */
  readonly tagColorInput: Locator
  
  /**
   * 创建按钮
   * 在对话框中点击以提交创建或编辑
   */
  readonly createButton: Locator
  
  /**
   * 标签卡片列表
   * 所有标签的容器，每个标签显示为一个卡片
   */
  readonly tagCards: Locator
  
  /**
   * 取消按钮
   * 在对话框中点击以取消操作
   */
  readonly cancelButton: Locator

  // ==================== 构造函数 ====================
  
  /**
   * 构造函数：初始化所有页面元素定位器
   * 
   * @param page - Playwright的Page对象
   * 
   * 定位器策略：
   * - 页面标题：使用h2标签和文本内容定位
   * - 按钮：使用CSS类名定位
   * - 输入框：使用ID或类名定位
   * - 标签卡片：使用类名定位，支持过滤
   */
  constructor(page: Page) {
    this.page = page
    
    // 页面标题：h2标签，包含"标签管理"文本
    this.pageTitle = page.locator('h2:has-text("标签管理")')
    
    // 新建标签按钮：带有add-tag-btn类名的按钮
    this.newTagButton = page.locator('.add-tag-btn')
    
    // 标签名称输入框：ID为tagName的输入框
    this.tagNameInput = page.locator('#tagName')
    
    // 标签颜色输入框：带有color-input类名的输入框
    this.tagColorInput = page.locator('.color-input')
    
    // 创建按钮：对话框中的主按钮
    this.createButton = page.locator('.dialog-content .btn-primary')
    
    // 标签卡片列表：所有带有tag-card类名的元素
    this.tagCards = page.locator('.tag-card')
    
    // 取消按钮：对话框中的次要按钮
    this.cancelButton = page.locator('.dialog-content .btn-secondary')
  }

  // ==================== 页面导航方法 ====================
  
  /**
   * 导航到标签管理页面
   * 
   * 从主页导航到标签管理页面，包含以下步骤：
   * 1. 访问主页
   * 2. 点击管理菜单
   * 3. 点击标签导航项
   * 4. 验证页面加载成功
   * 
   * @returns Promise<void>
   * 
   * @example
   * await tagPage.goto()
   * 
   * @remarks
   * - 这是一个复合操作，包含多个步骤
   * - 最后会验证页面标题是否可见
   * - 如果任何步骤失败，测试会自动失败
   */
  async goto() {
    // 步骤1: 访问主页
    await this.page.goto('/')
    
    // 步骤2: 点击侧边栏的"管理"菜单项
    await this.page.locator('.sidebar-nav .menu-item:has-text("管理")').click()
    
    // 步骤3: 点击管理导航中的"标签"项
    await this.page.locator('.admin-nav .nav-item:has-text("标签")').click()
    
    // 步骤4: 验证页面标题已加载
    await expect(this.pageTitle).toBeVisible()
  }

  // ==================== 标签操作方法 ====================
  
  /**
   * 创建新标签
   * 
   * 完整的标签创建流程，包括：
   * 1. 打开创建对话框
   * 2. 填写标签名称和颜色
   * 3. 提交创建
   * 4. 等待对话框关闭
   * 5. 验证标签创建成功
   * 
   * @param name - 标签名称，建议使用唯一标识
   * @param color - 标签颜色，十六进制格式，默认为红色
   * @returns Promise<void>
   * 
   * @example
   * // 创建红色标签
   * await tagPage.createTag('important', '#FF0000')
   * 
   * // 创建默认颜色标签
   * await tagPage.createTag('test-tag')
   * 
   * @remarks
   * - 方法包含完整的验证逻辑
   * - 使用超时机制确保等待不会无限期
   * - 如果创建失败，测试会自动失败
   */
  async createTag(name: string, color: string = '#FF0000') {
    // 步骤1: 点击新建标签按钮，打开对话框
    await this.newTagButton.click()
    
    // 步骤2: 等待对话框出现
    await this.page.waitForSelector('.dialog-content', { state: 'visible' })
    
    // 步骤3: 填写标签名称
    await this.tagNameInput.fill(name)
    
    // 步骤4: 填写标签颜色
    await this.tagColorInput.fill(color)
    
    // 步骤5: 点击创建按钮提交
    await this.createButton.click()
    
    // 步骤6: 等待对话框关闭（最多10秒）
    await this.page.waitForSelector('.dialog-content', { state: 'hidden', timeout: 10000 })
    
    // 步骤7: 验证标签已创建并显示在列表中
    await expect(this.tagCards.filter({ hasText: name })).toBeVisible({ timeout: 10000 })
  }

  /**
   * 删除标签
   * 
   * 删除指定的标签，包括：
   * 1. 找到目标标签卡片
   * 2. 悬停显示操作按钮
   * 3. 点击删除按钮
   * 4. 确认删除对话框
   * 5. 验证标签已删除
   * 
   * @param name - 要删除的标签名称
   * @returns Promise<void>
   * 
   * @example
   * await tagPage.deleteTag('test-tag')
   * 
   * @remarks
   * - 系统标签（sys_score1等）不能删除
   * - 删除操作会弹出确认对话框，方法会自动接受
   * - 使用page.once('dialog')确保只处理一次对话框
   * - 如果标签不存在，测试会失败
   */
  async deleteTag(name: string) {
    // 步骤1: 找到目标标签卡片
    const tagCard = this.tagCards.filter({ hasText: name })
    
    // 步骤2: 悬停在标签卡片上，显示操作按钮
    await tagCard.hover()
    
    // 步骤3: 等待删除按钮可见
    await tagCard.locator('.delete-btn').waitFor({ state: 'visible' })
    
    // 步骤4: 设置对话框处理器，自动接受确认对话框
    // 使用once而不是on，确保只处理一次
    this.page.once('dialog', dialog => dialog.accept())
    
    // 步骤5: 点击删除按钮
    await tagCard.locator('.delete-btn').click()
    
    // 步骤6: 验证标签已从列表中移除
    await expect(this.tagCards.filter({ hasText: name })).not.toBeVisible({ timeout: 10000 })
  }

  /**
   * 编辑标签
   * 
   * 修改现有标签的名称和颜色，包括：
   * 1. 找到目标标签卡片
   * 2. 悬停显示操作按钮
   * 3. 点击编辑按钮
   * 4. 修改标签信息
   * 5. 提交修改
   * 6. 验证修改成功
   * 
   * @param oldName - 当前标签名称
   * @param newName - 新的标签名称
   * @param newColor - 新的标签颜色（可选）
   * @returns Promise<void>
   * 
   * @example
   * // 修改名称和颜色
   * await tagPage.editTag('old-name', 'new-name', '#00FF00')
   * 
   * // 只修改名称
   * await tagPage.editTag('old-name', 'new-name')
   * 
   * @remarks
   * - 如果不提供newColor，颜色保持不变
   * - 编辑时会清空原有名称再输入新名称
   * - 方法包含完整的验证逻辑
   */
  async editTag(oldName: string, newName: string, newColor?: string) {
    // 步骤1: 找到目标标签卡片
    const tagCard = this.tagCards.filter({ hasText: oldName })
    
    // 步骤2: 悬停在标签卡片上，显示操作按钮
    await tagCard.hover()
    
    // 步骤3: 等待编辑按钮可见
    await tagCard.locator('.edit-btn').waitFor({ state: 'visible' })
    
    // 步骤4: 点击编辑按钮，打开编辑对话框
    await tagCard.locator('.edit-btn').click()
    
    // 步骤5: 等待对话框出现
    await this.page.waitForSelector('.dialog-content', { state: 'visible' })
    
    // 步骤6: 清空原有名称
    await this.tagNameInput.clear()
    
    // 步骤7: 输入新名称
    await this.tagNameInput.fill(newName)
    
    // 步骤8: 如果提供了新颜色，修改颜色
    if (newColor) {
      await this.tagColorInput.fill(newColor)
    }
    
    // 步骤9: 点击创建按钮提交修改
    await this.createButton.click()
    
    // 步骤10: 等待对话框关闭
    await this.page.waitForSelector('.dialog-content', { state: 'hidden', timeout: 10000 })
    
    // 步骤11: 验证标签已更新并显示在列表中
    await expect(this.tagCards.filter({ hasText: newName })).toBeVisible({ timeout: 10000 })
  }

  // ==================== 查询方法 ====================
  
  /**
   * 获取标签数量
   * 
   * 获取当前页面显示的标签总数
   * 
   * @returns Promise<number> - 标签数量
   * 
   * @example
   * const count = await tagPage.getTagCount()
   * console.log(`Total tags: ${count}`)
   * 
   * @remarks
   * - 返回的是页面上显示的标签数量
   * - 不包括系统标签（如果系统标签在UI中隐藏）
   */
  async getTagCount() {
    return await this.tagCards.count()
  }
}

/**
 * 标签管理测试最佳实践
 * 
 * 1. 测试数据管理：
 *    - 使用唯一标识创建标签，避免冲突
 *    - 在afterEach中清理测试数据
 *    - 不要删除系统标签
 * 
 * 2. 测试场景覆盖：
 *    - 创建：正常创建、重复名称、空名称
 *    - 编辑：修改名称、修改颜色、同时修改
 *    - 删除：正常删除、确认对话框、系统标签保护
 * 
 * 3. 验证策略：
 *    - UI验证：验证元素是否可见
 *    - API验证：通过API验证数据是否正确
 *    - 数据库验证：必要时检查数据库记录
 * 
 * @example
 * // 完整的测试示例
 * test.describe('Tag Management', () => {
 *   let tagPage: TagManagementPage
 *   let api: ApiHelpers
 *   
 *   test.beforeEach(async ({ page, request }) => {
 *     tagPage = new TagManagementPage(page)
 *     api = new ApiHelpers(request)
 *     await tagPage.goto()
 *   })
 *   
 *   test.afterEach(async () => {
 *     // 清理测试数据
 *     const tags = await api.getAllTags()
 *     for (const tag of tags.data) {
 *       if (tag.name.startsWith('test-')) {
 *         await api.deleteTag(tag.name)
 *       }
 *     }
 *   })
 *   
 *   test('should create a tag', async () => {
 *     const tagName = `test-tag-${Date.now()}`
 *     await tagPage.createTag(tagName, '#FF0000')
 *     
 *     // UI验证
 *     const count = await tagPage.getTagCount()
 *     expect(count).toBeGreaterThan(0)
 *     
 *     // API验证
 *     const tags = await api.getAllTags()
 *     const createdTag = tags.data?.find(t => t.name === tagName)
 *     expect(createdTag).toBeDefined()
 *   })
 * })
 */
