import { Schema, model, connect } from "mongoose";
import { Room } from "../interfaces/roomsInterface";

const roomSchema = new Schema<Room>({
    id: { type: Number, required: true },
    room_name: { type: String, required: true },
    amenities: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: String, required: true },
    offer: { type: String, required: true },
    status: { type: String, required: true, enum: ['Available', 'Booked', 'Under Maintenance'] }
})

export const RoomModel = model<Room>("Room", roomSchema);