import User from "../models/User.js";
import validateUser from "../util/validateUser.js";
import { logError } from "../util/logging.js";
import { sendCodeToEmail } from "../util/sendCodeToEmail.js";
import jwt from "jsonwebtoken";
import validationErrorMessage from "../util/validationErrorMessage.js";
import { hashPassword } from "../util/password.js";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

// SIGNUP / create user
export const signupUser = async (req, res) => {
  try {
    const { user } = req.body;

    if (typeof user !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          user
        )}`,
      });

      return;
    }

    const errorList = validateUser(user);

    if (errorList.length > 0) {
      res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    } else {
      const newUser = await User.signup(user);
      // create token
      const token = createToken(newUser._id);
      // send token to client
      res.status(201).json({
        success: true,
        id: newUser._id,
        email: newUser.email,
        token,
      });
    }
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: `Unable to create user, ${error}` });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create token
    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      id: user._id,
      email,
      token,
    });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: `Unable to login user: ${error.message}` });
  }
};

// Send recovery code to email
export const sendRecoveryCode = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Send the new password to the user's email
    sendCodeToEmail(email);

    res.status(200).json({ success: true, msg: "Code sent. Check your email" });
  } catch (error) {
    logError(error);
    res.status(500).json({ success: false, msg: "Unable to request code" });
  }
};

// Update user password
export const updateUserPassword = async (req, res) => {
  const { email, code, password } = req.body;
  try {
    const user = await User.findOne({ email }).exec();

    // If the user does not exist, send an error response
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (!user.recovery_code || user.recovery_code === "") {
      return res
        .status(400)
        .json({ success: false, msg: "Recovery code was not requested" });
    }

    // If the recovery code does not match, send an error response
    if (user.recovery_code !== code) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid recovery code" });
    }

    // If the recovery code matches, update the password
    const hashedPassword = await hashPassword(password);
    await User.findOneAndUpdate(
      { email },
      {
        $set: { password: hashedPassword, recovery_code: "" },
      },
      { new: true }
    );

    // send a success response
    return res
      .status(200)
      .json({ success: true, msg: "Password successfully updated" });
  } catch (error) {
    logError(error);
    res.status(500).json({ success: false, msg: error });
  }
};

// verify code
export const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email }).exec();

  // If the user does not exist, send an error response
  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  if (!user.recovery_code || user.recovery_code === "") {
    return res
      .status(400)
      .json({ success: false, msg: "Recovery code was not requested" });
  }

  // If the recovery code does not match, send an error response
  if (user.recovery_code !== code) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid recovery code" });
  }

  // If the recovery code matches, send a success response
  return res.status(200).json({ success: true, msg: "Recovery code verified" });
};
