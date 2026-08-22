import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'
import { ValidationError } from '../utils/errors'

export const validate = (schema: z.ZodType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }))
        next(new ValidationError(JSON.stringify(errors)))
      } else {
        next(error)
      }
    }
  }
}