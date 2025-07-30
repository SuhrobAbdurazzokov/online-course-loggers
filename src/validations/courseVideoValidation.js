import Joi from "joi";

class CourseVideoValidation {
  create() {
    return Joi.object({
      title: Joi.string().required(),
      video: Joi.required(),
      courseId: Joi.string().required().length(24), // kurs id si object id bolganligi uchun uzunligi 24
    });
  }
}

export default new CourseVideoValidation();
