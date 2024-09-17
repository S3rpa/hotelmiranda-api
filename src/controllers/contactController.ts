import { Request, Response, NextFunction, Router } from 'express'
import { isLoggedIn } from '../middleware/auth'
import { ContactModel } from "../schemas/contactSchema"

const contactController = Router()

contactController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const contacts = await ContactModel.find()
        return res.status(200).json(contacts)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching contacts', error })
    }
})

contactController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const {id} = req.params
    try {
        const contact = await ContactModel.findById(id)
        if (contact) {
            return res.status(200).json(contact)
        } else {
            return res.status(404).json({ message: `Contact with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching contact #${id}`, error })
    }
})

contactController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const newContact = new ContactModel({...req.body})
        const insertedContact = await newContact.save()
        return res.status(201).json(insertedContact)
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new contact', error })
    }
})

contactController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const {id} = req.params
    try {
        const deletedContact = await ContactModel.findByIdAndDelete(id)
        if (deletedContact) {
            return res.status(200).json(deletedContact)
        } else {
            return res.status(404).json({ message: `Contact with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error deleting contact #${id}`, error })
    }
})

contactController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const {id} = req.params
    try {
        await ContactModel.updateOne({ id }, req.body)
        const updatedContact = await ContactModel.findById(id)
        return res.status(200).json(updatedContact)
    } catch (error) {
        return res.status(500).json({ message: `Error updating contact #${id}`, error })
    }
})

export { contactController }
