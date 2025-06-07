import Joi from 'joi';

export const registerUserShema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).min(3).max(30).required(),
  password: Joi.string().min(5).required(),
});

export const loginUserShema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).min(3).max(30).required(),
  password: Joi.string().min(5).required(),
});

export const requestResetPasswordUserShema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).min(3).max(30).required(),
});

export const resetPasswordUserShema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(5).required(),
});
