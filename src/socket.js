import { addRoom, getAllRooms } from '../helpers/room';
import { addMessage, getAllMessages } from '../helpers/message';

module.exports = (io) => {
  io.on('connection', socket => {
    socket.on('joinRoom', async data => {
      socket.join(data.roomName);
      let rooms = await getAllRooms().catch((err) => {
        console.error('error in finding room', err);

      })
      const roomIdx = rooms.findIndex((item) => item.name === data.roomName);
      if (roomIdx < 0) {
        const room = await addRoom(data.roomName).catch((err) => {
          console.error('error in adding room', err);
        });
        rooms = [room, ...rooms]
        socket.broadcast.emit('newRoomList', rooms);
        socket.emit('connectedToRoom', rooms[0]);
      } else {
        socket.emit('connectedToRoom', rooms[roomIdx]);
      }
    });
    socket.on('getAllMessages', async data => {
      let allMessages = [];
      if (data.roomId) {
        allMessages = await getAllMessages(data.roomId).catch((err) => {
          console.error('error in finding messages', err);
        });
      }
      socket.emit('allMessages', allMessages);
    });
    socket.on('message', async data => {
      const { roomName } = data;
      await addMessage(data).catch((err) => {
        console.error('error in adding message', err);
      });
      io.to(roomName).emit('messageReceived', data);
    });
    socket.on('disconnect', () => {
      console.log('user has been disconnected');
    });
    socket.on('getAllRooms', async () => {
      const allRooms = await getAllRooms().catch((err) => {
        console.error('error in finding all rooms', err);
      })
      socket.emit('newRoomList', allRooms);
    });
  });
}
