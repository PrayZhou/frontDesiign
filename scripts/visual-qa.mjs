import { chromium } from "playwright-core"

const executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const baseURL = "http://127.0.0.1:4173/"

const browser = await chromium.launch({ executablePath, headless: true })

async function inspectViewport(name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto(baseURL, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)

  await page.evaluate(async () => {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = "auto"
    for (let y = 0; y < document.documentElement.scrollHeight; y += 640) {
      window.scrollTo(0, y)
      await new Promise((resolve) => window.setTimeout(resolve, 80))
    }
    window.scrollTo(0, 0)
    document.documentElement.style.scrollBehavior = previousScrollBehavior
  })
  await page.waitForTimeout(700)

  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
  }))

  await page.screenshot({
    path: `/tmp/axiom-${name}-full.png`,
    fullPage: true,
  })

  return { page, metrics }
}

const desktop = await inspectViewport("desktop-1440", 1440, 900)
const heroConsole = desktop.page.locator(".hero-console")
const heroBox = await heroConsole.boundingBox()
if (heroBox) {
  await desktop.page.mouse.move(heroBox.x + heroBox.width * 0.82, heroBox.y + heroBox.height * 0.22)
  await desktop.page.waitForTimeout(250)
}
const heroTransform = await heroConsole.evaluate((element) => getComputedStyle(element).transform)
await desktop.page.getByRole("button", { name: "Run Axiom" }).click()
await desktop.page.getByText(/Run complete/).waitFor({ timeout: 5000 })
await desktop.page.screenshot({
  path: "/tmp/axiom-desktop-complete.png",
  fullPage: false,
})
await desktop.page.close()

const interaction = await inspectViewport("desktop-interaction", 1440, 900)
await interaction.page.locator("#workflow").scrollIntoViewIfNeeded()
await interaction.page.waitForTimeout(900)
const workflowLineTransform = await interaction.page
  .locator(".capability-flow-line")
  .evaluate((element) => getComputedStyle(element).transform)
await interaction.page.getByRole("button", { name: "Try Product planning" }).click()
await interaction.page.getByText(/Planning the work graph/).waitFor()
const selectedObjective = await interaction.page
  .getByRole("textbox", { name: "Objective" })
  .inputValue()
await interaction.page.close()

const mobile = await inspectViewport("mobile-390", 390, 844)
await mobile.page.screenshot({
  path: "/tmp/axiom-mobile-first-viewport.png",
  fullPage: false,
})
await mobile.page.getByRole("button", { name: "Open navigation" }).click()
const dialog = mobile.page.getByRole("dialog", { name: "Navigate Axiom" })
await dialog.waitFor({ state: "visible" })
await mobile.page.waitForTimeout(300)
const dialogBox = await dialog.boundingBox()
await mobile.page.screenshot({
  path: "/tmp/axiom-mobile-menu.png",
  fullPage: false,
})
await mobile.page.getByRole("link", { name: "Product" }).last().click()
await dialog.waitFor({ state: "detached" })
await mobile.page.close()

const narrow = await inspectViewport("mobile-320", 320, 720)
await narrow.page.close()

const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await reduced.emulateMedia({ reducedMotion: "reduce" })
await reduced.goto(baseURL, { waitUntil: "networkidle" })
const reducedCursorCount = await reduced.locator(".console-cursor").count()
await reduced.close()

await browser.close()

console.log(
  JSON.stringify(
    {
      desktop: desktop.metrics,
      mobile: mobile.metrics,
      narrow: narrow.metrics,
      mobileDialog: dialogBox,
      interactions: {
        heroTransform,
        workflowLineTransform,
        selectedObjective,
        reducedCursorCount,
      },
    },
    null,
    2,
  ),
)
