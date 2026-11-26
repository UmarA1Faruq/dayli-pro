import { chromium } from 'playwright-core'
import path from 'node:path'
import fs from 'node:fs'

const outDir = path.resolve('screenshots')
fs.mkdirSync(outDir, { recursive: true })
const BASE = 'http://127.0.0.1:5173'
const errors = []
const checks = []

function assert(condition, message) {
  if (condition) {
    checks.push(`PASS ${message}`)
  } else {
    checks.push(`FAIL ${message}`)
    errors.push(`ASSERT: ${message}`)
  }
}

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})

async function newPage(viewport, authenticated = true) {
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

const shot = (page, name) =>
  page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: false })

// ---------- Desktop ----------
const { page } = await newPage({ width: 1280, height: 1000 }, false)
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await page.fill('#login-email', 'umar@daylipro.id')
await page.fill('#login-password', 'daylipro')
await shot(page, 'login-final')
await page.locator('button[type="submit"]').click()
await page.waitForURL('**/dashboard')
await page.waitForTimeout(500)
assert(await page.getByText('Tugas hari ini').first().isVisible(), 'login mengarah ke dashboard')
await shot(page, 'desktop-dashboard-fixed')

// Dark mode via header
await page.getByRole('button', { name: 'Aktifkan mode gelap' }).click()
await page.waitForTimeout(400)
await shot(page, 'desktop-dashboard-dark')
assert(
  await page.evaluate(() => document.documentElement.classList.contains('dark')),
  'mode gelap aktif dari header',
)
await page.getByRole('button', { name: 'Aktifkan mode terang' }).click()
await page.waitForTimeout(300)

// Command palette
await page.keyboard.press('Control+k')
await page.getByPlaceholder('Cari halaman, jurnal, tugas, atau habit…').waitFor()
await page.getByPlaceholder('Cari halaman, jurnal, tugas, atau habit…').fill('jurnal')
await page.waitForTimeout(350)
await shot(page, 'desktop-command-palette')
assert(
  (await page.getByText('Jurnal', { exact: true }).count()) > 0,
  'command palette menampilkan hasil',
)
await page.keyboard.press('Escape')
await page.waitForTimeout(250)

// Journal CRUD
await page.getByRole('link', { name: 'Jurnal' }).first().click()
await page.waitForURL('**/journal')
await page.getByRole('button', { name: 'Tulis jurnal' }).first().click()
await page.fill('#journal-title', 'Catatan Uji Otomatis')
await page.fill('#journal-content', 'Hari ini saya menguji seluruh alur aplikasi Dayli Pro.')
await page.getByRole('button', { name: 'Simpan jurnal' }).click()
await page.waitForTimeout(500)
assert(await page.getByText('Catatan Uji Otomatis').first().isVisible(), 'jurnal baru tersimpan')
await page.fill('input[aria-label="Cari jurnal"]', 'Uji Otomatis')
await page.waitForTimeout(350)
await page.getByRole('button', { name: 'Sematkan entri' }).first().click()
await page.waitForTimeout(250)
assert(
  (await page.getByRole('button', { name: 'Lepas sematan' }).count()) > 0,
  'jurnal dapat disematkan',
)
await page.getByText('Catatan Uji Otomatis').first().click()
const editVisible = await page.locator('#journal-title').isVisible()
assert(editVisible, 'editor jurnal terbuka saat judul diklik')
await page.fill('#journal-title', 'Catatan Uji Diperbarui')
await page.getByRole('button', { name: 'Simpan perubahan' }).click()
await page.waitForTimeout(400)
await page.fill('input[aria-label="Cari jurnal"]', 'Diperbarui')
await page.waitForTimeout(350)
assert(await page.getByText('Catatan Uji Diperbarui').first().isVisible(), 'jurnal dapat diedit')
await page.getByRole('button', { name: 'Hapus Catatan Uji Diperbarui' }).click()
await page.getByRole('button', { name: 'Hapus entri', exact: true }).click()
await page.waitForTimeout(400)
assert(
  (await page.getByText('Catatan Uji Diperbarui').count()) === 0,
  'jurnal dapat dihapus setelah konfirmasi',
)

// Tasks CRUD
await page.getByRole('link', { name: 'Tugas' }).first().click()
await page.waitForURL('**/tasks')
await page.getByRole('button', { name: 'Tambah tugas' }).first().click()
await page.fill('#task-title', 'Tugas Uji Otomatis')
await page.fill('#task-note', 'Dibuat oleh skrip pengujian.')
await page.locator('button[form="task-form"]').click()
await page.waitForTimeout(400)
assert(await page.getByText('Tugas Uji Otomatis').first().isVisible(), 'tugas baru tersimpan')
await page.getByRole('button', { name: 'Selesaikan Tugas Uji Otomatis' }).click()
await page.waitForTimeout(300)
assert(
  (await page.getByRole('button', { name: 'Buka kembali Tugas Uji Otomatis' }).count()) > 0,
  'status tugas dapat dicentang',
)
await page.getByRole('button', { name: 'Edit Tugas Uji Otomatis' }).click()
await page.fill('#task-title', 'Tugas Uji Diperbarui')
await page.locator('button[form="task-form"]').click()
await page.waitForTimeout(400)
assert(await page.getByText('Tugas Uji Diperbarui').first().isVisible(), 'tugas dapat diedit')
await page.getByRole('button', { name: 'Hapus Tugas Uji Diperbarui' }).click()
await page.getByRole('button', { name: 'Hapus tugas', exact: true }).click()
await page.waitForTimeout(400)
assert(
  (await page.getByText('Tugas Uji Diperbarui').count()) === 0,
  'tugas dapat dihapus',
)
await shot(page, 'desktop-tasks-fixed')

// Habits CRUD
await page.getByRole('link', { name: 'Habit', exact: true }).first().click()
await page.waitForURL('**/habits')
await page.getByRole('button', { name: 'Tambah habit' }).first().click()
await page.fill('#habit-name', 'Habit Uji Otomatis')
await page.fill('#habit-description', 'Dibuat oleh skrip pengujian.')
await page.locator('button[form="habit-form"]').click()
await page.waitForTimeout(400)
assert(await page.getByText('Habit Uji Otomatis').first().isVisible(), 'habit baru tersimpan')
const habitCheck = page.locator('button[aria-label^="Centang Habit Uji Otomatis"]').first()
await habitCheck.click()
await page.waitForTimeout(300)
assert(
  (await page.locator('button[aria-label^="Batalkan Habit Uji Otomatis"]').count()) > 0,
  'habit dapat dicentang',
)
await page.getByRole('button', { name: 'Edit Habit Uji Otomatis' }).click()
await page.fill('#habit-name', 'Habit Uji Diperbarui')
await page.locator('button[form="habit-form"]').click()
await page.waitForTimeout(400)
assert(await page.getByText('Habit Uji Diperbarui').first().isVisible(), 'habit dapat diedit')
await page.getByRole('button', { name: 'Hapus Habit Uji Diperbarui' }).click()
await page.getByRole('button', { name: 'Hapus habit', exact: true }).click()
await page.waitForTimeout(400)
assert(
  (await page.getByText('Habit Uji Diperbarui').count()) === 0,
  'habit dapat dihapus',
)
await shot(page, 'desktop-habits-fixed')

// Calendar detail panel
await page.getByRole('link', { name: 'Kalender' }).first().click()
await page.waitForURL('**/calendar')
await page.waitForTimeout(400)
assert(await page.getByText('Aktivitas harian').count() === 0, 'panel detail desktop tampil inline')
await shot(page, 'desktop-calendar-fixed')

// Stats
await page.getByRole('link', { name: 'Statistik' }).first().click()
await page.waitForURL('**/stats')
await page.waitForTimeout(800)
assert((await page.locator('.recharts-surface').count()) >= 1, 'grafik statistik ter-render')
await shot(page, 'desktop-stats-fixed')

// Settings: profile, accent, logout
await page.getByRole('link', { name: 'Pengaturan' }).first().click()
await page.waitForURL('**/settings')
await page.fill('#settings-name', 'Umar Penguji')
await page.getByRole('button', { name: 'Simpan perubahan' }).click()
await page.waitForTimeout(500)
assert(
  (await page.getByText('Umar Penguji').count()) > 0,
  'profil dapat diperbarui',
)
await page.getByRole('button', { name: 'Aktifkan mode gelap' }).click()
await page.getByRole('button', { name: 'Pilih warna aksen Mawar' }).click()
await page.waitForTimeout(500)
assert(
  await page.evaluate(() => document.documentElement.dataset.accent === 'rose'),
  'warna aksen dapat diubah',
)
await shot(page, 'desktop-settings-rose-dark')
await page.getByRole('button', { name: 'Keluar', exact: true }).click()
await page.getByRole('button', { name: 'Ya, keluar' }).click()
await page.waitForURL('**/login')
assert(true, 'logout kembali ke halaman login')

// ---------- Mobile ----------
const mobile = await newPage({ width: 375, height: 812 })
await mobile.page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
await mobile.page.waitForTimeout(600)
await shot(mobile.page, 'mobile-dashboard-fixed')
assert(
  await mobile.page.getByRole('button', { name: 'Tambah cepat' }).isVisible(),
  'FAB tampil di mobile',
)

await mobile.page.getByRole('button', { name: 'Tambah cepat' }).click()
await mobile.page.getByRole('button', { name: 'Tugas', exact: true }).click()
await mobile.page.fill('#quick-task-title', 'Tugas Cepat Mobile')
await mobile.page.locator('button[form="quick-add-form"]').click()
await mobile.page.waitForTimeout(400)
assert(
  (await mobile.page.getByText('Tugas Cepat Mobile').count()) > 0,
  'quick add tugas berfungsi',
)
await shot(mobile.page, 'mobile-quick-add')

await mobile.page.goto(`${BASE}/calendar`, { waitUntil: 'networkidle' })
await mobile.page.waitForTimeout(500)
await mobile.page.locator('button[aria-pressed]').nth(15).click()
await mobile.page.getByText('Aktivitas harian').first().waitFor()
assert(
  await mobile.page.getByRole('button', { name: 'Tulis jurnal' }).last().isVisible(),
  'panel aktivitas harian mobile terbuka',
)
await shot(mobile.page, 'mobile-calendar-day-panel')
await mobile.page.keyboard.press('Escape')

await mobile.page.goto(`${BASE}/stats`, { waitUntil: 'networkidle' })
await mobile.page.waitForTimeout(700)
await shot(mobile.page, 'mobile-stats-fixed')

await mobile.page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
await mobile.page.waitForTimeout(400)
await shot(mobile.page, 'mobile-settings-final')

await browser.close()

console.log(checks.join('\n'))
console.log(`\n${errors.length} error(s)`)
if (errors.length) console.log(errors.join('\n'))
process.exitCode = errors.length ? 1 : 0
