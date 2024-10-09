import mongoose,{ Types } from 'mongoose';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  _id: string;
  user: User;
  orderDate: Date;
  checkIn: Date;
  checkOut: Date;
  room: mongoose.Types.ObjectId; 
  price: number;
  specialRequest?: string;
  status: string;
}