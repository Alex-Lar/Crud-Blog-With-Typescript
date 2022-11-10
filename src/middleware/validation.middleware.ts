import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

function validationMiddleware(schema: Joi.Schema): RequestHandler {

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        }

        try {
            const value = await schema.validateAsync(
                req.body,
                validationOptions
            );

            req.body = value;
            next();
        } catch (e) {
            if (e instanceof Joi.ValidationError) {
                const errors: string[] = [];
                e.details.forEach((error: Joi.ValidationErrorItem) => {
                    errors.push(error.message)
                });
                res.status(400).send({ errors })
            } else {
                console.log('Something went wrong in validate.middleware catch');
            }
        }
    }
}

export default validationMiddleware;