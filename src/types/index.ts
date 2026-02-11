export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const ProductType = {
  DIGITAL: 'DIGITAL',
  PHYSICAL: 'PHYSICAL',
  POD: 'POD',
} as const
export type ProductType = (typeof ProductType)[keyof typeof ProductType]

export const ProductStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]

export const OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCEL: 'CANCEL',
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const PaymentMethod = {
  MOMO: 'MOMO',
  BANK: 'BANK',
  PAYPAL: 'PAYPAL',
} as const
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]

export const PaymentStatus = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
} as const
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  parentId: string | null
  children?: Category[]
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  productType: ProductType
  status: ProductStatus
  createdAt: string
  categoryIds?: string[]
  attributes?: Record<string, string>
  imageUrls?: string[]
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  user: User
  totalAmount: number
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
}

export interface Payment {
  id: string
  orderId: string
  method: PaymentMethod
  status: PaymentStatus
  transactionId: string
  createdAt: string
}

export interface Download {
  id: string
  user: User
  product: Product
  downloadCount: number
  downloadLimit: number
}

export type DownloadStatus = 'Available' | 'Exceeded'
