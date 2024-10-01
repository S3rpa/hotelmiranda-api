import { Request, Response, NextFunction, Router } from 'express'
import { isLoggedIn } from '../middleware/auth'
import { RoomModel } from "../schemas/roomSchema"

const roomController = Router()

roomController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const rooms = await RoomModel.find()
        return res.status(200).json(rooms)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching rooms', error })
    }
})

roomController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const {id} = req.params
    try {
        const room = await RoomModel.findById(id)
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
        const newRoom = new RoomModel({...req.body})
        const insertedRoom = await newRoom.save()
        return res.status(201).json(insertedRoom)
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new room', error })
    }
})

roomController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const {id} = req.params
    try {
        const deletedRoom = await RoomModel.findByIdAndDelete(id)
        return res.status(200).json(deletedRoom)
    } catch (error) {
        return res.status(500).json({ message: `Error deleting room #${id}`, error })
    }
})

roomController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const {id} = req.params
    try {
        await RoomModel.updateOne({id}, req.body)
        const updatedRoom = await RoomModel.findById(id)
        return res.status(200).json(updatedRoom)
    } catch (error) {
        return res.status(500).json({ message: `Error updating room #${id}`, error })
    }
})

export { roomController }