import type { Download } from '@/types'
import { mockUsers } from './users'
import { mockProducts } from './products'

export const mockDownloads: Download[] = [
  { id: 'dl-1', user: mockUsers[1], product: mockProducts[0], downloadCount: 2, downloadLimit: 5 },
  { id: 'dl-2', user: mockUsers[1], product: mockProducts[1], downloadCount: 1, downloadLimit: 5 },
  { id: 'dl-3', user: mockUsers[3], product: mockProducts[3], downloadCount: 5, downloadLimit: 5 },
  { id: 'dl-4', user: mockUsers[4], product: mockProducts[4], downloadCount: 3, downloadLimit: 10 },
]
