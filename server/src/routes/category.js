import express from "express";
import { getCategories } from "../controllers/category.js";
import requireAuth from "../middleware/requireAuth.js";

const categoryRouter = express.Router();

// require authorization for all routes
categoryRouter.use(requireAuth);

// get all categories
categoryRouter.get("/", getCategories);

export default categoryRouter;
