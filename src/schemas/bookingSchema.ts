import { Schema, model, Types } from 'mongoose';
import { Booking, User } from '../interfaces/bookingsInterface';

const bookingSchema = new Schema<Booking>({
  _id: { type: String, required: true },
  user: { 
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  orderDate: { type: Date, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  specialRequest: { type: String },
});

export const BookingModel = model<Booking>('Booking', bookingSchema);