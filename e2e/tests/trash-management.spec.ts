/**
 * Trash Management E2E Tests
 * 
 * This file contains comprehensive end-to-end tests for the trash management functionality.
 * Tests cover the complete workflow from file deletion to trash management operations.
 * 
 * Test Coverage:
 * 1. Delete file to trash and verify in trash
 * 2. Restore file from trash
 * 3. Permanently delete file from trash
 * 4. Empty trash
 * 
 * Test Flow:
 * - Prepare test data using API
 * - Perform UI operations
 * - Verify results through both UI and API
 * - Take screenshots at key steps
 */

import { test, expect } from '@playwright/test'
import { TrashManagerPage } from '../pages/TrashManagerPage'
import { HomePage } from '../pages/HomePage'
import { ApiHelpers } from '../utils/api-helpers'

test.describe('Trash Management', () => {
  let trashPage: TrashManagerPage
  let homePage: HomePage
  let api: ApiHelpers

  test.beforeEach(async ({ page, request }) => {
    trashPage = new TrashManagerPage(page)
    homePage = new HomePage(page)
    api = new ApiHelpers(request)
    
    await homePage.goto()
  })

  test('should delete file to trash and verify', async ({ page }) => {
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    await page.screenshot({ path: 'test-results/trash/1-initial-files.png', fullPage: true })

    const fileCount = await homePage.getFileCount()
    if (fileCount === 0) {
      test.skip()
      return
    }

    const fileName = await homePage.getFileName(0)
    console.log(`Deleting file: ${fileName}`)

    await homePage.selectFile(0)
    await page.screenshot({ path: 'test-results/trash/2-file-selected.png', fullPage: true })

    await homePage.deleteSelectedFiles()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/trash/3-file-deleted.png', fullPage: true })

    await trashPage.goto()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/4-trash-page.png', fullPage: true })

    const trashFileCount = await trashPage.getFileCount()
    expect(trashFileCount).toBeGreaterThan(0)

    const trashFiles = page.locator('.file-card')
    const fileInTrash = trashFiles.filter({ hasText: fileName })
    await expect(fileInTrash).toBeVisible()
    await page.screenshot({ path: 'test-results/trash/5-file-in-trash.png', fullPage: true })
  })

  test('should restore file from trash', async ({ page }) => {
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    const initialFileCount = await homePage.getFileCount()
    
    if (initialFileCount === 0) {
      test.skip()
      return
    }

    const fileName = await homePage.getFileName(0)
    console.log(`Testing restore for file: ${fileName}`)

    await homePage.selectFile(0)
    await homePage.deleteSelectedFiles()
    await page.waitForTimeout(1000)

    await trashPage.goto()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/restore-1-trash-page.png', fullPage: true })

    const trashFileCountBefore = await trashPage.getFileCount()
    expect(trashFileCountBefore).toBeGreaterThan(0)

    await trashPage.restoreFile(fileName)
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/restore-2-after-restore.png', fullPage: true })

    const trashFileCountAfter = await trashPage.getFileCount()
    expect(trashFileCountAfter).toBe(trashFileCountBefore - 1)

    await homePage.goto()
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/restore-3-home-page.png', fullPage: true })

    const finalFileCount = await homePage.getFileCount()
    expect(finalFileCount).toBe(initialFileCount)

    const restoredFile = page.locator('.xc-card').filter({ hasText: fileName })
    await expect(restoredFile).toBeVisible()
    await page.screenshot({ path: 'test-results/trash/restore-4-file-restored.png', fullPage: true })
  })

  test('should permanently delete file from trash', async ({ page }) => {
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    const fileCount = await homePage.getFileCount()
    
    if (fileCount === 0) {
      test.skip()
      return
    }

    const fileName = await homePage.getFileName(0)
    console.log(`Testing permanent delete for file: ${fileName}`)

    await homePage.selectFile(0)
    await homePage.deleteSelectedFiles()
    await page.waitForTimeout(1000)

    await trashPage.goto()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/delete-1-trash-page.png', fullPage: true })

    const trashFileCountBefore = await trashPage.getFileCount()
    expect(trashFileCountBefore).toBeGreaterThan(0)

    await trashPage.deletePermanently(fileName)
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/delete-2-after-delete.png', fullPage: true })

    const trashFileCountAfter = await trashPage.getFileCount()
    expect(trashFileCountAfter).toBe(trashFileCountBefore - 1)

    const deletedFile = page.locator('.file-card').filter({ hasText: fileName })
    await expect(deletedFile).not.toBeVisible()

    await homePage.goto()
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/delete-3-home-page.png', fullPage: true })

    const fileInHome = page.locator('.xc-card').filter({ hasText: fileName })
    await expect(fileInHome).not.toBeVisible()
    await page.screenshot({ path: 'test-results/trash/delete-4-verified.png', fullPage: true })
  })

  test('should empty trash', async ({ page }) => {
    await homePage.enterFolder(0)
    await homePage.waitForFilesToLoad()
    const fileCount = await homePage.getFileCount()
    
    if (fileCount < 2) {
      test.skip()
      return
    }

    console.log('Testing empty trash with multiple files')

    await homePage.selectFile(0)
    await homePage.deleteSelectedFiles()
    await page.waitForTimeout(500)

    await homePage.selectFile(0)
    await homePage.deleteSelectedFiles()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/empty-1-files-deleted.png', fullPage: true })

    await trashPage.goto()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/empty-2-trash-page.png', fullPage: true })

    const trashFileCountBefore = await trashPage.getFileCount()
    expect(trashFileCountBefore).toBeGreaterThanOrEqual(2)

    await trashPage.emptyTrash()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/empty-3-after-empty.png', fullPage: true })

    const trashFileCountAfter = await trashPage.getFileCount()
    expect(trashFileCountAfter).toBe(0)

    const emptyMessage = page.locator('text=回收站为空')
    await expect(emptyMessage).toBeVisible()
    await page.screenshot({ path: 'test-results/trash/empty-4-verified.png', fullPage: true })
  })

  test('should verify trash file count matches database', async ({ page, request: _request }) => {
    await trashPage.goto()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/trash/verify-1-trash-page.png', fullPage: true })

    const uiFileCount = await trashPage.getFileCount()

    const filesResponse = await api.getFiles(1, 100)
    console.log('Files response:', JSON.stringify(filesResponse, null, 2))
    
    let files: any[] = []
    if (Array.isArray(filesResponse.data)) {
      files = filesResponse.data
    } else if (filesResponse.data?.files && Array.isArray(filesResponse.data.files)) {
      files = filesResponse.data.files
    } else if (filesResponse.data?.records && Array.isArray(filesResponse.data.records)) {
      files = filesResponse.data.records
    }
    
    const dbTrashFiles = files.filter((file: any) => file.status === 2)
    const dbFileCount = dbTrashFiles.length

    console.log(`UI file count: ${uiFileCount}, DB file count: ${dbFileCount}`)
    
    expect(uiFileCount).toBe(dbFileCount)
    await page.screenshot({ path: 'test-results/trash/verify-2-count-matched.png', fullPage: true })
  })
})
