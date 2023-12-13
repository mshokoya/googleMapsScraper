import { scraper } from './scraper'
import { getCardsData } from './dom'
import { io } from './websocket'
import fs from 'node:fs'

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
  io.getIO().emit('status', { status: true, id })
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
    const cards = await page.evaluate(async () => await getCardsData(document))

    console.log(`[data] Succesfully scraped ${cards.length} records, continuing to the next page if it's available`)

    io.getIO().emit('data', JSON.stringify({ data: cards }))

    scrapedData = scrapedData.concat(cards)

    const nextButton = await page.$('button[aria-label="Next"]')
    if (nextButton !== null) {
      try {
        await nextButton.click()
        // await new Promise(r => setTimeout(r, 5000))
        await page.waitForTimeout(5000)
        await getMapsData()
      } catch (e) {
        fs.writeFileSync(`output-${id}-${searchStr}.csv`, JSON.stringify(scrapedData), 'utf-8')

        console.log('[+] Records saved to CSV file')
        console.log(`[success] Scraped ${scrapedData.length} records in ${(Date.now() - startTime.getTime()) / 1000}s`)
      }
    } else {
      fs.writeFileSync(`output-${id}-${searchStr}.csv`, JSON.stringify(scrapedData), 'utf-8')

      console.log('[+] Records saved to CSV file')
      console.log(`[success] Scraped ${scrapedData.length} records in ${(Date.now() - startTime.getTime()) / 1000}s`)
    };
  }

  await getMapsData()
    .then(() => {
      io.getIO().emit('status', { status: false, id })
    })
    .catch(() => {
      io.getIO().emit('status', { status: false, id })
    })
}

// (Math.random() + 1).toString(36).substring(7)
