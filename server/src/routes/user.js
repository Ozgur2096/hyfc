import express from "express";
import {
  getUser,
  getAllUsers,
  uploadProfilePhoto,
  updateProfile,
} from "../controllers/user.js";
import requireAuth from "../middleware/requireAuth.js";

const userRouter = express.Router();

// require authorization for all routes
userRouter.use(requireAuth);
// getUserById
userRouter.get("/:id", getUser);
// getAllUsers
userRouter.get("/", getAllUsers);
// upload profile photo
userRouter.post("/:id/image", uploadProfilePhoto);
// update profile
userRouter.post("/:id/profile", updateProfile);

export default userRouter;
