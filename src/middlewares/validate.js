import { AppError } from "../error/AppError.js";

export const validate = (schemaValid) => {
    return function (req, _res, next) {
        try {
            const schema = schemaValid();

            const { error } = schema.validate(req.body);

            if (error) {
                throw new AppError(
                    error.details[0].message || "Error on input validation",
                    422
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
