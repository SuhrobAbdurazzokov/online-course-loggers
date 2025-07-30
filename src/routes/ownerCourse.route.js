import { Router } from "express";
import controller from "../controllers/ownerCourse.controller.js";
import { validate } from "../middlewares/validate.js";
import OwnerValidation from "../validations/ownerCourseValidation.js";

const router = Router();

router
    .post("/", validate(OwnerValidation.create), controller.createOwner)
    .patch(
        "/forget-password",
        validate(OwnerValidation.forgetPassword),
        controller.forgetPassword
    )
    .patch(
        "/confirm-otp",
        validate(OwnerValidation.confirmOTP),
        controller.confirmOTP
    )
    .patch(
        "/confirm-password",
        validate(OwnerValidation.confirmPassword),
        controller.confirmPassword
    )
    .get("/", controller.findAll)
    .get("/:id", controller.findById);

export default router;
