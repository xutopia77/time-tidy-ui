/**
 * 回收站管理Page Object
 * 
 * 本文件实现了回收站管理页面的Page Object Model，封装了回收站的所有操作。
 * 回收站用于临时存储已删除的文件，用户可以恢复或永久删除这些文件。
 * 
 * 功能覆盖：
 * 1. 文件恢复：恢复单个文件
 * 2. 永久删除：永久删除单个文件
 * 3. 清空回收站：清空所有文件
 * 4. 批量操作：恢复全部文件
 * 
 * 测试场景：
 * - 恢复单个文件
 * - 永久删除文件
 * - 清空回收站
 * - 验证文件数量
 * 
 * @example
 * const trashPage = new TrashManagerPage(page)
 * await trashPage.goto()
 * await trashPage.restoreFile('test.jpg')
 */

import { Page, Locator, expect } from '@playwright/test'

/**
 * 回收站管理Page Object类
 */
export class TrashManagerPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly fileItems: Locator
  readonly emptyTrashButton: Locator
  readonly restoreAllButton: Locator

  constructor(page: Page) {
    this.page = page
    this.pageTitle = page.locator('h2:has-text("回收站")')
    this.fileItems = page.locator('.file-card')
    this.emptyTrashButton = page.locator('button:has-text("清空回收站")')
    this.restoreAllButton = page.locator('button:has-text("恢复全部")')
  }

  /**
   * 导航到回收站页面
   */
  async goto() {
    await this.page.goto('/')
    await this.page.locator('.sidebar-nav .menu-item:has-text("管理")').click()
    await this.page.locator('.admin-nav .nav-item:has-text("回收站")').click()
    await expect(this.pageTitle).toBeVisible()
  }

  /**
   * 恢复单个文件
   * @param fileName - 文件名称
   */
  async restoreFile(fileName: string) {
    const fileItem = this.fileItems.filter({ hasText: fileName })
    await fileItem.hover()
    
    this.page.on('dialog', dialog => dialog.accept())
    
    await fileItem.locator('.file-action-btn[title="恢复"]').click()
    await this.page.waitForTimeout(1000)
  }

  /**
   * 永久删除文件
   * @param fileName - 文件名称
   */
  async deletePermanently(fileName: string) {
    const fileItem = this.fileItems.filter({ hasText: fileName })
    await fileItem.hover()
    
    this.page.on('dialog', dialog => dialog.accept())
    
    await fileItem.locator('.file-action-btn.danger[title="永久删除"]').click()
    await this.page.waitForTimeout(1000)
  }

  /**
   * 清空回收站
   */
  async emptyTrash() {
    this.page.on('dialog', dialog => dialog.accept())
    await this.emptyTrashButton.click()
    await expect(this.fileItems).toHaveCount(0)
  }

  /**
   * 获取文件数量
   */
  async getFileCount() {
    return await this.fileItems.count()
  }
}
