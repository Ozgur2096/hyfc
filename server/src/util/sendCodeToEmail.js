import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logError, logInfo } from "./logging.js";

// environment
dotenv.config();

const SMTP_HOSTNAME = process.env.SMTP_HOSTNAME;
const MAIL_PORT = process.env.MAIL_PORT;
const MAILGUN_USER = process.env.MAILGUN_USER;
const MAILGUN_PASSWORD = process.env.MAILGUN_PASSWORD;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

export const sendCodeToEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOSTNAME,
      port: MAIL_PORT,
      auth: {
        api_key: MAILGUN_API_KEY,
        domain: MAILGUN_DOMAIN,
        user: MAILGUN_USER,
        pass: MAILGUN_PASSWORD,
      },
    });

    const code = generateRandomCode();

    await saveCode(email, code);

    const mailOptions = {
      from: MAILGUN_USER,
      to: email,
      subject: "Password Reset",
      text: `Use this code to reset your password: ${code}`,
    };

    const info = await transporter.sendMail(mailOptions);
    logInfo("Email sent: " + info.response);
  } catch (error) {
    logError("Error sending recovery code: " + error.message);
  }
};

function generateRandomCode() {
  const number = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return number;
}

async function saveCode(email, code) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    user.recovery_code = code;
    await user.save();
    logInfo("Recovery code saved to user document");
  } catch (error) {
    logError("Error saving recovery code: " + error.message);
    throw error;
  }
}
