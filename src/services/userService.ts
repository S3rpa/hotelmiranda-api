import fs from 'fs'
import path from 'path'
import { UserInterface } from '../interfaces/userInterface'

const usersFilePath = path.join(__dirname, '../data/user.json')

export class UserService {

    static async fetchAll(): Promise<UserInterface[]> {
        const data = fs.readFileSync(usersFilePath, 'utf8')
        return JSON.parse(data) as UserInterface[]
    }

    static async fetchOne(id: string): Promise<UserInterface> {
        const users = await this.fetchAll()
        const user = users.find(user => user.id === Number(id))
        if (!user) throw new Error('User not found')
        return user
    }

    static async add(userData: UserInterface): Promise<UserInterface> {
        const users = await this.fetchAll()
        const newUser = { ...userData, id: users.length + 1 }
        users.push(newUser)
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
        return newUser
    }

    static async update(id: string, userData: UserInterface): Promise<UserInterface | null> {
        const users = await this.fetchAll()
        const userIndex = users.findIndex(user => user.id === Number(id))
        if (userIndex === -1) return null

        const updatedUser = { ...userData, id: Number(id) }
        users[userIndex] = updatedUser
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
        return updatedUser
    }

    static async delete(id: string): Promise<UserInterface | null> {
        const users = await this.fetchAll()
        const userIndex = users.findIndex(user => user.id === Number(id))
        if (userIndex === -1) return null

        const deletedUser = users.splice(userIndex, 1)[0]
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
        return deletedUser
    }
}
