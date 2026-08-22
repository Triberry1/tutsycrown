import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
})

export const updateUserSchema = userSchema.partial()

export type CreateUserInput = z.infer<typeof userSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>