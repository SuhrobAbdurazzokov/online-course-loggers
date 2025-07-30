import { Schema, model } from "mongoose";

const CourseVideoSchema = new Schema(
  {
    title: { type: String, required: true }, // unikal bolmaydi sababi bir xil nomdagi 2 insoni kurs videosi bolishi mumkin
    video: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

const CourseVideo = model("CourseVideo", CourseVideoSchema);

export default CourseVideo;
