import Joi from "joi";

class OwnerCourseValidation {
  static passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  static phoneNumberRegex = /^\+?[1-9]\d{7,14}$/;

  create() {
    return Joi.object({
      email: Joi.string().email().required(),
      phoneNumber: Joi.string()
        .required()
        .pattern(OwnerCourseValidation.phoneNumberRegex),
      fullName: Joi.string().min(2).required(),
      isActive: Joi.boolean().optional(),
      password: Joi.string()
        .required()
        .pattern(OwnerCourseValidation.passwordRegex),
      wallet: Joi.number().min(0),
      description: Joi.string().required(),
    });
  }

  forgetPassword() {
    return Joi.object({
      email: Joi.string().email().required(),
    });
  }

  confirmOTP() {
    return Joi.object({
      email: Joi.string().required().email(),
      otp: Joi.string().length(6).required(),
    });
  }

  confirmPassword() {
    return Joi.object({
      email: Joi.string().required().email(),
      newPassword: Joi.string()
        .pattern(AdminValidator.passwordRegex)
        .required(),
    });
  }
}

export default new OwnerCourseValidation();
