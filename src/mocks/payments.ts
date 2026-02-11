import type { Payment } from '@/types'

export const mockPayments: Payment[] = [
  { id: 'pay-1', orderId: 'ord-001', method: 'MOMO', status: 'SUCCESS', transactionId: 'MOMO-xxx-001', createdAt: '2024-03-15T10:31:00Z' },
  { id: 'pay-2', orderId: 'ord-002', method: 'BANK', status: 'SUCCESS', transactionId: 'BANK-xxx-002', createdAt: '2024-03-16T14:01:00Z' },
  { id: 'pay-3', orderId: 'ord-003', method: 'PAYPAL', status: 'FAIL', transactionId: 'PP-xxx-003', createdAt: '2024-03-17T09:16:00Z' },
  { id: 'pay-4', orderId: 'ord-004', method: 'MOMO', status: 'SUCCESS', transactionId: 'MOMO-xxx-004', createdAt: '2024-03-18T16:46:00Z' },
]
