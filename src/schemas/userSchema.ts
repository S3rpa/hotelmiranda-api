import { Schema, model } from 'mongoose';
import { UserInterface } from '../interfaces/userInterface';

const userSchema = new Schema<UserInterface>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  work: { type: String, required: true },
  schedule: { type: String, required: true },
  photo: { type: [String], required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  start_date: { type: String, required: true },
  description: { type: String, required: true },
  state: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel = model<UserInterface>('User', userSchema);