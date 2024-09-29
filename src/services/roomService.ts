import fs from 'fs'
import path from 'path'
import { Room } from '../interfaces/roomsInterface'

const roomsFilePath = path.join(__dirname, '../data/rooms.json')

export class RoomService {

    static async fetchAll(): Promise<Room[]> {
        const data = fs.readFileSync(roomsFilePath, 'utf8')
        return JSON.parse(data) as Room[]
    }

    static async fetchOne(id: string): Promise<Room> {
        const rooms = await this.fetchAll()
        const room = rooms.find(room => room.id.toString() === id)
        if (!room) throw new Error('Room not found')
        return room
    }

    static async add(roomData: Room): Promise<Room> {
        const rooms = await this.fetchAll()
        const newRoom = { ...roomData, id: (rooms.length + 1).toString() }
        rooms.push(newRoom)
        fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2))
        return newRoom
    }

    static async update(id: string, roomData: Room): Promise<Room | null> {
        const rooms = await this.fetchAll()
        const roomIndex = rooms.findIndex(room => room.id.toString() === id)
        if (roomIndex === -1) return null

        const updatedRoom = { ...roomData, id: id.toString() }
        rooms[roomIndex] = updatedRoom
        fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2))
        return updatedRoom
    }

    static async delete(id: string): Promise<Room | null> {
        const rooms = await this.fetchAll()
        const roomIndex = rooms.findIndex(room => room.id.toString() === id)
        if (roomIndex === -1) return null

        const deletedRoom = rooms.splice(roomIndex, 1)[0]
        fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2))
        return deletedRoom
    }
}
