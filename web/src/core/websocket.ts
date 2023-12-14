import { connect, Socket } from 'socket.io-client'

interface IClientSocketIO {
  startWebSocketServer: () => void
  getIO: () => Socket
}

export const io: IClientSocketIO = (() => {
  let IO: Socket;

  const startWebSocketServer = () => {
    IO = connect('http://localhost:3000')
  }

  return {
    startWebSocketServer,
    getIO: () => IO,
  }
})()
