export interface Contact {
    Contact_id: string
    Date: string
    Customer: string
    Comment: string
    gender: string
    ip_address: string
    status?: 'published' | 'archived' | null | undefined
  }