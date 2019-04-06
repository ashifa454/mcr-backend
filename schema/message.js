import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  uid: {
    type: 'String', // It will be Object Id Reffering to user who sent message, but because we are not authenticating users to its a unique cuid
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rooms',
    required: true
  },
  message: {
    type: String,
    required: true
  }
})
mongoose.model('messages', messageSchema)
