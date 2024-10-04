import { Request, Response, NextFunction, Router } from 'express';
import { isLoggedIn } from '../middleware/auth';
import pool from '../../config/db';
import { contactSchema } from '../validators/contactsValidator';

const contactController = Router();

contactController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const [contacts] = await pool.query('SELECT * FROM contacts');
        return res.status(200).json(contacts);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching contacts', error });
    }
});

contactController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    try {
        const [contact]: any = await pool.query('SELECT * FROM contacts WHERE contact_id = ?', [id]);
        if (Array.isArray(contact) && contact.length > 0) {
            return res.status(200).json(contact[0]);
        } else {
            return res.status(404).json({ message: `Contact with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching contact #${id}`, error });
    }
});

contactController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details });
    }

    const { contact_id, date, customer, comment, gender, ip_address, status } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO contacts (contact_id, date, customer, comment, gender, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [contact_id, date, customer, comment, gender, ip_address, status]
        );
        return res.status(201).json({ message: 'Contact added successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new contact', error });
    }
});

contactController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details });
    }

    const { contact_id, date, customer, comment, gender, ip_address, status } = req.body;
    try {
        const [result]: any = await pool.query(
            'UPDATE contacts SET contact_id = ?, date = ?, customer = ?, comment = ?, gender = ?, ip_address = ?, status = ? WHERE contact_id = ?', 
            [contact_id, date, customer, comment, gender, ip_address, status, id]
        );
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Contact updated successfully' });
        } else {
            return res.status(404).json({ message: `Contact with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error updating contact', error });
    }
});

export { contactController };