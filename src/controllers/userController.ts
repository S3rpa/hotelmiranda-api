import { UserService } from "../services/userService"
import { Request, Response, Router } from 'express'
import { createUserValidator, updateUserValidator } from '../validators/usersValidator'
import { isLoggedIn } from '../middleware/auth'

export const usersController = Router()

usersController.get('', async (_, res: Response) => {
  const userService = new UserService()
  return res.send({ data: userService.getAll() })
})

usersController.get('/:uuid', async (req: Request<{ uuid: number }>, res: Response) => {
  const userService = new UserService()
  console.log(req.params)
  return res.send({ data: userService.getById(req.params.uuid) })
})

// Rutas protegidas por autenticación

usersController.post('', isLoggedIn, createUserValidator, async (req: Request, res: Response) => {
  const userService = new UserService()
  const user = userService.createUser(req.body)
  return res.status(201).send({ data: user })
}
)

usersController.put('/:uuid', isLoggedIn, updateUserValidator, async (req: Request, res: Response) => {
  const userService = new UserService()
  const user = userService.updateUser(Number(req.params.uuid), req.body)
  if (user) {
    return res.send({ data: user })
  }
  return res.status(404).json({ message: 'User not found' })
}
)

usersController.delete('/:uuid', isLoggedIn, async (req: Request, res: Response) => {
  const userService = new UserService()
  const deleted = userService.deleteUser(Number(req.params.uuid))
  if (deleted) {
    return res.status(204).send()
  }
  return res.status(404).json({ message: 'User not found' })
}
)

usersController.get('/sort', async (_, res: Response) => {
  const userService = new UserService()
  const user = userService.sortUsersByName()
  return res.send({ data: user })
})