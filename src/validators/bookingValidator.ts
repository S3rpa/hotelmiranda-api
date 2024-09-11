import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const createBookingValidator = [
    body('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
    body('name').isString().withMessage('Name is required and should be a string'),
    body('orderDate').isString().withMessage('Order date is required'),
    body('checkIn').isString().withMessage('Check-in date is required'),
    body('checkOut').isString().withMessage('Check-out date is required'),
    body('roomType').isString().withMessage('Room type is required'),
    body('status').isIn(['Booked', 'Pending', 'Cancelled', 'Refund']).withMessage('Status must be a valid state'),
    body('description').isString().withMessage('Description is required and should be a string'),
    body('price').isString().withMessage('Price is required and should be a string'),
    body('amenities').isArray().withMessage('Amenities must be an array'),
    body('amenities.*.name').isString().withMessage('Amenity name must be a string'),
    body('amenities.*.isFree').isBoolean().withMessage('isFree must be a boolean'),
    body('amenities.*.description').isString().withMessage('Amenity description must be a string'),
    body('specialRequest').optional().isString(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      next()
    }
]

export const updateBookingValidator = [
    body('id').optional().isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
    body('name').optional().isString().withMessage('Name should be a string'),
    body('orderDate').optional().isString(),
    body('checkIn').optional().isString(),
    body('checkOut').optional().isString(),
    body('roomType').optional().isString(),
    body('status').optional().isIn(['Booked', 'Pending', 'Cancelled', 'Refund']),
    body('description').optional().isString(),
    body('price').optional().isString(),
    body('amenities').optional().isArray(),
    body('amenities.*.name').optional().isString(),
    body('amenities.*.isFree').optional().isBoolean(),
    body('amenities.*.description').optional().isString(),
    body('specialRequest').optional().isString(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      next()
    }
]