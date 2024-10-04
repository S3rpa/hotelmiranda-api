import { Request, Response, NextFunction, Router } from 'express';
import { isLoggedIn } from '../middleware/auth';
import pool from '../../config/db';

const contactController = Router();

// Obtener todos los contactos
contactController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const [contacts] = await pool.query('SELECT * FROM contacts');
        return res.status(200).json(contacts);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching contacts', error });
    }
});

// Obtener un contacto por ID
contactController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    try {
        const [contact] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]) as any[];
        if (contact.length > 0) {
            return res.status(200).json(contact[0]);
        } else {
            return res.status(404).json({ message: `Contact with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching contact #${id}`, error });
    }
});

// Crear un nuevo contacto
contactController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { Date, Customer, Comment, gender, ip_address, status } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO contacts (Date, Customer, Comment, gender, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)',
            [Date, Customer, Comment, gender, ip_address, status]
        );
        const insertedContact = {
            id: result.insertId,
            Date,
            Customer,
            Comment,
            gender,
            ip_address,
            status
        };
        return res.status(201).json(insertedContact);
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new contact', error });
    }
});

// Eliminar un contacto por ID
contactController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    try {
        const [result]: any = await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Contact with id ${id} deleted` });
        } else {
            return res.status(404).json({ message: `Contact with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error deleting contact #${id}`, error });
    }
});

// Actualizar un contacto por ID
contactController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { Date, Customer, Comment, gender, ip_address, status } = req.body;
    try {
        const [result]: any = await pool.query(
            'UPDATE contacts SET Date = ?, Customer = ?, Comment = ?, gender = ?, ip_address = ?, status = ? WHERE id = ?',
            [Date, Customer, Comment, gender, ip_address, status, id]
        );
        if (result.affectedRows > 0) {
            const [updatedContact] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]) as [any[], any];
            return res.status(200).json(updatedContact[0]);
        } else {
            return res.status(404).json({ message: `Contact with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating contact #${id}`, error });
    }
});

export { contactController };