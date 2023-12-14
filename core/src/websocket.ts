import socketIO from 'socket.io'

interface ISocketIO {
  startWebSocketServer: (port: number) => void
  getIO: () => socketIO.Server
}

export const io: ISocketIO = (() => {
  let IO: socketIO.Server

  const startWebSocketServer = (port: number): void => {
    IO = new socketIO.Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    IO.on('connection', (socket) => {
      console.log(`socket ${socket.id} connected`)

      socket.on('disconnect', (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`)
      })
    })

    IO.listen(port)
  }

  return {
    startWebSocketServer,
    getIO: () => IO
  }
})()
