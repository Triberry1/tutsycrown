export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN',
} as const

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const

export const PAYMENT_PROVIDERS = {
  PAYSTACK: 'PAYSTACK',
  STRIPE: 'STRIPE',
} as const

export const COUPON_TYPES = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED',
} as const

export const REVIEW_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

export const RETURN_STATUS = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const

export const NOTIFICATION_TYPES = {
  ORDER_UPDATE: 'ORDER_UPDATE',
  PROMOTION: 'PROMOTION',
  REMINDER: 'REMINDER',
  SYSTEM: 'SYSTEM',
} as const

export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  OTHER: 'OTHER',
} as const

export const ORDER_STATUS_COLORS = {
  PENDING: '#FFA500',
  PAID: '#00BFFF',
  PROCESSING: '#FF6B6B',
  SHIPPED: '#4CAF50',
  DELIVERED: '#2E7D32',
  CANCELLED: '#9E9E9E',
  REFUNDED: '#9C27B0',
} as const

export const PAYMENT_STATUS_COLORS = {
  PENDING: '#FFA500',
  SUCCESSFUL: '#4CAF50',
  FAILED: '#F44336',
  REFUNDED: '#9C27B0',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]
export type PaymentProvider = typeof PAYMENT_PROVIDERS[keyof typeof PAYMENT_PROVIDERS]
export type CouponType = typeof COUPON_TYPES[keyof typeof COUPON_TYPES]
export type ReviewStatus = typeof REVIEW_STATUS[keyof typeof REVIEW_STATUS]
export type ReturnStatus = typeof RETURN_STATUS[keyof typeof RETURN_STATUS]
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]
export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS]