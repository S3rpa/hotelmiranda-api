export interface UserInterface {
  id: string
  name: string
  work?: string
  schedule?: string
  photo?: string[]
  email: string
  telephone?: string
  start_date?: string
  description?: string
  state: 'ACTIVE' | 'INACTIVE'
  password: string
}