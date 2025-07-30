import Joi from "joi";

class CategoryValidation {
    create() {
        return Joi.object({
            name: Joi.string().required().min(2),
        });
    }
}

export default new CategoryValidation();
