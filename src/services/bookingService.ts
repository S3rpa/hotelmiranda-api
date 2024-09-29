import fs from 'fs'
import path from 'path'
import { BookingInterface } from '../interfaces/bookingsInterface'

const bookingsFilePath = path.join(__dirname, '../data/bookings.json')

export class BookingService {

    static async fetchAll(): Promise<BookingInterface[]> {
        const data = fs.readFileSync(bookingsFilePath, 'utf8')
        return JSON.parse(data) as BookingInterface[]
    }

    static async fetchOne(id: string): Promise<BookingInterface> {
        const bookings = await this.fetchAll()
        const booking = bookings.find(booking => booking.id.toString() === id)
        if (!booking) throw new Error('Booking not found')
        return booking
    }

    static async add(bookingData: BookingInterface): Promise<BookingInterface> {
        const bookings = await this.fetchAll();
        const newBooking = { ...bookingData, id: (bookings.length + 1).toString() };
        bookings.push(newBooking)
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
        return newBooking
    }

    static async update(id: string, bookingData: BookingInterface): Promise<BookingInterface | null> {
        const bookings = await this.fetchAll();
        const bookingIndex = bookings.findIndex(booking => booking.id.toString() === id)
        if (bookingIndex === -1) return null as BookingInterface | null

        const updatedBooking = { ...bookingData, id: id }
        bookings[bookingIndex] = updatedBooking
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
        return updatedBooking
    }


    static async delete(id: string): Promise<BookingInterface | null> {
        const bookings = await this.fetchAll()
        const bookingIndex = bookings.findIndex(booking => booking.id.toString() === id)
        if (bookingIndex === -1) return null as BookingInterface | null
    
        const deletedBooking = bookings.splice(bookingIndex, 1)[0]
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
        return deletedBooking
    }
}
