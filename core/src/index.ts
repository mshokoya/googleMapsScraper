import { io } from './websocket'
// import { scrapeGMaps } from './app';

io.getIO().on('startScrape', (arg) => {
  console.log(arg.id)
  console.log(arg.string)
})

io.startWebSocketServer(3000)
