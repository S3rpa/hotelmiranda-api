import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const createContactValidator = [
    body('Date').isString().withMessage('Date is required'),
    body('Customer').isString().withMessage('Customer must be a string'),
    body('Comment').isString().withMessage('Comment must be a string'),
    body('gender').isString().withMessage('Gender must be a string'),
    body('ip_address').isString().withMessage('IP address must be a string'),
    body('status').isIn(['published', 'archived']).withMessage('Status must be a valid state'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      next()
    }
]
  
  export const updateContactValidator = [
    body('Date').optional().isString(),
    body('Customer').optional().isString(),
    body('Comment').optional().isString(),
    body('gender').optional().isString(),
    body('ip_address').optional().isString(),
    body('status').optional().isIn(['published', 'archived']),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      next()
    }
  ]
  