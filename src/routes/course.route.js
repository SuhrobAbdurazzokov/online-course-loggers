import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { uploadFile } from "../middlewares/file-upload.js";
import CourseValidation from "../validations/courseValidation.js";
import controller from "../controllers/course.controller.js";

const router = Router();

router
    .post(
        "/",
        uploadFile.single("image"),
        validate(CourseValidation.create),
        controller.createCourse
    )
    .get("/", controller.findAll)
    .get("/:id", controller.findById);

export default router;
