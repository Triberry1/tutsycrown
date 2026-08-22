import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')

export const phoneSchema = z.string()
  .regex(/^(\+?234|0)[7-9][0-1]\d{8}$/, 'Invalid phone number format')

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
})

export const userSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: phoneSchema.optional(),
})

export const updateUserSchema = userSchema.partial()

export const createAddressSchema = addressSchema.extend({
  isDefault: z.boolean().optional(),
})

export const updateAddressSchema = createAddressSchema.partial()

export type UserValidation = z.infer<typeof userSchema>
export type UpdateUserValidation = z.infer<typeof updateUserSchema>
export type AddressValidation = z.infer<typeof addressSchema>
export type CreateAddressValidation = z.infer<typeof createAddressSchema>