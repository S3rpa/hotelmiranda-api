import Joi from 'joi';

export const contactSchema = Joi.object({
  contact_id: Joi.string().uuid().required(),
  date: Joi.date().iso().required(),
  customer: Joi.string().required(),
  comment: Joi.string().required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  ip_address: Joi.string().ip().required(),
  status: Joi.string().valid('Pending', 'Resolved', 'Closed').required(),
}).options({ abortEarly: false });