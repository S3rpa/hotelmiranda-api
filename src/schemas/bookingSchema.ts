import { Schema, model } from "mongoose";
import { Booking } from "../interfaces/bookingsInterface";

const bookingSchema = new Schema<Booking>({
    id: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    room: { type: Schema.Types.ObjectId, ref: "room", required: true },
    orderDate: { type: Date, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    status: { type: String, required: true, enum: ['Booked', 'Pending', 'Cancelled', 'Refund'] },
    price: { type: Number, required: true },
    specialRequest: { type: String, required: false },
})

export const BookingModel = model<Booking>("Booking", bookingSchema)