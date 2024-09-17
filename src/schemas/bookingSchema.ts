import { Schema, model, connect } from "mongoose";
import { Booking, Amenity } from "../interfaces/bookingsInterface";

const amenitySchema = new Schema<Amenity>({
    name: { type: String, required: true },
    isFree: { type: Boolean, required: true },
    description: { type: String, required: true }
})

const bookingSchema = new Schema<Booking>({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    orderDate: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    roomType: { type: String, required: true },
    status: { type: String, required: true, enum: ['Booked', 'Pending', 'Cancelled', 'Refund'] },
    description: { type: String, required: true },
    price: { type: String, required: true },
    amenities: { type: [amenitySchema], required: true },
    specialRequest: { type: String, required: false }
})

export const BookingModel = model<Booking>("Booking", bookingSchema);