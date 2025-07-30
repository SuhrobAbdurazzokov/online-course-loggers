import { AppError } from "./AppError.js";

export const pageError = (req, _res, next) => {
    const errorMessage =
        req.url.split("/")[1] === "uploads"
            ? "File not found"
            : "Page not found";
    return next(new AppError(errorMessage, 404));
};
