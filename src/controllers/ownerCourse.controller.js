import { AppError } from "../error/AppError.js";
import Owner from "../models/ownerCourse.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import { successResponse } from "../utils/success.res.js";
import { generateOtp } from "../utils/generator-otp.js";
import { sendOtpToMail } from "../utils/send-mail.js";
import redis from "../utils/Redis.js";
import config from "../config/index.js";

class OwnerCourseController extends BaseController {
    constructor() {
        super(Owner);
    }

    async createOwner(req, res, next) {
        try {
            const { phoneNumber, email, password } = req.body;
            const existsNumber = await Owner.findOne({ phoneNumber });
            if (existsNumber) {
                throw new AppError("Phone number already exists", 409);
            }

            const hashedPassword = await crypto.encrypt(password);
            delete req.body.password;
            const owner = await Owner.create({
                ...req.body,
                email,
                hashedPassword,
            });

            return successResponse(res, owner, "success", 201);
        } catch (error) {
            next(error);
        }
    }

    async forgetPassword(req, res, next) {
        try {
            const { email } = req.body;
            const owner = await Owner.findOne({ email });
            if (!owner) {
                throw new AppError("Email address not found", 404);
            }

            const otp = generateOtp();
            await redis.setData(email, otp, 300); // 5 daqiqa uchun
            sendOtpToMail(email, otp);

            return successResponse(res, {
                message: "OTP sent to your email",
                email,
                expireOTP: "5 minutes",
            });
        } catch (error) {
            next(error);
        }
    }

    async confirmOTP(req, res, next) {
        try {
            const { email, otp } = req.body;
            const checkOTP = await redis.getData(email);
            if (checkOTP !== otp) {
                throw new AppError("OTP incorrect or expired", 400);
            }

            await redis.deleteData(email);

            return successResponse(res, {
                confirmPasswordUrl: config.CONFIRM_PASSWORD_URL,
                requestMethod: "PATCH",
                email,
            });
        } catch (error) {
            next(error);
        }
    }

    async confirmPassword(req, res, next) {
        try {
            const { email, newPassword } = req.body;
            const owner = await Owner.findOne({ email });

            if (!owner) {
                throw new AppError("Email address not found", 404);
            }

            const hashedPassword = await crypto.encrypt(newPassword);
            const updatedOwner = await Owner.findByIdAndUpdate(
                owner._id,
                { hashedPassword },
                { new: true }
            );

            return successResponse(res, updatedOwner);
        } catch (error) {
            next(error);
        }
    }
}

export default new OwnerCourseController();
