import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  is_public: { type: Boolean, required: true },
  receiver_id: { type: mongoose.Types.ObjectId, default: null },
  creator_user: { type: mongoose.Types.ObjectId, required: true },
  creation_time: { type: Date, default: Date.now },
  chat_title: { type: String },
  chat_text: { type: String },
  category_ids: [{ type: mongoose.Types.ObjectId }],
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
