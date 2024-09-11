import fs from 'fs'
import path from 'path'
import { Booking } from '../interfaces/bookingsInterface'

const bookingsFilePath = path.join(__dirname, '../data/bookings.json')

export class BookingService {

    static async fetchAll(): Promise<Booking[]> {
        const data = fs.readFileSync(bookingsFilePath, 'utf8')
        return JSON.parse(data) as Booking[]
    }

    static async fetchOne(id: string): Promise<Booking> {
        const bookings = await this.fetchAll()
        const booking = bookings.find(booking => booking.id === Number(id))
        if (!booking) throw new Error('Booking not found')
        return booking
    }

    static async add(bookingData: Booking): Promise<Booking> {
        const bookings = await this.fetchAll();
        const newBooking = { ...bookingData, id: bookings.length + 1 };
        bookings.push(newBooking)
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
        return newBooking
    }

    static async update(id: string, bookingData: Booking): Promise<Booking> {
        const bookings = await this.fetchAll();
        const bookingIndex = bookings.findIndex(booking => booking.id === Number(id))
        if (bookingIndex === -1) return null as Booking | null

        const updatedBooking = { ...bookingData, id: Number(id) }
        bookings[bookingIndex] = updatedBooking
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
        return updatedBooking
    }


    static async delete(id: string): Promise<Booking | null> {
        const bookings = await this.fetchAll()
        const bookingIndex = bookings.findIndex(booking => booking.id === Number(id))
        if (bookingIndex === -1) return null as Booking | null
    
        const deletedBooking = bookings.splice(bookingIndex, 1)[0]
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2))
        return deletedBooking
    }
}
