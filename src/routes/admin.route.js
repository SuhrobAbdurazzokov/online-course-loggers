import { Router } from "express";
import controller from "../controllers/admin.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/role.guard.js";
import { validate } from "../middlewares/validate.js";
import AdminValidation from "../validations/AdminValidation.js";
import { requestLimit } from "../utils/request-limit.js";
import { Roles } from "../const/index.js";
import Admin from "../models/admin.model.js";

const router = Router();

router
    .post(
        "/signin",
        requestLimit(10, 3),
        validate(AdminValidation.signin),
        controller.signIn
    )
    .post("/token", controller.generateNewToken)
    .post("/signout", AuthGuard, controller.signOut)

    .patch(
        "/forget-password",
        validate(AdminValidation.forgetPassword),
        controller.forgetPassword
    )
    .patch(
        "/confirm-otp",
        validate(AdminValidation.confirmOTP),
        controller.confirmOTP
    )
    .patch(
        "/confirm-password",
        validate(AdminValidation.confirmPassword),
        controller.confirmPassword
    )

    .post(
        "/",
        AuthGuard,
        RolesGuard(Roles.SUPERADMIN),
        validate(AdminValidation.create),
        controller.createAdmin
    )
    .get("/", AuthGuard, RolesGuard(Roles.SUPERADMIN), controller.findAll)

    .patch(
        "/password/:id",
        AuthGuard,
        RolesGuard(Roles.SUPERADMIN, "ID"),
        validate(AdminValidation.update),
        controller.updateAdmin
    )

    .get(
        "/:id",
        AuthGuard,
        RolesGuard(Roles.SUPERADMIN, "ID"),
        controller.findById
    )
    .patch(
        "/:id",
        AuthGuard,
        RolesGuard(Roles.SUPERADMIN, "ID"),
        validate(AdminValidation.password),
        controller.updatePasswordForAdmin
    )
    .delete("/:id", AuthGuard, RolesGuard(Roles.SUPERADMIN), controller.delete);

export default router;
