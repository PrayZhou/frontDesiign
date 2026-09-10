import { chromium } from "playwright-core"

const executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const baseURL = "http://127.0.0.1:4173/"

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

try {
  await page.goto(baseURL, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)

  const styles = await page.evaluate(() => {
    function surface(selector) {
      const element = document.querySelector(selector)
      if (!element) throw new Error(`Missing ${selector}`)
      const style = getComputedStyle(element)
      return {
        borderRadius: Number.parseFloat(style.borderTopLeftRadius),
        backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
        backgroundColor: style.backgroundColor,
      }
    }

    return {
      hero: surface(".hero-console"),
      workspace: surface(".workspace-frame"),
      primaryAction: surface(".primary-cta"),
    }
  })

  const failures = []
  if (styles.hero.borderRadius < 20) failures.push("hero shell radius must be at least 20px")
  if (!styles.hero.backdropFilter.includes("blur")) failures.push("hero shell must use backdrop blur")
  if (styles.workspace.borderRadius < 20) failures.push("workspace shell radius must be at least 20px")
  if (!styles.workspace.backdropFilter.includes("blur")) failures.push("workspace shell must use backdrop blur")
  if (styles.primaryAction.borderRadius < 10) failures.push("primary controls must use at least a 10px radius")

  if (failures.length) {
    throw new Error(`${failures.join("; ")}\n${JSON.stringify(styles, null, 2)}`)
  }

  console.log(JSON.stringify(styles, null, 2))
} finally {
  await browser.close()
}

