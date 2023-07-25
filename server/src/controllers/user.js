import User from "../models/User.js";
import { logError, logInfo } from "../util/logging.js";
import cloudinary from "cloudinary";

// get a user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select(
        "_id firstName lastName email role hyfClass image country date_of_birth telephone_number about_me"
      )
      .exec();

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({ success: true, result: user });
  } catch (error) {
    logError(error);
    res.status(500).json({ success: false, msg: "Unable to get user" });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, result: users });
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to get users, try again later" });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Update the user's profile with the new data
    user.country = formData.country;
    user.date_of_birth = formData.dob;
    user.telephone_number = formData.telephone;
    user.about_me = formData.about;

    await user.save();

    res.json({ success: true, msg: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Unable to update profile, try again later",
    });
  }
};

// CLOUDINARY
// upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo } = req.body;

    // Find the user by ID
    const user = await User.findById(id);

    // Use the Cloudinary SDK to upload the photo
    cloudinary.uploader.upload(photo, async (result, error) => {
      if (error) {
        logInfo("Error uploading profile photo:", error);
        return res
          .status(500)
          .json({ success: false, msg: "Failed to upload profile photo" });
      }

      // Update the user's profile photo URL with the secure URL from Cloudinary
      user.image = result.secure_url;

      // Save the updated user in the database
      await user.save();

      res.json({ success: true, msg: "Profile photo uploaded successfully" });
    });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to upload profile photo, try again later",
    });
  }
};
