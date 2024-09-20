import mongoose,{ Types } from 'mongoose';


export interface BookingInterface {
  _id?: mongoose.Types.ObjectId;
  id: string;
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId; 
  orderDate: Date;
  checkIn: Date;
  checkOut: Date;
  status: 'Booked' | 'Pending' | 'Cancelled' | 'Refund';
  price: number;
  specialRequest?: string;
}