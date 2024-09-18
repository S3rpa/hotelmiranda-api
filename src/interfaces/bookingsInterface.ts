import exp from "constants"

export interface Booking {
    id: string
    user: User
    room: Room
    orderDate: Date
    checkIn: Date
    checkOut: Date
    status: 'Booked' | 'Pending' | 'Cancelled' | 'Refund'
    price: number
    specialRequest?: string
}

export interface Room {
    roomType: string
    room_id: string
}

export interface User {
    firstName: string
    lastName: string
    room_id: string
}