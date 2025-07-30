import Joi from "joi";

class CourseValidation {
  create() {
    return Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required().min(5),
      price: Joi.number().min(0),
      image: Joi.string().optional(),
      ownerId: Joi.string().required().length(24), // objectId 24 ta belgidan iborat
      categoryId: Joi.string().required().length(24), // buniki ham 24ta uzunlik
    });
  }
}


export default new CourseValidation();