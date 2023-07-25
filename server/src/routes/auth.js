import express from "express";
import {
  signupUser,
  loginUser,
  sendRecoveryCode,
  updateUserPassword,
  verifyCode,
} from "../controllers/auth.js";

const authRouter = express.Router();

// login route
authRouter.post("/login", loginUser);
// signup route
authRouter.post("/signup", signupUser);
//  password recovery route
authRouter.post("/recovery", sendRecoveryCode);
// code verification
authRouter.post("/verify-code", verifyCode);
// update user route
authRouter.put("/verify-code", updateUserPassword);

export default authRouter;
