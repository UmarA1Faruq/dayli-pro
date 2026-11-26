import { chromium } from 'playwright-core'
import path from 'node:path'
import fs from 'node:fs'

const outDir = path.resolve('screenshots')
fs.mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})

const errors = []

async function makePage(viewport, authenticated = true) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  const page = await context.newPage()
  page.on('pageerror', (error) => errors.push(`PAGEERROR: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`CONSOLE: ${message.text()}`)
  })
  if (authenticated) {
    await page.addInitScript(() => sessionStorage.setItem('dayli-auth', '1'))
  }
  return { context, page }
}

const pages = [
  ['dashboard', '/dashboard'],
  ['journal', '/journal'],
  ['tasks', '/tasks'],
  ['habits', '/habits'],
  ['calendar', '/calendar'],
  ['stats', '/stats'],
  ['settings', '/settings'],
]

const desktop = await makePage({ width: 1280, height: 1000 })
for (const [name, route] of pages) {
  await desktop.page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle' })
  await desktop.page.waitForTimeout(700)
  await desktop.page.screenshot({ path: path.join(outDir, `desktop-${name}.png`), fullPage: false })
  console.log(`desktop ${name}`, await desktop.page.title())
}

const mobile = await makePage({ width: 375, height: 812 })
for (const [name, route] of pages) {
  await mobile.page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle' })
  await mobile.page.waitForTimeout(700)
  await mobile.page.screenshot({ path: path.join(outDir, `mobile-${name}.png`), fullPage: false })
  console.log(`mobile ${name}`, await mobile.page.title())
}

console.log('ERRORS', JSON.stringify(errors, null, 2))
await browser.close()
