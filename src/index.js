import express from 'express'
import chalk   from 'chalk'
import socketIO from 'socket.io'
import config  from './config'
import http from 'http'

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
  pingTimeout: 5000,
  pingInterval: 10000
})
const rooms = []
const messages = []
io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    socket.join(data.roomName)
    if (rooms.findIndex(item => item.roomName === data.roomName) < 0) {
      rooms.push(data)
      socket.emit('newRoomList', rooms)
      socket.emit('connectedToRoom')
    }
  })
  socket.on('getAllMessages', (data) => {
    const roomMessages = messages.filter(item => item.roomName === data.roomName)
    console.log('here are messages', roomMessages)
    io.to(socket.id).emit('allMessages', roomMessages)
  })
  socket.on('message', (data) => {
    const { roomName } = data
    messages.push(data)
    io.to(roomName).emit('messageReceived', data)
  })
  socket.on('disconnect', () => {
    console.log('user has been disconnected')
  })
  socket.on('getAllRooms', () => {
    socket.emit('newRoomList', rooms)
  })
})

server.listen(config.PORT, () => {
  const log = console.log
  log('\n')
  log(chalk.bgGreen.black(`Server listening on http://localhost:${config.PORT}/ ..`))
  log('\n')

  log(`${chalk.blue('Much fun! :)')}`)
  log('\n')
})

export default app
