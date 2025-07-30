import { BaseController } from "./base.controller.js";
import Admin from "../models/admin.model.js";
import crypto from "../utils/Crypto.js";
import token from "../utils/Token.js";
import config from "../config/index.js";
import { AppError } from "../error/AppError.js";
import { successResponse } from "../utils/success.res.js";
import { generateOtp } from "../utils/generator-otp.js";
import { sendOtpToMail } from "../utils/send-mail.js";
import redis from "../utils/Redis.js";

class AdminController extends BaseController {
    constructor() {
        super(Admin);
    }

    async createAdmin(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const existsAdmin = await Admin.findOne({ username });

            if (existsAdmin) {
                throw new AppError("Username already exists", 409);
            }

            const existsEmail = await Admin.findOne({ email });

            if (existsEmail) {
                throw new AppError("Email already exists", 409);
            }

            const hashedPassword = await crypto.encrypt(password);
            const admin = await Admin.create({
                username,
                email,
                hashedPassword,
            });

            return successResponse(res, admin, "Admin created", 201);
        } catch (error) {
            next(error);
        }
    }

    async signIn(req, res, next) {
        try {
            const { username, password } = req.body;
            const admin = await Admin.findOne({ username });

            if (!admin) {
                throw new AppError("Username or password incorrect", 401);
            }

            const isMatchPassword = await crypto.decrypt(
                password,
                admin.hashedPassword
            );

            if (!isMatchPassword) {
                throw new AppError("Username or password incorrect", 401);
            }

            const payload = {
                id: admin._id,
                role: admin.role,
                isActive: admin.isActive,
            };

            const accessToken = token.generateAccessToken(payload);
            const refreshToken = token.generateRefreshToken(payload);
            token.writeToCookie(res, "refreshTokenAdmin", refreshToken, 30);

            return successResponse(
                res,
                {
                    token: accessToken,
                    admin,
                },
                "success",
                200
            );
        } catch (error) {
            next(error);
        }
    }

    async generateNewToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;

            if (!refreshToken) {
                throw new AppError("Refresh token expire", 401);
            }

            const verifiedToken = token.verifyToken(
                refreshToken,
                config.TOKEN.REFRESH_TOKEN_KEY
            );

            if (!verifiedToken) {
                throw new AppError("Refresh token expire", 401);
            }

            const admin = await Admin.findById(verifiedToken?.id);

            if (!admin) {
                throw new AppError("Forbidden user", 403);
            }

            const payload = {
                id: admin._id,
                role: admin.role,
                isActive: admin.isActive,
            };

            const accessToken = token.generateAccessToken(payload);

            return successResponse(
                res,
                {
                    accessToken,
                },
                "success",
                200
            );
        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;

            if (!refreshToken) {
                throw new AppError("Refresh token expire", 401);
            }

            const verifiedToken = token.verifyToken(
                refreshToken,
                config.TOKEN.REFRESH_TOKEN_KEY
            );

            if (!verifiedToken) {
                throw new AppError("Refresh token expire", 401);
            }

            const admin = await Admin.findById(verifiedToken?.id);

            if (!admin) {
                throw new AppError("Forbidden user", 403);
            }

            res.clearCookie("refreshTokenAdmin");
            return successResponse(res, {}, "success out", 200);
        } catch (error) {
            next(error);
        }
    }

    async updateAdmin(req, res, next) {
        try {
            const id = req.params?.id;
            const admin = await BaseController.checkById(Admin, id);
            const { username, email, password } = req.body;

            if (username) {
                const exists = await Admin.findOne({ username });
                if (exists && exists._id.toString() !== id) {
                    throw new AppError("Username already exists", 409);
                }
            }

            if (email) {
                const exists = await Admin.findOne({ email });
                if (exists && exists._id.toString() !== id) {
                    throw new AppError("Email already exists", 409);
                }
            }

            let hashedPassword = admin.hashedPassword;
            if (password) {
                if (req.user?.role !== admin.role) {
                    throw new AppError(
                        "Not access to change password for admin",
                        403
                    );
                }
                hashedPassword = await crypto.encrypt(password);
                delete req.body.password;
            }

            const updatedAdmin = await Admin.findByIdAndUpdate(
                id,
                { ...req.body, hashedPassword },
                { new: true }
            );

            return successResponse(res, updatedAdmin, "Admin updated", 200);
        } catch (error) {
            next(error);
        }
    }

    async updatePasswordForAdmin(req, res, next) {
        try {
            const id = req.params?.id;
            const admin = await this.checkById(id);
            const { oldPassword, newPassword } = req.body;

            const isMatchPassword = await crypto.decrypt(
                oldPassword,
                admin.hashedPassword
            );

            if (!isMatchPassword) {
                throw new AppError("Incorrect old password", 400);
            }

            const hashedPassword = await crypto.encrypt(newPassword);
            const updatedAdmin = await Admin.findByIdAndUpdate(
                id,
                { hashedPassword },
                { new: true }
            );

            return successResponse(res, updatedAdmin, "Password updated", 200);
        } catch (error) {
            next(error);
        }
    }

    async forgetPassword(req, res, next) {
        try {
            const { email } = req.body;
            const admin = await Admin.findOne({ email });
            if (!admin) {
                throw new AppError("Not found email address", 404);
            }
            const otp = generateOtp();
            sendOtpToMail(email, otp);

            return successResponse(res, {
                message: "OTP send you to email",
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
            const admin = await Admin.findOne({ email });

            if (!admin) {
                throw new AppError("Not found email addres", 404);
            }

            const hashedPassword = await crypto.encrypt(newPassword);
            const updatedAdmin = await Admin.findByIdAndUpdate(
                admin._id,
                { hashedPassword },
                { new: true }
            );

            return successResponse(res, updatedAdmin);
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();
