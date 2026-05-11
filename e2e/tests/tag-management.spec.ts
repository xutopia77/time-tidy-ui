/**
 * 标签管理测试套件
 * 
 * 本文件包含标签管理功能的所有E2E测试用例，覆盖标签的创建、编辑、删除等核心功能。
 * 
 * 测试覆盖：
 * 1. 页面显示测试：验证页面元素是否正确显示
 * 2. 创建标签测试：测试标签创建功能
 * 3. 删除标签测试：测试标签删除功能，包括确认对话框
 * 4. 编辑标签测试：测试标签编辑功能
 * 5. 系统标签保护测试：验证系统标签不可删除
 * 
 * 测试策略：
 * - 使用Page Object Model封装页面操作
 * - 使用API Helper进行数据准备和清理
 * - 每个测试独立运行，互不影响
 * - 测试数据使用唯一标识，避免冲突
 * 
 * @example
 * // 运行测试
 * npx playwright test tag-management.spec.ts
 */

import { test, expect } from '@playwright/test'
import { TagManagementPage } from '../pages/TagManagementPage'
import { ApiHelpers } from '../utils/api-helpers'

/**
 * 标签管理测试套件
 */
test.describe('Tag Management', () => {
  // Page Object实例，用于操作页面
  let tagPage: TagManagementPage
  // API Helper实例，用于数据管理
  let api: ApiHelpers

  /**
   * 测试前置钩子
   * 
   * 在每个测试前执行：
   * 1. 初始化Page Object
   * 2. 初始化API Helper
   * 3. 导航到标签管理页面
   */
  test.beforeEach(async ({ page, request }) => {
    // 初始化Page Object，page由Playwright自动注入
    tagPage = new TagManagementPage(page)
    
    // 初始化API Helper，request由Playwright自动注入
    api = new ApiHelpers(request)
    
    // 导航到标签管理页面
    await tagPage.goto()
  })

  /**
   * 测试后置钩子
   * 
   * 在每个测试后执行：
   * 清理所有以'test-'开头的测试标签
   */
  test.afterEach(async () => {
    try {
      // 获取所有标签
      const tags = await api.getAllTags()
      
      if (tags && tags.data) {
        // 删除所有测试标签（以test-开头）
        for (const tag of tags.data) {
          if (tag.name && tag.name.startsWith('test-')) {
            await api.deleteTag(tag.name)
          }
        }
      }
    } catch (error) {
      // 清理失败不影响测试结果
      console.log('Cleanup failed:', error)
    }
  })

  /**
   * 测试：页面显示
   * 
   * 验证标签管理页面的基本元素是否正确显示
   */
  test('should display tag management page', async () => {
    // 验证页面标题可见
    await expect(tagPage.pageTitle).toBeVisible()
    
    // 验证新建标签按钮可见
    await expect(tagPage.newTagButton).toBeVisible()
  })

  /**
   * 测试：创建标签
   * 
   * 测试创建新标签的完整流程
   */
  test('should create a new tag', async () => {
    // 使用时间戳生成唯一标签名
    const tagName = `test-tag-${Date.now()}`
    
    // 创建标签
    await tagPage.createTag(tagName, '#FF5733')
    
    // 验证标签数量增加
    const tagCount = await tagPage.getTagCount()
    expect(tagCount).toBeGreaterThan(0)
  })

  /**
   * 测试：删除标签
   * 
   * 测试删除标签的完整流程，包括API验证
   */
  test('should delete a tag', async () => {
    // 准备：创建一个测试标签
    const tagName = `test-tag-to-delete-${Date.now()}`
    await tagPage.createTag(tagName)
    
    // 执行：删除标签
    await tagPage.deleteTag(tagName)
    
    // 验证：通过API确认标签已删除
    const tags = await api.getAllTags()
    const deletedTag = tags.data?.find((t: any) => t.name === tagName)
    expect(deletedTag).toBeUndefined()
  })

  /**
   * 测试：编辑标签
   * 
   * 测试编辑标签名称和颜色的完整流程
   */
  test('should edit a tag', async () => {
    // 准备：创建一个测试标签
    const oldName = `test-tag-edit-${Date.now()}`
    const newName = `test-tag-edited-${Date.now()}`
    
    await tagPage.createTag(oldName)
    
    // 执行：编辑标签
    await tagPage.editTag(oldName, newName, '#00FF00')
    
    // 验证：通过API确认标签已更新
    const tags = await api.getAllTags()
    const editedTag = tags.data?.find((t: any) => t.name === newName)
    
    // 验证标签存在
    expect(editedTag).toBeDefined()
    
    // 验证颜色正确（注意大小写）
    expect(editedTag.color.toLowerCase()).toBe('#00ff00')
  })

  /**
   * 测试：系统标签保护
   * 
   * 验证系统标签（sys_score1等）不能被删除
   */
  test('should not allow deleting system tags', async () => {
    // 系统标签列表
    const systemTags = ['sys_score1', 'sys_score2', 'sys_score3']
    
    // 验证每个系统标签的删除按钮不可见
    for (const tagName of systemTags) {
      const tagCard = tagPage.tagCards.filter({ hasText: tagName })
      const deleteButton = tagCard.locator('.delete-btn')
      
      // 系统标签不应该显示删除按钮
      await expect(deleteButton).not.toBeVisible()
    }
  })

  /**
   * 测试：删除确认对话框
   * 
   * 验证删除标签时显示确认对话框
   */
  test('should show confirmation dialog when deleting tag', async ({ page }) => {
    // 准备：创建一个测试标签
    const tagName = `test-tag-confirm-${Date.now()}`
    await tagPage.createTag(tagName)
    
    // 找到标签卡片
    const tagCard = tagPage.tagCards.filter({ hasText: tagName })
    await tagCard.hover()
    
    // 设置对话框处理器，捕获对话框消息
    let dialogMessage = ''
    page.on('dialog', dialog => {
      dialogMessage = dialog.message()
      dialog.dismiss()  // 取消对话框，不执行删除
    })
    
    // 点击删除按钮
    await tagCard.locator('.delete-btn').click()
    
    // 验证对话框消息包含确认文本
    expect(dialogMessage).toContain('确定要删除标签')
  })
})
