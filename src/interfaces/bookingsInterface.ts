import { Types } from "mongoose";

export interface Booking {
    id: string
    user: Types.ObjectId | string
    room: Types.ObjectId | string
    orderDate: Date
    checkIn: Date
    checkOut: Date
    status: 'Booked' | 'Pending' | 'Cancelled' | 'Refund'
    price: number
    specialRequest?: string
}

