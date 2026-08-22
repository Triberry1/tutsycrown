import { Product } from './product.types'
import { Address } from './user.types'

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  PAYSTACK = 'PAYSTACK',
  STRIPE = 'STRIPE',
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string | null
  quantity: number
  price: number
  total: number
  product: Product
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  orderId: string
  provider: PaymentProvider
  providerReference?: string | null
  amount: number
  status: PaymentStatus
  paidAt?: string | null
  refundedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface ShippingMethod {
  id: string
  name: string
  description?: string | null
  cost: number
  estimatedDays?: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  shippingAddress: Address
  billingAddress?: Address | null
  shippingMethodId?: string | null
  shippingMethod?: ShippingMethod | null
  couponId?: string | null
  status: OrderStatus
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  total: number
  items: OrderItem[]
  payment?: Payment | null
  createdAt: string
  updatedAt: string
}

export interface CreateOrderInput {
  shippingAddress: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  billingAddress?: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  shippingMethodId?: string
  couponCode?: string
  paymentProvider: PaymentProvider
}

export interface OrderStatusUpdate {
  status: OrderStatus
}