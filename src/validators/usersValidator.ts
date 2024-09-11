import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

// Validador para crear un nuevo usuario
export const createUserValidator = [
  body('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  body('name').isString().withMessage('Name is required and should be a string'),
  body('work').isString().withMessage('Work is required and should be a string'),
  body('schedule').isString().withMessage('Schedule is required and should be a string'),
  body('photo').isArray({ min: 1 }).withMessage('Photo must be an array with at least one URL'),
  body('photo.*').isURL().withMessage('Each photo must be a valid URL'),
  body('email').isEmail().withMessage('Email is required and should be valid'),
  body('telephone').isString().withMessage('Telephone is required and should be a string'),
  body('start_date').isString().withMessage('Start date must be a string'),
  body('description').isString().withMessage('Description is required and should be a string'),
  body('state').isIn(['ACTIVE', 'INACTIVE']).withMessage('State must be either ACTIVE or INACTIVE'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Validador para actualizar un usuario
export const updateUserValidator = [
  body('id').optional().isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  body('name').optional().isString().withMessage('Name should be a string'),
  body('work').optional().isString().withMessage('Work should be a string'),
  body('schedule').optional().isString().withMessage('Schedule should be a string'),
  body('photo').optional().isArray({ min: 1 }).withMessage('Photo must be an array with at least one URL'),
  body('photo.*').optional().isURL().withMessage('Each photo must be a valid URL'),
  body('email').optional().isEmail().withMessage('Email should be valid'),
  body('telephone').optional().isString().withMessage('Telephone should be a string'),
  body('start_date').optional().isString().withMessage('Start date must be a string'),
  body('description').optional().isString().withMessage('Description should be a string'),
  body('state').optional().isIn(['ACTIVE', 'INACTIVE']).withMessage('State must be either ACTIVE or INACTIVE'),
  body('password').optional().isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
