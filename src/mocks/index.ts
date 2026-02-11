export { mockUsers } from './users'
export { mockCategories, buildCategoryTree } from './categories'
export { mockProducts } from './products'
export { mockOrders } from './orders'
export { mockPayments } from './payments'
export { mockDownloads } from './downloads'
export { ordersPerDay, revenuePerDay, productTypeDistribution } from './dashboard'

const MOCK_DELAY_MS = 600

export function delay<T>(data: T, ms: number = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
