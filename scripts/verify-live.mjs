import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

// Optional service access is accepted only over hidden stdin and is never saved.
process.stdout.write('Ready for live verification JSON on stdin (input is hidden).\n')
if (process.stdin.isTTY) process.stdin.setRawMode(true)
const input = await new Promise((resolve, reject) => {
  let text = ''
  process.stdin.setEncoding('utf8'); process.stdin.resume()
  const listener = chunk => {
    text += chunk
    if (text.includes('\u0003')) { reject(new Error('Cancelled')); process.stdin.pause(); return }
    if (text.includes('\n')) {
      process.stdin.off('data', listener); process.stdin.pause()
      if (process.stdin.isTTY) process.stdin.setRawMode(false)
      try { resolve(JSON.parse(text.trim())) } catch { reject(new Error('Invalid verification input')) }
    }
  }
  process.stdin.on('data', listener)
})
const origin = new URL(input.url).origin
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync(chrome) ? chrome : undefined) })
const results = []
try {
  await mkdir('output', { recursive: true })
  for (const [name, width, height, mobile] of [['desktop',1440,1000,false], ['mobile',390,844,true], ['compact',320,740,true]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 })
    if (input.token) await context.route('**/*', async route => {
      if (new URL(route.request().url()).origin === origin) {
        await route.continue({ headers: { ...route.request().headers(), 'OAI-Sites-Authorization': `Bearer ${input.token}` } })
      } else await route.continue()
    })
    await context.addInitScript(() => {
      window.__drawSamples = []
      const proto = window.WebGL2RenderingContext?.prototype
      if (!proto) return
      const original = proto.drawElements
      proto.drawElements = function (...args) {
        window.__drawSamples.push(performance.now())
        if (window.__drawSamples.length > 120) window.__drawSamples.shift()
        return original.apply(this,args)
      }
    })
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    const response = await page.goto(`${origin}/#hakkimda`, { waitUntil: 'networkidle' })
    if (!response?.ok()) throw new Error(`${name}: live page request failed`)
    await page.getByRole('heading', {name:'Merakla başlar. Veriyle şekillenir.'}).waitFor()
    await page.locator('canvas:not([hidden])').waitFor()
    await page.evaluate(() => document.fonts.ready)
    const fonts = await page.evaluate(() => ({
      serif: document.fonts.check('16px "Bodoni Moda"', 'Sıla Çakmak · Öğrenmek'),
      sans: document.fonts.check('16px Inter', 'İş deneyimi · Eğitim'),
    }))
    if (!fonts.serif || !fonts.sans) throw new Error(`${name}: local fonts did not load`)
    await page.waitForFunction(() => window.__drawSamples.length >= 30, { timeout: 15000 })
    const timing = await page.evaluate(() => {
      const samples = window.__drawSamples, deltas = samples.slice(1).map((v,i)=>v-samples[i])
      const sorted = [...deltas].sort((a,b)=>a-b)
      return { samples: samples.length, meanFrameMs: Math.round(deltas.reduce((a,b)=>a+b,0)/deltas.length*10)/10, p95FrameMs: Math.round(sorted[Math.floor(sorted.length*.95)]*10)/10 }
    })
    await page.screenshot({ path:`output/live-${name}.png`, fullPage:true })
    let sectionsPassed = 0
    for (const id of ['hakkimda','deneyim','egitim','projeler','iletisim']) {
      await page.goto(`${origin}/#${id}`)
      await page.locator(`[data-section="${id}"]`).waitFor()
      if (id === 'projeler') {
        await page.getByText('Oyun bağımlılığı risk sınıflandırması', { exact: true }).click()
        const article = page.getByRole('link', { name: 'Makaleyi oku' })
        if (await article.getAttribute('href') !== 'https://dergipark.org.tr/en/pub/jsrc/article/1940012') throw new Error(`${name}: publication link mismatch`)
      }
      if (!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)) throw new Error(`${name}: horizontal overflow in ${id}`)
      const box = await page.getByRole('navigation',{name:'Portfolyo bölümleri'}).boundingBox()
      if (!box || Math.abs(box.x+box.width/2-width/2)>2) throw new Error(`${name}: navigation is not centered`)
      sectionsPassed++
    }
    await page.getByRole('button',{name:'4 · Projeler',exact:true}).click()
    await page.locator('[data-section="projeler"]').waitFor()
    await page.goBack()
    await page.locator('[data-section="iletisim"]').waitFor()
    if (errors.length) throw new Error(`${name}: browser runtime error`)
    await context.route('**/*.{woff,woff2}', route => route.abort())
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByRole('button',{name:'4 · Projeler',exact:true}).click()
    await page.locator('[data-section="projeler"]').waitFor()
    if (!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)) throw new Error(`${name}: fallback font overflow`)
    results.push({ name,width,height,sectionsPassed,historyPassed:true,publicationLinkPassed:true,fonts,fallbackFontsPassed:true,runtimeErrors:errors.length,rendering:timing })
    await context.close()
  }
  await writeFile('output/live-verification.json', JSON.stringify({ origin, checkedAt:new Date().toISOString(), results },null,2))
  console.log(JSON.stringify({ origin, results }))
} finally { await browser.close() }
