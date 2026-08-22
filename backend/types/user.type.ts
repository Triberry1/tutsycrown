export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string
  clerkUserId: string
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  userId: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  addresses: Address[]
}

export interface CreateUserInput {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface UpdateUserInput {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface CreateAddressInput {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault?: boolean
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {}