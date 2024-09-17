import e, { Request, Response, NextFunction, Router } from 'express'
import { isLoggedIn } from '../middleware/auth'
import { UserModel } from "../schemas/userSchema"

const userController = Router()

userController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const users = await UserModel.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error })
    }
})

userController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const {id} = req.params
    try {
        const user = await UserModel.findById(id)
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
        const newUser = new UserModel({...req.body})
        const insertedUser = await newUser.save()
        return res.status(201).json(insertedUser)
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new user', error })
    }
})

userController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const {id} = req.params
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id)
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
    const {id} = req.params 
    try {
        await UserModel.updateOne({ id }, req.body)
        const updatedUser = await UserModel.findById(id)
        if (updatedUser) {
            return res.status(200).json(updatedUser)
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating user #${id}`, error })
    }
})
export { userController }

