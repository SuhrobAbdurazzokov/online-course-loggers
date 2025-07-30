import { BaseController } from "./base.controller.js";
import Category from "../models/category.model.js";
import { AppError } from "../error/AppError.js";
import { successResponse } from "../utils/success.res.js";

class CategoryController extends BaseController {
  constructor() {
    super(Category);
  }

  async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      const existsName = await Category.findOne({ name });
      if (existsName) {
        throw new AppError("Category name already exists", 409);
      }
      const category = await Category.create({
        name,
        image: req?.file?.filename ?? "",
      });

      return successResponse(res, category, "success", 201);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
