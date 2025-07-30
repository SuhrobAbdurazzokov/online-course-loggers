import { Router } from "express";
import { pageError } from "../error/page-not-found.js";
import adminRouter from "./admin.route.js";
import ownerCourseRouter from "./ownerCourse.route.js";
import categoryRouter from "./category.route.js";
import courseRouter from "./course.route.js";

const router = Router();

router
  .use("/admin", adminRouter)
  .use("/owner-course", ownerCourseRouter)
  .use("/category", categoryRouter)
  .use("/course", courseRouter)

  .use(pageError);

export default router;
