import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import StealthUserAgent from 'puppeteer-extra-plugin-anonymize-ua'
import AdBlockerPlugin from 'puppeteer-extra-plugin-adblocker'
import { Browser, Page } from 'puppeteer-extra-plugin/dist/puppeteer'

puppeteer.use(StealthPlugin())
puppeteer.use(StealthUserAgent({
  stripHeadless: true,
  makeWindows: true
}))
puppeteer.use(AdBlockerPlugin({ blockTrackers: true }))

export const scraper = (() => {
  let browser: Browser | undefined
  let page: Page | undefined

  const launchBrowser = async (): Promise<void> => {
    if (browser !== undefined && page !== undefined) throw new Error('browser & page already exist')
    browser = await puppeteer.launch({ headless: false })
    page = await browser.newPage()
  }

  const restartBrowser = async (): Promise<void> => {
    if (browser !== undefined) await browser.close()
    await launchBrowser()
  }

  const visit = async (url: string): Promise<void> => {
    if (page === undefined) throw new Error('page is undefined')
    await page.goto(url)
  }

  const close = async (): Promise<void> => {
    if (browser !== undefined) await browser.close()
    browser = undefined
    page = undefined
  }

  const getPage = (): Page => {
    if (page === undefined) throw new Error('page is undefined')
    return page
  }

  const getBrowser = (): Browser => {
    if (browser === undefined) throw new Error('browser is undefined')
    return browser
  }

  return {
    launchBrowser,
    restartBrowser,
    visit,
    close,
    getPage,
    getBrowser
  }
})()
