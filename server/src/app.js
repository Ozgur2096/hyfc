import express from "express";
import cors from "cors";

import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import categoryRouter from "./routes/category.js";
import chatRouter from "./routes/chat.js";
import messageRouter from "./routes/message.js";

// Create an express server
const app = express();

// Tell express to use the json middleware
app.use(express.json({ limit: "50mb" })); // Set the payload limit to 50 megabytes
// Allow everyone to access our API. In a real application, we would need to restrict this!
app.use(cors());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(express.json({ limit: "50mb", extended: true }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

export default app;
