import { Schema, model } from "mongoose";

const OwnerCourseSchema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        phoneNumber: { type: String, unique: true, required: true },
        fullName: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        password: { type: String },
        wallet: { type: Number, default: 0 },
        description: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);

OwnerCourseSchema.virtual("courses", {
    red: "Course",
    localField: "_id",
    foreignField: "ownerId",
});

const OwnerCourse = model("OwnerCourse", OwnerCourseSchema);

export default OwnerCourse;
