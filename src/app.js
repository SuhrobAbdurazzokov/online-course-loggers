// packages
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { join } from "path";
import expressWinston from "express-winston";

// import in files
import { connectDB } from "./db/index.js";
import router from "./routes/index.route.js";
import { globalError } from "./error/global-error.js";
import logger from "./helpers/log/logger.js";

export const application = async (app) => {
    app.use(
        cors({
            origin: "*",
        })
    );

    app.use(helmet());

    app.use(express.json());

    app.use(cookieParser());

    app.use("/api/uploads", express.static(join(process.cwd(), "../uploads")));

    await connectDB();

    app.use("/api", router);

    app.use(globalError);

    app.use(
        expressWinston.errorLogger({
            winstonInstance: logger,
        })
    );
};
