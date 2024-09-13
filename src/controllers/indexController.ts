import { Router, Request, Response, NextFunction } from 'express'

const indexController = Router()

indexController.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const basicInfo = {
      hotelName: 'Hotel Miranda',
      availableEndpoints: [
        { path: '/api/users', methods: ['GET', 'POST'] },
        { path: '/api/users/:id', methods: ['GET', 'PUT', 'DELETE'] },
        { path: '/api/login', methods: ['POST'] },
        { path: '/api/bookings', methods: ['GET', 'POST'] },
        { path: '/api/bookings/:id', methods: ['GET', 'PUT', 'DELETE'] },
        { path: '/api/contacts', methods: ['GET', 'POST'] },
        { path: '/api/contacts/:id', methods: ['GET', 'PUT', 'DELETE'] },
        { path: '/api/rooms', methods: ['GET', 'POST'] },
        { path: '/api/rooms/:id', methods: ['GET', 'PUT', 'DELETE'] },
      ],
    }

    res.json(basicInfo)
  } catch (error) {
    next(error) 
  }
})

export { indexController }
