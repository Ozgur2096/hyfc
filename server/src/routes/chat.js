import express from "express";
import requireAuth from "../middleware/requireAuth.js";

import {
  getChatsByCategoryId,
  createChat,
  getPrivateChat,
} from "../controllers/chat.js";

const chatRouter = express.Router();

// require authorization for all routes
chatRouter.use(requireAuth);

// get chats(questions) by categoryIds
chatRouter.get("/", getChatsByCategoryId);
// create a new chat (question)
chatRouter.post("/create", createChat);

//get pm messages
//for now I use post because i want to pass ids in a body
chatRouter.post("/", getPrivateChat);
export default chatRouter;
