import { addRoom, getAllRooms } from '../helpers/room';
import { addMessage, getAllMessages } from '../helpers/message';

module.exports = (io) => {
  io.on('connection', socket => {
    socket.on('joinRoom', async data => {
      socket.join(data.roomName);
      const rooms = await getAllRooms().catch((err) => {
        console.error('error in finding room', err);

      })
      if (rooms.findIndex((item) => item.roomName === data.roomName) < 0) {
        const room = await addRoom(data.roomName).catch((err) => {
          console.error('error in adding room', err);
        });
        socket.broadcast.emit('newRoomList', [room, ...rooms]);
      }
      io.to(socket.id).emit('connectedToRoom');
    });
    socket.on('getAllMessages', async data => {
      const allMessages = await getAllMessages(data.roomName).catch((err) => {
        console.error('error in finding messages', err);
      });
      socket.emit('allMessages', allMessages);
    });
    socket.on('message', async data => {
      const { roomName } = data;
      console.log('here is data', data);
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
