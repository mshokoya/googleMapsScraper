import { useState } from 'react'
import { io} from './websocket';

type ScrapeReqArgs = {url: string, id: string}
type ScrapeStatusRes = {status: boolean, id: string, ok: boolean | null}
type ScrapingState  = {status: boolean, id: string | null}

export type UseWebsocket = {
  scrapeUrl: (url: string) => ScrapeReqArgs
  isScraping: ScrapingState
}


export const useWebsocket = (): UseWebsocket => {
  const [isScraping, setIsScraping] = useState<ScrapingState>({status: false, id: null})
  // const 

  io.getIO().on('status', ({status, id}: ScrapeStatusRes) => {
    status === true
      ? setIsScraping({status, id})
      : setIsScraping({status, id: null})
  })

  const scrapeUrl = (url: string): ScrapeReqArgs => {
    const id = (Math.random() + 1).toString(36).substring(7)
    const data = {id, url}

    io.getIO().emit('startScrape', data )
    return data
  }

  return {
    scrapeUrl,
    isScraping
  }
}

type ScrapeDataStructure = {name: string, address: string, phone: string, website: string, rating: string, ratingNumber: string}
type ScrapeDataState = {[id: string]: ScrapeDataStructure[]}
type ScrapeNewFieldRes = {id: string, data: ScrapeDataStructure[]}
type ScrapeDataRes = {id: string, data: ScrapeDataStructure[]}
type ScrapeAllDataRes = {[id:string]: ScrapeDataStructure[]}

export type UseScrapeData = {
  getAllData: () => void
  getData: (id: string) => void
  data: ScrapeDataState
  newSearchField: (args: ScrapeReqArgs) => void
}

export const useScrapeData = (): UseScrapeData => {
  const [data, setData] = useState<ScrapeDataState>({})

  io.getIO().on('field', (msg: ScrapeNewFieldRes) => {

    setData( prev => (
      {
        ...prev, 
        [msg.id]: [...prev[msg.id], ...msg.data]
      }
    )) 
  })

  io.getIO().on('getAllData', (msg: ScrapeAllDataRes) => {
    setData(msg)
  })

  io.getIO().on('getData', (msg: ScrapeDataRes) => {
    setData({...data, [msg.id]: msg.data})
  })

  const getData = (id: string) => {
    io.getIO().emit('getData', id)
  }

  const getAllData = () => {
    io.getIO().emit('getAllData')
  }

  const newSearchField = (args: ScrapeReqArgs): void => {
    console.log('state')
    console.log({...data, [args.id]: []})
    setData({...data, [args.id]: []})
  }

  return {
    getAllData,
    getData,
    data,
    newSearchField
  }

}