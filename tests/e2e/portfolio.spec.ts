import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

test('numbered navigation, shared links and history stay in sync', async ({ page }) => {
  await page.goto('/#egitim')
  await expect(page.getByRole('heading', { name: 'Öğrenmek, hep yeniden.' })).toBeVisible()
  await page.getByRole('button', { name: '4 · Projeler', exact: true }).click()
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await expect(page).toHaveURL(/#projeler$/)
  await page.getByText('Oyun bağımlılığı risk sınıflandırması', { exact: true }).click()
  await expect(page.getByText(/MLP modeliyle %92,5/)).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('button', { name: '3 · Eğitim', exact: true })).toHaveAttribute('aria-current', 'page')
  await page.goForward()
  await expect(page.getByRole('button', { name: '4 · Projeler', exact: true })).toHaveAttribute('aria-current', 'page')
})

test('rapid selection and keyboard honor the final requested section', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '2 · Deneyim', exact: true }).click()
  await page.getByRole('button', { name: '5 · İletişim', exact: true }).click()
  await page.getByRole('button', { name: '3 · Eğitim', exact: true }).click()
  await expect(page.getByRole('button', { name: '3 · Eğitim', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#projeler$/)
  await expect(page.getByRole('button', { name: '4 · Projeler', exact: true })).toHaveAttribute('aria-current', 'page')
})

test('layout stays within the viewport and number targets stay usable', async ({ page }) => {
  for (const hash of ['hakkimda', 'deneyim', 'egitim', 'projeler', 'iletisim']) {
    await page.goto('/#' + hash)
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy()
    const box = await page.getByRole('navigation', { name: 'Portfolyo bölümleri' }).boundingBox()
    const viewport = page.viewportSize()!
    expect(Math.abs(box!.x + box!.width / 2 - viewport.width / 2)).toBeLessThan(2)
    expect(box!.width).toBeLessThanOrEqual(301)
    for (const button of await page.getByRole('navigation').getByRole('button').all()) {
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    }
  }
})

test('vertical scroll remains native and horizontal input changes sections', async ({ page, isMobile }) => {
  await page.goto('/#deneyim')
  await page.mouse.move(150, 350)
  await page.mouse.wheel(0, 400)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
  await expect(page).toHaveURL(/#deneyim$/)
  if (isMobile) {
    const touch = await page.context().newCDPSession(page)
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 340, y: 300 }] })
    for (const x of [280, 220, 150, 80]) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 300 }] })
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  } else await page.mouse.wheel(150, 0)
  await expect(page).toHaveURL(/#egitim$/)
})

test('reduced motion and unavailable WebGL preserve content and navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type === 'webgl' || type === 'webgl2') return null
      return (original as Function).apply(this, [type, ...args])
    } as typeof original
  })
  await page.goto('/')
  await expect(page.locator('[data-fallback="true"]')).toBeVisible()
  await expect(page.getByText('Hareket azaltma tercihiniz uygulanıyor.')).toBeVisible()
  await page.getByRole('button', { name: '5 · İletişim', exact: true }).click()
  await expect(page.getByRole('link', { name: /silacakmak411@gmail.com/ })).toHaveAttribute('href', 'mailto:silacakmak411@gmail.com')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
})

test('project dialog is keyboard accessible and escape returns control', async ({ page }) => {
  await page.goto('/#projeler')
  await page.getByRole('button', { name: 'Çalışmalar hakkında', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('liquid surface renders without shader errors and produces review screenshots', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('[data-fallback="true"]')).toHaveCount(0)
  await mkdir('output/screenshots', { recursive: true })
  await page.screenshot({ path: `output/screenshots/${testInfo.project.name}-hakkimda.png`, fullPage: true })
  await page.getByRole('button', { name: '4 · Projeler', exact: true }).click()
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.screenshot({ path: `output/screenshots/${testInfo.project.name}-projeler.png`, fullPage: true })
  expect(errors).toEqual([])
})
