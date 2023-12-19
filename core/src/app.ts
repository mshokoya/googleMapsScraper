import { scraper } from './scraper'
import { io } from './websocket'
import fs from 'node:fs'
import { getCardsData } from './dom'

interface Card {
  name: string
  address: string
  phone: string
  website: string
  rating: string
  ratingNumber: string
}

const selectors = {
  acceptAllButtonSelector: 'button[aria-label="Accept all"]',
  googleMapCard: 'div[data-test-id="organic-list-card"]'
}

export const scrapeGMaps = async (id: string, searchStr: string): Promise<void> => {
  io.getWebSocketIO().emit('status', { status: true, id })
  const url = `https://www.google.com/localservices/prolist?hl=en-GB&gl=uk&ssta=1&q=${encodeURIComponent(searchStr)}&oq=${encodeURIComponent(searchStr)}&src=2`
  let scrapedData: Card[] = []

  await scraper.launchBrowser()
  const page = scraper.getPage()

  const startTime = new Date()

  await page.goto(url)

  const acceptAllButton = await page.$(selectors.acceptAllButtonSelector)
  if (acceptAllButton !== null) await acceptAllButton.click()

  await page.waitForTimeout(3000)

  const getMapsData = async (): Promise<void> => {
    const cards = await getCardsData()

    console.log(`[data] Succesfully scraped ${cards.length} records, continuing to the next page if it's available`)

    io.getWebSocketIO().emit('field', { id, data: cards })
    scrapedData = scrapedData.concat(cards)

    const nextButton = await page.$('button[aria-label="Next"]')
    if (nextButton !== null) {
      try {
        await nextButton.click()
        // await new Promise(r => setTimeout(r, 5000))
        await page.waitForTimeout(5000)
        await getMapsData()
      } catch (e) {
        fs.writeFileSync(`output-${id}-${searchStr}.json`, JSON.stringify(scrapedData), 'utf-8')

        console.log('[+] Records saved to JSON file')
        console.log(`[success] Scraped ${scrapedData.length} records in ${(Date.now() - startTime.getTime()) / 1000}s`)
      }
    } else {
      fs.writeFileSync(`output-${id}-${searchStr}.json`, JSON.stringify(scrapedData), 'utf-8')

      console.log('[+] Records saved to JSON file')
      console.log(`[success] Scraped ${scrapedData.length} records in ${(Date.now() - startTime.getTime()) / 1000}s`)
    };
  }

  await getMapsData()
    .then(async () => {
      io.getWebSocketIO().emit('status', { status: false, id })
      await scraper.close()
    })
    .catch(async (err: any) => {
      console.log('error')
      console.log(err)
      io.getWebSocketIO().emit('status', { status: false, id })
      await scraper.close()
    })
}

// (Math.random() + 1).toString(36).substring(7)
