import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().required(),
  work: Joi.string().required(),
  schedule: Joi.string().required(),
  photo: Joi.string().uri().required(),
  email: Joi.string().email().required(),
  telephone: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  description: Joi.string().optional(),
  state: Joi.string().required(),
  password: Joi.string().min(6).required(),
}).options({ abortEarly: false });