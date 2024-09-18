export interface Contact {
  Contact_id: string
  Date: Date
  Customer: string
  Comment: string
  gender: string
  ip_address: string
  status?: 'published' | 'archived' | null | undefined
}