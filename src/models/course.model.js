import { Schema, model } from "mongoose";

const CourseSchema = new Schema(
    {
        title: { type: String, required: true }, // bu unikal bo'lmaydi, sababi bir necha inson bir xil nomdagi kurs ochishi mumkin
        description: { type: String, required: true },
        price: { type: Number, default: 0 }, // tekin kurs chiqazadiganlarni ham o'ylash kerak
        image: { type: String, required: true },
        ownerId: { type: Schema.Types.ObjectId, ref: "Owner" },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

CourseSchema.virtual("coursevideo", {
    ref: "CourseVideo",
    localField: "_id",
    foreignField: "courseId",
});

const Course = model("Course", CourseSchema);

export default Course;
