import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  mockUsers,
  mockOrders,
  mockProducts,
  ordersPerDay,
  revenuePerDay,
  productTypeDistribution,
  delay,
} from '@/mocks'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { DataTable, type Column } from '@/components/data-table'
import type { Order, User } from '@/types'
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react'

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', '#94a3b8']

const KPI_ICONS = [
  { Icon: Users, label: 'Tổng người dùng', color: 'bg-blue-500/10 text-blue-600' },
  { Icon: Package, label: 'Tổng sản phẩm', color: 'bg-emerald-500/10 text-emerald-600' },
  { Icon: ShoppingCart, label: 'Tổng đơn hàng', color: 'bg-amber-500/10 text-amber-600' },
  { Icon: DollarSign, label: 'Tổng doanh thu', color: 'bg-violet-500/10 text-violet-600' },
]

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  })

  useEffect(() => {
    let cancelled = false
    delay(null).then(() => {
      if (cancelled) return
      const paidOrders = mockOrders.filter((o) => o.status === 'PAID')
      setKpis({
        users: mockUsers.length,
        products: mockProducts.length,
        orders: mockOrders.length,
        revenue: paidOrders.reduce((s, o) => s + o.totalAmount, 0),
      })
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const latestOrders = mockOrders.slice(0, 5)
  const newUsers = mockUsers.slice(0, 5)

  const orderColumns: Column<Order>[] = [
    { id: 'id', header: 'Mã đơn', cell: (r) => r.id },
    { id: 'user', header: 'Khách hàng', cell: (r) => r.user.name },
    { id: 'total', header: 'Tổng tiền', cell: (r) => formatCurrency(r.totalAmount) },
    { id: 'status', header: 'Trạng thái', cell: (r) => r.status },
    { id: 'created', header: 'Ngày tạo', cell: (r) => formatDateTime(r.createdAt) },
  ]

  const userColumns: Column<User>[] = [
    { id: 'name', header: 'Họ tên', cell: (r) => r.name },
    { id: 'email', header: 'Email', cell: (r) => r.email },
    { id: 'role', header: 'Vai trò', cell: (r) => r.role },
    { id: 'created', header: 'Tham gia', cell: (r) => formatDateTime(r.createdAt) },
  ]

  const kpiValues = [
    kpis.users,
    kpis.products,
    kpis.orders,
    formatCurrency(kpis.revenue),
  ]

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="mt-1 text-muted-foreground">Theo dõi hoạt động cửa hàng của bạn</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {KPI_ICONS.map(({ Icon, label, color }, i) => (
          <Card
            key={label}
            className="overflow-hidden transition-shadow duration-200 hover:shadow-card-hover"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <span className="text-2xl font-bold tracking-tight">{kpiValues[i]}</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Đơn hàng theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={ordersPerDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Doanh thu theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenuePerDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-card-hover lg:col-span-1">
          <CardHeader>
            <CardTitle>Phân loại theo loại sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={productTypeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {productTypeDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-card-hover lg:col-span-2">
          <CardHeader>
            <CardTitle>Đơn hàng mới nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={orderColumns}
              data={latestOrders}
              isLoading={loading}
              keyExtractor={(r) => r.id}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Người dùng mới</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={userColumns}
            data={newUsers}
            isLoading={loading}
            keyExtractor={(r) => r.id}
          />
        </CardContent>
      </Card>
    </div>
  )
}
