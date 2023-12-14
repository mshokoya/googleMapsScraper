import { io } from './websocket'
// import { scrapeGMaps } from './app';

io.startWebSocketServer(3000)

io.getIO().on('startScrape', (arg) => {
  console.log(arg.id)
  console.log(arg.string)
})
