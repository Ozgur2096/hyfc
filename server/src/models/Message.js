import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  message_text: { type: String },
  sent_datetime: { type: Date, default: Date.now },
  chat_id: { type: mongoose.Types.ObjectId, required: true },
});

const Message = mongoose.model("messages", messageSchema);

export default Message;
