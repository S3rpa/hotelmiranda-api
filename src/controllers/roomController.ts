import { RoomService } from "../services/roomService"
import { Request, Response, Router } from 'express'
import { createRoomValidator, updateRoomValidator } from '../validators/roomValidator'
import { isLoggedIn } from '../middleware/auth'

export const roomController = Router()

roomController.get('', async (_, res: Response) => {
  const roomService = new RoomService()
  return res.send({ data: roomService.getAll() })
})

roomController.get('/:uuid', async (req: Request<{ uuid: number }>, res: Response) => {
  const roomService = new RoomService()
  return res.send({ data: roomService.getById(Number(req.params.uuid)) })
})

roomController.post('', isLoggedIn, createRoomValidator, async (req: Request, res: Response) => {
  const roomService = new RoomService()
  return res.status(201).send({ data: roomService.createRoom(req.body) })
})

roomController.put('/:uuid', isLoggedIn, updateRoomValidator, async (req: Request, res: Response) => {
  const roomService = new RoomService()
  const room = roomService.updateRoom(Number(req.params.uuid), req.body)
  if (room) {
    return res.send({ data: room })
  }
  return res.status(404).json({ message: 'Room not found' })
})

roomController.delete('/:uuid', isLoggedIn, async (req: Request, res: Response) => {
  const roomService = new RoomService()
  const deleted = roomService.deleteRoom(Number(req.params.uuid))
  if (deleted) {
    return res.status(204).send()
  }
  return res.status(404).json({ message: 'Room not found' })
})
