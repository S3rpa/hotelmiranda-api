import { UserInterface } from '../interfaces/userInterface'
import path from 'path'
import fs from 'fs'

const usersFilePath = path.join(__dirname, '../data/users.json')

export class UserService{

    getAll(): UserInterface[]{
        const data = fs.readFileSync(usersFilePath, 'utf8')
        return JSON.parse(data) as UserInterface[]
    }

    getById(uuid: number): UserInterface | null {
        const users = this.getAll() 
        const user = users.find(user => user.id === uuid)
        return user || null
    }

    createUser(user: UserInterface): UserInterface{
        const users = this.getAll()
        const newUser = { ...user, id: users.length + 1 }
        users.push(newUser)
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
        return newUser
    }

    updateUser(uuid: number, user: UserInterface): UserInterface | null {
        const users = this.getAll()
        const userIndex = users.findIndex(user => user.id === uuid)
        if(userIndex === -1) return null
        const updatedUser = { ...user, id: uuid }
        users[userIndex] = updatedUser
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
        return updatedUser
    }

    deleteUser(uuid: number): UserInterface | null {
        const users = this.getAll()
        const userIndex = users.findIndex(user => user.id === uuid)
        if(userIndex === -1) return null
        const deletedUser = users.splice(userIndex, 1)[0]
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
        return deletedUser
    }

    sortUsersByName(): UserInterface[] {
        const users = this.getAll()
        return users.sort((a: UserInterface, b: UserInterface) => a.name.localeCompare(b.name))
    }
}