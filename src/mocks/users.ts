import type { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'u2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'u3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'USER',
    isActive: false,
    emailVerified: false,
    createdAt: '2024-02-10T09:15:00Z',
  },
  {
    id: 'u4',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-03-05T16:45:00Z',
  },
  {
    id: 'u5',
    name: 'Eve Davis',
    email: 'eve@example.com',
    role: 'USER',
    isActive: true,
    emailVerified: false,
    createdAt: '2024-03-20T11:20:00Z',
  },
]
