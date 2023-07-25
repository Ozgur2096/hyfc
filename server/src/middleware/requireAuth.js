import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function requireAuth(req, res, next) {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ success: false, msg: "Authorization token required" });
  }

  // Bearer goes before token
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, msg: "Request is not authorized" });
  }
}

export default requireAuth;
