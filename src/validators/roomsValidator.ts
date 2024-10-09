import Joi from 'joi';

export const roomSchema = Joi.object({
  room_name: Joi.string().required(),
  amenities: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()).required(),
  price: Joi.number().positive().required(),
  offer: Joi.number().min(0).required(),
  status: Joi.string().valid('Available', 'Booked', 'Under Maintenance').required(),
}).options({ abortEarly: false });