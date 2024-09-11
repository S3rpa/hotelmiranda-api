import { Booking } from '../interfaces/bookingsInterface'
import path from 'path'
import fs from 'fs'

const bookingsFilePath = path.join(__dirname, '../data/bookings.json')

export class BookingService {
  getAll(): Booking[] {
    const data = fs.readFileSync(bookingsFilePath, 'utf8')
    return JSON.parse(data) as Booking[]
  }

  getById(uuid: number): Booking | null {
    const bookings = this.getAll()
    const booking = bookings.find(booking => booking.id === uuid)
    return booking || null
  }

  createBooking(booking: Booking): Booking {
    const bookings = this.getAll()
    const newBooking = { ...booking, id: bookings.length + 1 }
    bookings.push(newBooking)
    fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
    return newBooking
  }

  updateBooking(uuid: number, booking: Booking): Booking | null {
    const bookings = this.getAll()
    const bookingIndex = bookings.findIndex(booking => booking.id === uuid)
    if (bookingIndex === -1) return null
    const updatedBooking = { ...booking, id: uuid }
    bookings[bookingIndex] = updatedBooking
    fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
    return updatedBooking
  }

  deleteBooking(uuid: number): Booking | null {
    const bookings = this.getAll()
    const bookingIndex = bookings.findIndex(booking => booking.id === uuid)
    if (bookingIndex === -1) return null
    const deletedBooking = bookings.splice(bookingIndex, 1)[0]
    fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
    return deletedBooking
  }
}
