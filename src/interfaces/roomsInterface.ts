export interface Room {
    id: number
    room_name: string
    amenities: string
    images: string[]
    price: string
    offer: string
    status: 'Available' | 'Booked' | 'Under Maintenance'
  }