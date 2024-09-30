import mongoose,{ Types } from 'mongoose';
export interface Room {
  _id?: mongoose.Types.ObjectId;
  id: string;
  room_name: string;
  amenities: string;
  images: string[];
  price: number;
  offer: number;
  status: 'Available' | 'Booked' | 'Under Maintenance';
}