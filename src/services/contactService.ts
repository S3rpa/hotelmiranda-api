import { Contact } from '../interfaces/contactInterface'
import path from 'path'
import fs from 'fs'

const contactsFilePath = path.join(__dirname, '../data/contacts.json')

export class ContactService {
  getAll(): Contact[] {
    const data = fs.readFileSync(contactsFilePath, 'utf8')
    return JSON.parse(data) as Contact[]
  }

  getById(uuid: number): Contact | null {
    const contacts = this.getAll()
    const contact = contacts.find(contact => contact.Contact_id === uuid)
    return contact || null
  }

  createContact(contact: Contact): Contact {
    const contacts = this.getAll()
    const newContact = { ...contact, id: contacts.length + 1 }
    contacts.push(newContact)
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2))
    return newContact
  }

  updateContact(uuid: number, contact: Contact): Contact | null {
    const contacts = this.getAll()
    const contactIndex = contacts.findIndex(contact => contact.Contact_id === uuid)
    if (contactIndex === -1) return null
    const updatedContact = { ...contact, id: uuid }
    contacts[contactIndex] = updatedContact
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2))
    return updatedContact
  }

  deleteContact(uuid: number): Contact | null {
    const contacts = this.getAll()
    const contactIndex = contacts.findIndex(contact => contact.Contact_id === uuid)
    if (contactIndex === -1) return null
    const deletedContact = contacts.splice(contactIndex, 1)[0]
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2))
    return deletedContact
  }
}
