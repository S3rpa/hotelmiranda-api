import mongoose,{ Types } from 'mongoose';
export interface UserInterface {
  _id?: mongoose.Types.ObjectId;
  id: string;
  name: string;
  work: string;
  schedule: string;
  photo: string[];
  email: string;
  telephone: string;
  start_date: string;
  description: string;
  state: 'ACTIVE' | 'INACTIVE';
  password: string;
}