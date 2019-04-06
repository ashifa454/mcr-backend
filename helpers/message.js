import mongoose from 'mongoose';

const Messages = mongoose.model('messages')

const addMessage = (data) => new Promise((resolve, reject) => {
  const message = new Messages({
    roomId: data.roomId,
    uid: data.uid,
    message: data.message
  });
  message.save((err, result) => {
    err ? reject(err) : resolve(result)
  })
});
const getAllMessages = (roomId) => new Promise((resolve, reject) => {
  Messages.find({ roomId: roomId }).exec((err, result) => {
    err ? reject(err) : resolve(result)
  })
});
export {
  addMessage,
  getAllMessages
}
