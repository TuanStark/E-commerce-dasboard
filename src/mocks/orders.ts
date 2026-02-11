import type { Order } from '@/types'
import { mockUsers } from './users'
import { mockProducts } from './products'

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    user: mockUsers[1],
    totalAmount: 1_250_000,
    status: 'PAID',
    createdAt: '2024-03-15T10:30:00Z',
    items: [
      { product: mockProducts[0], quantity: 1, price: 750_000 },
      { product: mockProducts[1], quantity: 1, price: 500_000 },
    ],
  },
  {
    id: 'ord-002',
    user: mockUsers[3],
    totalAmount: 375_000,
    status: 'PAID',
    createdAt: '2024-03-16T14:00:00Z',
    items: [{ product: mockProducts[3], quantity: 1, price: 375_000 }],
  },
  {
    id: 'ord-003',
    user: mockUsers[2],
    totalAmount: 750_000,
    status: 'PENDING',
    createdAt: '2024-03-17T09:15:00Z',
    items: [{ product: mockProducts[0], quantity: 1, price: 750_000 }],
  },
  {
    id: 'ord-004',
    user: mockUsers[4],
    totalAmount: 1_000_000,
    status: 'PAID',
    createdAt: '2024-03-18T16:45:00Z',
    items: [{ product: mockProducts[4], quantity: 1, price: 1_000_000 }],
  },
  {
    id: 'ord-005',
    user: mockUsers[1],
    totalAmount: 500_000,
    status: 'CANCEL',
    createdAt: '2024-03-19T11:20:00Z',
    items: [{ product: mockProducts[1], quantity: 1, price: 500_000 }],
  },
]
