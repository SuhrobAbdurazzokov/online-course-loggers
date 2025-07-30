import { isValidObjectId } from "mongoose";
import { AppError } from "../error/AppError.js";
import { successResponse } from "../utils/success.res.js";

export class BaseController {
  constructor(model) {
    this.model = model;
  }

  create = async (req, res, next) => {
    try {
      const data = await this.model.create(req.body);
      return successResponse(res, data, "success create", 201);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_, res, next) => {
    try {
      const data = await this.model.find();
      return successResponse(res, data, "success", 200);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req, res, next) => {
    try {
      const id = req.params?.id;
      const data = await BaseController.checkById(this.model, id);
      return successResponse(res, data, "success", 200);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const id = req.params?.id;
      await BaseController.checkById(this.model, id);
      const data = await this.model.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!data) {
        throw new AppError("Not found", 404);
      }
      return successResponse(res, data, "success", 200);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const id = req.params?.id;
      await BaseController.checkById(id);
      const data = await this.model.findByIdAndDelete(id);
      if (!data) {
        throw new AppError("Not found", 404);
      }
      return successResponse(res, {}, "success remove", 200);
    } catch (error) {
      next(error);
    }
  };

  static async checkById(schema, id) {
    if (!isValidObjectId(id)) {
      throw new AppError("Invalid object id", 409);
    }

    const data = await schema.findById(id);
    if (!data) {
      throw new AppError("Not found", 404);
    }

    return data;
  }
}
