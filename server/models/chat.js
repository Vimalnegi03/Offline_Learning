// models/chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
  });
  

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
