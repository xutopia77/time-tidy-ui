import { test, expect } from '@playwright/test'
import { TrashManagerPage } from '../pages/TrashManagerPage'
import { HomePage } from '../pages/HomePage'

test.describe('Trash Management', () => {
  let trashPage: TrashManagerPage
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    trashPage = new TrashManagerPage(page)
    homePage = new HomePage(page)
    
    await trashPage.goto()
  })

  test('should display trash page', async () => {
    await expect(trashPage.pageTitle).toBeVisible()
  })

  test('should restore file from trash', async ({ page }) => {
    const fileCount = await trashPage.getFileCount()
    
    if (fileCount > 0) {
      const firstFile = page.locator('.file-item').first()
      const fileName = await firstFile.locator('.file-name').textContent()
      
      await trashPage.restoreFile(fileName || '')
      
      // Verify file is removed from trash
      const newCount = await trashPage.getFileCount()
      expect(newCount).toBe(fileCount - 1)
    }
  })

  test('should permanently delete file', async ({ page }) => {
    const fileCount = await trashPage.getFileCount()
    
    if (fileCount > 0) {
      const firstFile = page.locator('.file-item').first()
      const fileName = await firstFile.locator('.file-name').textContent()
      
      await trashPage.deletePermanently(fileName || '')
      
      const newCount = await trashPage.getFileCount()
      expect(newCount).toBe(fileCount - 1)
    }
  })

  test('should empty trash', async () => {
    const fileCount = await trashPage.getFileCount()
    
    if (fileCount > 0) {
      await trashPage.emptyTrash()
      
      const newCount = await trashPage.getFileCount()
      expect(newCount).toBe(0)
    }
  })
})
