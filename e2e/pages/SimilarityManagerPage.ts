/**
 * 相似度检测Page Object
 * 
 * 本文件实现了相似度检测页面的Page Object Model，封装了相似度检测的所有操作。
 * 相似度检测功能用于识别文件仓库中的相似或重复文件，帮助用户清理冗余文件。
 * 
 * 功能覆盖：
 * 1. 启动检测：开始相似度检测过程
 * 2. 查看结果：查看检测到的相似文件组
 * 3. 删除文件：删除相似文件组中的文件
 * 4. 进度监控：监控检测进度
 * 
 * 测试场景：
 * - 启动相似度检测
 * - 等待检测完成
 * - 查看相似文件组
 * - 删除相似文件
 * 
 * @example
 * const similarityPage = new SimilarityManagerPage(page)
 * await similarityPage.goto()
 * await similarityPage.startDetection()
 * await similarityPage.waitForDetectionComplete()
 */

import { Page, Locator, expect } from '@playwright/test'

/**
 * 相似度检测Page Object类
 */
export class SimilarityManagerPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly startDetectionButton: Locator
  readonly progressBar: Locator
  readonly similarityGroups: Locator

  constructor(page: Page) {
    this.page = page
    this.pageTitle = page.locator('h2:has-text("相似文件管理")')
    this.startDetectionButton = page.locator('button:has-text("开始检测")')
    this.progressBar = page.locator('.progress-bar')
    this.similarityGroups = page.locator('.similarity-group')
  }

  /**
   * 导航到相似度检测页面
   */
  async goto() {
    await this.page.goto('/')
    await this.page.locator('.sidebar-nav .menu-item:has-text("管理")').click()
    await this.page.locator('.admin-nav .nav-item:has-text("相似文件")').click()
    await expect(this.pageTitle).toBeVisible()
  }

  /**
   * 启动相似度检测并等待完成
   * 
   * 这个方法会：
   * 1. 点击开始检测按钮
   * 2. 等待检测结果出现（相似文件组）
   * 
   * 注意：不强制等待progressBar，因为如果后台处理很快，progressBar可能一闪而过
   * 
   * @param timeout - 超时时间，默认60秒
   */
  async startDetectionAndWaitForComplete(timeout: number = 60000) {
    // 点击开始检测按钮
    await this.startDetectionButton.click()
    
    // 直接等待相似文件组出现（最终结果）
    // 不强制等待progressBar，因为可能一闪而过
    await expect(this.similarityGroups.first()).toBeVisible({ timeout })
  }

  /**
   * 启动相似度检测（仅点击按钮，不等待结果）
   * 
   * 这个方法只负责点击按钮，不等待任何结果
   * 适用于需要单独验证progressBar的场景
   */
  async startDetection() {
    await this.startDetectionButton.click()
  }

  /**
   * 等待进度条出现（可选）
   * 
   * 这个方法会尝试等待progressBar出现，但如果progressBar已经消失也不会报错
   * 使用Promise.race实现：要么progressBar出现，要么直接继续
   * 
   * @param timeout - 超时时间，默认5秒
   */
  async waitForProgressBarOptional(timeout: number = 5000) {
    try {
      // 尝试等待progressBar出现
      // 使用较短的超时时间，因为progressBar可能很快就消失
      await this.progressBar.waitFor({ state: 'visible', timeout })
    } catch (error) {
      // 如果progressBar已经消失（处理很快），忽略错误继续执行
      console.log('Progress bar not visible (may have completed quickly)')
    }
  }

  /**
   * 等待检测完成
   * @param timeout - 超时时间，默认60秒
   */
  async waitForDetectionComplete(timeout: number = 60000) {
    // 等待progressBar消失（如果存在的话）
    try {
      await expect(this.progressBar).not.toBeVisible({ timeout: 5000 })
    } catch (error) {
      // progressBar可能本来就不存在，忽略错误
    }
    
    // 等待相似文件组出现
    await expect(this.similarityGroups.first()).toBeVisible({ timeout })
  }

  /**
   * 删除相似文件
   * @param groupIndex - 相似文件组索引，默认为0
   */
  async deleteSimilarFiles(groupIndex: number = 0) {
    const group = this.similarityGroups.nth(groupIndex)
    await group.locator('button:has-text("全选")').click()

    await group.locator('button:has-text("删除选中")').click()

    // confirm inside NPopconfirm
    const popconfirm = this.page.locator('.n-popconfirm')
    await popconfirm.waitFor({ state: 'visible', timeout: 5000 })
    await popconfirm.locator('button:has-text("确认")').click()
  }

  /**
   * 获取相似文件组数量
   */
  async getGroupCount() {
    return await this.similarityGroups.count()
  }
}
