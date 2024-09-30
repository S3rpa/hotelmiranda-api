import { Schema, model, Types } from 'mongoose';
import { BookingInterface } from '../interfaces/bookingsInterface';

const bookingSchema = new Schema<BookingInterface>({
  id: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  orderDate: { type: Date, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  specialRequest: { type: String },
});

export const BookingModel = model<BookingInterface>('Booking', bookingSchema);