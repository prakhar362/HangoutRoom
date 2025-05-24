import { io } from 'socket.io-client'

let socket = null

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      auth: {
        token
      }
    })

    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket 