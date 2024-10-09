import Joi from 'joi';

export const bookingSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  room_id: Joi.number().integer().required(),
  orderDate: Joi.date().iso().required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().required(),
  status: Joi.string().valid('Booked', 'Pending', 'Cancelled', 'Refund').required(),
  price: Joi.number().positive().required(),
  specialRequest: Joi.string().optional(),
}).options({ abortEarly: false });