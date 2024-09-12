import { UserService } from "../services/userService"
import { Request, Response, NextFunction, Router } from 'express'
import { isLoggedIn } from '../middleware/auth'

export const userController = Router()

userController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const users = await UserService.fetchAll()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error })
    }
})

userController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const user = await UserService.fetchOne(id)
        if (user) {
            return res.status(200).json(user)
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching user #${id}`, error })
    }
})

userController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const userData = req.body
        const newUser = await UserService.add(userData)
        return res.status(201).json(newUser)
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new user', error })
    }
})

userController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const deletedUser = await UserService.delete(id)
        if (deletedUser) {
            return res.status(200).json(deletedUser)
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error deleting user #${id}`, error })
    }
})

userController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id 
    const userData = req.body
    try {
        const updatedUser = await UserService.update(id, userData)
        if (updatedUser) {
            return res.status(200).json(updatedUser)
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating user #${id}`, error })
    }
})
