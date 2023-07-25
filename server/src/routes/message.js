import express from "express";
import { getMessagesByChatId, createMessage } from "../controllers/message.js";
import requireAuth from "../middleware/requireAuth.js";

const messageRouter = express.Router();

// require authorization for all routes
messageRouter.use(requireAuth);

// get messages by chatIds
messageRouter.get("/", getMessagesByChatId);
// create a new message
messageRouter.post("/create", createMessage);

export default messageRouter;
