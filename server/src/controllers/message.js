import { logError } from "../util/logging.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
// import mongoose from "mongoose";

// get messages by chat id
export const getMessagesByChatId = async (req, res) => {
  try {
    const { chat_id } = req.query;
    const messages = await Message.find({ chat_id: chat_id });

    // Update the array in order to add a new property (userImage)
    const updatedAnswers = await Promise.all(
      messages.map(async (message) => {
        const [user] = await User.find({ _id: message.user_id });
        const image = user ? user.image : null;

        const updatedMessage = {
          ...message.toObject(),
          userImage: image,
        };
        return updatedMessage;
      })
    );

    // Send the messages as the response
    res.send({ success: true, result: updatedAnswers });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages." });
  }
};

// create a new message
export const createMessage = async (req, res) => {
  try {
    const { user_id, message_text, chat_id } = req.body;
    const newMessage = new Message({
      user_id,
      message_text,
      chat_id,
    });

    const savedMessage = await newMessage.save();

    res.send({ success: true, result: savedMessage });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new message." });
  }
};
