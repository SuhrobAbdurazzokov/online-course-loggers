import Joi from "joi";

class AdminValidator {
  static passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  create(data) {
    return Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(AdminValidator.passwordRegex).required(),
    });
  }

  signin(data) {
    return Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
  }
  update(data) {
    return Joi.object({
      username: Joi.string().optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().pattern(AdminValidator.passwordRegex).optional(),
    });
  }

  password() {
    return Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string()
        .pattern(AdminValidator.passwordRegex)
        .required(),
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

export default new AdminValidator();
