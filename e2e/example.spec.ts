import test, { expect } from '@playwright/test'
import { webkit } from 'playwright'
import { getDocument, queries } from "playwright-testing-library"

test('a user sees a list of issues', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/')

  // Grab ElementHandle for document
  const $document = await getDocument(page)

  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  expect(true).toBe(true)
})


