export interface Room {
    id: string
    room_name: string
    amenities: string
    images: string[]
    price: number
    offer: string
    status: 'Available' | 'Booked' | 'Under Maintenance'
  }