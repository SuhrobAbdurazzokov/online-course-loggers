import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import CategoryValidation from "../validations/categoryValidation.js";
import controller from "../controllers/category.controller.js";
import { uploadFile } from "../middlewares/file-upload.js";

const router = Router();

router
    .post(
        "/",
        uploadFile.single("image"),
        validate(CategoryValidation.create),
        controller.createCategory
    )
    .get("/", controller.findAll)
    .get("/:id", controller.findById);

export default router;
