import { logError } from "../util/logging.js";
import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, result: categories });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to get categories, try again later",
    });
  }
};
