import { logError } from "../util/logging.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// get chats by category id
export const getChatsByCategoryId = async (req, res) => {
  try {
    const { category_id, is_public } = req.query;
    // Find chats where at least one category_id matches
    const chats = await Chat.find({
      category_ids: { $in: category_id },
      is_public,
    });

    // Update the array in order to add a new property (numberOfAnswers and userImage)
    const updatedAnswers = await Promise.all(
      chats.map(async (chat) => {
        const [user] = await User.find({ _id: chat.creator_user });
        const image = user ? user.image : null;

        const messages = await Message.find({ chat_id: chat._id });
        const numberOfMessages = messages.length;
        const updatedChat = {
          ...chat.toObject(),
          numberOfAnswers: numberOfMessages,
          userImage: image,
        };
        return updatedChat;
      })
    );

    // Send the chats as the response
    res.send({ success: true, result: updatedAnswers });
  } catch (error) {
    logError(error);
    res.status(500).json({ error: "An error occurred while fetching chats." });
  }
};

export const postNewQuestion = async (req, res) => {
  const formData = req.body;

  const newChat = new Chat(formData);

  try {
    const savedChat = await newChat.save();

    res.json({
      success: true,
      message: "Question submitted successfully",
      chat: savedChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while submitting the question",
      error: error.message,
    });
  }
};
export const createChat = async (req, res) => {
  try {
    const {
      is_public,
      receiver_id,
      creator_user,
      chat_title,
      chat_text,
      category_ids,
    } = req.body;

    const convertedCategoryIds = [
      ...category_ids,
      "64905349466874bd960c2aca",
    ].map((id) => mongoose.Types.ObjectId(id));

    const newChat = new Chat({
      is_public,
      receiver_id,
      creator_user,
      chat_title,
      chat_text,
      category_ids: convertedCategoryIds,
    });

    const savedChat = await newChat.save();

    res.send({ success: true, result: savedChat });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new chat." });
  }
};

//get private chat or create one if there is no chat
export const getPrivateChat = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    const chat = await Chat.findOne({
      is_public: false,
      $or: [
        { receiver_id: userId1, creator_user: userId2 },
        { receiver_id: userId2, creator_user: userId1 },
      ],
    });

    if (!chat) {
      const newChat = new Chat({
        is_public: false,
        receiver_id: userId1,
        creator_user: userId2,
        chat_title: null,
        chat_text: null,
        category_ids: [],
      });

      const savedChat = await newChat.save();
      return res.status(201).json({ success: true, id: savedChat._id });
    }

    return res.status(200).json({ success: true, id: chat._id });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error retrieving private messages:", error);
    res.status(500).json({ message: "Failed to retrieve private messages" });
  }
};
