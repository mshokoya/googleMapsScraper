/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// @ts-nocheck
import { scraper } from './scraper'

export async function getCardsData (): Promise<Card[]> {
  const page = scraper.getPage()

  return page.evaluate(async () => {
    const organicCards = Array.from(document.querySelectorAll('div[data-test-id="organic-list-card"]'))

    const cardData = []
    for (const card of organicCards) {
      try {
        await card.querySelector('div[role="button"] > div:first-of-type').click()
        await new Promise(resolve => setTimeout(() => { resolve() }, 1000))

        const name = document.querySelector('.tZPcob') ? document.querySelector('.tZPcob').innerText : 'NONE'
        const phoneNumber = document.querySelector('[data-phone-number][role="button"][class*=" "]') ? document.querySelector('[data-phone-number][role="button"][class*=" "]').querySelector('div:last-of-type').innerHTML : 'NONE'
        const website = document.querySelector('.iPF7ob > div:last-of-type') ? document.querySelector('.iPF7ob > div:last-of-type').innerHTML : 'NONE'
        const address = document.querySelector('.fccl3c') ? document.querySelector('.fccl3c').innerText : 'NONE'
        const rating = document.querySelector('.pNFZHb .rGaJuf').innerHTML ? document.querySelector('.pNFZHb .rGaJuf').innerHTML : 'NONE'
        const ratingNumber = document.querySelector('.QwSaG .leIgTe').innerHTML.replace(/\(|\)/g, '')

        cardData.push({
          name,
          address,
          phone: phoneNumber === 'NONE' ? phoneNumber : phoneNumber,
          website,
          rating,
          ratingNumber
        })
      } catch (e) {
        console.log(e)
      }
    };

    return cardData
  })
}
