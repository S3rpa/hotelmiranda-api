import { RoomService } from "../services/roomService"
import { Request, Response, NextFunction, Router } from 'express'
import { isLoggedIn } from '../middleware/auth'

export const roomController = Router()

roomController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const rooms = await RoomService.fetchAll()
        return res.status(200).json(rooms)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching rooms', error })
    }
})

roomController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const room = await RoomService.fetchOne(id)
        if (room) {
            return res.status(200).json(room)
        } else {
            return res.status(404).json({ message: `Room with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching room #${id}`, error })
    }
})

roomController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const roomData = req.body
        const newRoom = await RoomService.add(roomData)
        return res.status(201).json(newRoom)
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new room', error })
    }
})

roomController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const deletedRoom = await RoomService.delete(id)
        if (deletedRoom) {
            return res.status(200).json(deletedRoom)
        } else {
            return res.status(404).json({ message: `Room with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error deleting room #${id}`, error })
    }
})

roomController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    const roomData = req.body
    try {
        const updatedRoom = await RoomService.update(id, roomData)
        if (updatedRoom) {
            return res.status(200).json(updatedRoom)
        } else {
            return res.status(404).json({ message: `Room with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating room #${id}`, error })
    }
})
