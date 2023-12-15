import socketIO, { Socket } from 'socket.io'
import { scrapeGMaps } from './app'

interface ISocketIO {
  initWebSocketServer: () => void
  listen: (port: number) => void
  getIO: () => socketIO.Server
  getWebSocketIO: () => Socket
}

interface StartScrapeArg {
  id: string
  url: string
}

export const io: ISocketIO = (() => {
  let IO: socketIO.Server
  let webSocketIO: Socket

  const initWebSocketServer = (): void => {
    IO = new socketIO.Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    IO.on('connection', (socket) => {
      console.log(`socket ${socket.id} connected`)

      webSocketIO = socket

      socket.on('startScrape', async (arg: StartScrapeArg) => {
        console.log('startScrape this is dsaasd')
        await scrapeGMaps(arg.id, arg.url)
      })

      socket.on('disconnect', (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`)
      })
    })
  }

  const listen = (port: number): void => {
    IO.listen(port)
  }

  return {
    initWebSocketServer,
    getWebSocketIO: () => webSocketIO,
    getIO: () => IO,
    listen
  }
})()
