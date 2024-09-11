import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const createRoomValidator = [
  body('room_name').isString().withMessage('Room name is required'),
  body('amenities').isString().withMessage('Amenities must be a string'),
  body('price').isString().withMessage('Price must be a string'),
  body('offer').isString().withMessage('Offer must be a string'),
  body('status').isIn(['Available', 'Booked', 'Under Maintenance']).withMessage('Status must be a valid state'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

export const updateRoomValidator = [
  body('room_name').optional().isString(),
  body('amenities').optional().isString(),
  body('price').optional().isString(),
  body('offer').optional().isString(),
  body('status').optional().isIn(['Available', 'Booked', 'Under Maintenance']),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
