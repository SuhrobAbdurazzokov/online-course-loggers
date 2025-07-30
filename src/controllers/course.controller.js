import { BaseController } from "./base.controller.js";
import Course from "../models/course.model.js";
import { successResponse } from "../utils/success.res.js";

class CourseController extends BaseController {
  constructor() {
    super(Course);
  }

  async createCourse(req, res, next) {
    try {
      const course = await Course.create({
        ...req.body,
        image: req?.file?.filename ?? "",
      });

      return successResponse(res, course, "success", 201);
    } catch (error) {
      next(error);
    }
  }
}

export default new CourseController();
