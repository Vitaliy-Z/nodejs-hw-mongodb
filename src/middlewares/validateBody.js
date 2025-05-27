import createHttpError from 'http-errors';
import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9-]{10,12}$/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).min(3).max(20).optional(),
  isFavourite: Joi.boolean().optional().default(false),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(25).optional(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9-]{10,12}$/)
    .optional(),
  email: Joi.string().email({ minDomainSegments: 2 }).min(3).max(20).optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    next(createHttpError(400, err));
  }
};
