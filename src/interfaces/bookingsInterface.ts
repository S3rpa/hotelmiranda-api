export interface Amenity {
    name: string
    isFree: boolean
    description: string
}
export interface Booking {
    id: string
    name: string
    orderDate: string
    checkIn: string
    checkOut: string
    roomType: string
    status: 'Booked' | 'Pending' | 'Cancelled' | 'Refund'
    description: string
    price: string
    amenities: Amenity[]
    specialRequest?: string
}