import { Schema, model, connect } from "mongoose";
import { Contact } from "../interfaces/contactInterface";

const contactSchema = new Schema<Contact>({
  Contact_id: { type: String , required: true },
  Date: { type: Date, required: true },
  Customer: { type: String, required: true },
  Comment: { type: String, required: true },
  gender: { type: String, required: true },
  ip_address: { type: String, required: true },
  status: { type: String, required: false, enum: ["published", "archived"] },
})

export const ContactModel = model<Contact>("Contact", contactSchema)
