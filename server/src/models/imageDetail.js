import mongoose from "mongoose";

const imageDetailSchema = new mongoose.Schema(
  {
    image: String,
  },
  { collation: "imageDetail" }
);

mongoose.model("imageDetail", imageDetailSchema);

export default imageDetailSchema;
