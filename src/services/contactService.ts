import fs from 'fs'
import path from 'path'
import { Contact } from '../interfaces/contactInterface'

const contactsFilePath = path.join(__dirname, '../data/contacts.json')

export class ContactService {

    static async fetchAll(): Promise<Contact[]> {
        const data = fs.readFileSync(contactsFilePath, 'utf8')
        return JSON.parse(data) as Contact[]
    }

    static async fetchOne(id: string): Promise<Contact> {
        const contacts = await this.fetchAll()
        const contact = contacts.find(contact => contact.Contact_id.toString() === id)
        if (!contact) throw new Error('Contact not found')
        return contact
    }

    static async add(contactData: Contact): Promise<Contact> {
        const contacts = await this.fetchAll()
        const newContact = { ...contactData, id: contacts.length + 1 }
        contacts.push(newContact)
        fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2))
        return newContact
    }

    static async update(id: string, contactData: Contact): Promise<Contact | null> {
        const contacts = await this.fetchAll()
        const contactIndex = contacts.findIndex(contact => contact.Contact_id.toString() === id)
        if (contactIndex === -1) return null

        const updatedContact = { ...contactData, id: Number(id) }
        contacts[contactIndex] = updatedContact
        fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2))
        return updatedContact
    }

    static async delete(id: string): Promise<Contact | null> {
        const contacts = await this.fetchAll()
        const contactIndex = contacts.findIndex(contact => contact.Contact_id.toString() === id)
        if (contactIndex === -1) return null

        const deletedContact = contacts.splice(contactIndex, 1)[0]
        fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2))
        return deletedContact
    }
}
