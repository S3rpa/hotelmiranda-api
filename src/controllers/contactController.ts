import { ContactService } from "../services/contactService"
import { Request, Response, NextFunction, Router } from 'express'
import { isLoggedIn } from '../middleware/auth'

export const contactController = Router()

contactController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const contacts = await ContactService.fetchAll()
        return res.status(200).json(contacts)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching contacts', error })
    }
})

contactController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const contact = await ContactService.fetchOne(id)
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
        const contactData = req.body
        const newContact = await ContactService.add(contactData)
        return res.status(201).json(newContact)
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new contact', error })
    }
})

contactController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const deletedContact = await ContactService.delete(id)
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
    const id = req.params.id
    const contactData = req.body
    try {
        const updatedContact = await ContactService.update(id, contactData)
        if (updatedContact) {
            return res.status(200).json(updatedContact)
        } else {
            return res.status(404).json({ message: `Contact with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating contact #${id}`, error })
    }
})
