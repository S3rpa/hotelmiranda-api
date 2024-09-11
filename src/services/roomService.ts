import { Room } from '../interfaces/roomsInterface'
import path from 'path'
import fs from 'fs'

const roomsFilePath = path.join(__dirname, '../data/rooms.json')

export class RoomService {
  getAll(): Room[] {
    const data = fs.readFileSync(roomsFilePath, 'utf8')
    return JSON.parse(data) as Room[]
  }

  getById(uuid: number): Room | null {
    const rooms = this.getAll()
    const room = rooms.find(room => room.id === uuid)
    return room || null
  }

  createRoom(room: Room): Room {
    const rooms = this.getAll()
    const newRoom = { ...room, id: rooms.length + 1 }
    rooms.push(newRoom)
    fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2))
    return newRoom
  }

  updateRoom(uuid: number, room: Room): Room | null {
    const rooms = this.getAll()
    const roomIndex = rooms.findIndex(room => room.id === uuid)
    if (roomIndex === -1) return null
    const updatedRoom = { ...room, id: uuid }
    rooms[roomIndex] = updatedRoom
    fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2))
    return updatedRoom
  }

  deleteRoom(uuid: number): Room | null {
    const rooms = this.getAll()
    const roomIndex = rooms.findIndex(room => room.id === uuid)
    if (roomIndex === -1) return null
    const deletedRoom = rooms.splice(roomIndex, 1)[0]
    fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2))
    return deletedRoom
  }
}
