import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false }
);

CategorySchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "categoryId",
});

const Category = model("Category", CategorySchema);

export default Category;
