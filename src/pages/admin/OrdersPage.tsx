import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTable, type Column } from '@/components/data-table'
import { delay, mockOrders, mockPayments } from '@/mocks'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { Order } from '@/types'
import { Eye } from 'lucide-react'

export function OrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    let cancelled = false
    delay(mockOrders).then((data) => {
      if (cancelled) return
      setOrders(data)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const openDetail = (order: Order) => {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  const payment = selectedOrder
    ? mockPayments.find((p) => p.orderId === selectedOrder.id)
    : null

  const statusVariant = (status: string) =>
    status === 'PAID' ? 'success' : status === 'CANCEL' ? 'destructive' : 'secondary'

  const orderStatusLabel: Record<string, string> = {
    PAID: 'Đã thanh toán',
    PENDING: 'Chờ xử lý',
    CANCEL: 'Đã hủy',
  }
  const columns: Column<Order>[] = [
    { id: 'id', header: 'Mã đơn', cell: (r) => r.id },
    { id: 'user', header: 'Khách hàng', cell: (r) => r.user.name },
    { id: 'total', header: 'Tổng tiền', cell: (r) => formatCurrency(r.totalAmount) },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (r) => (
        <Badge variant={statusVariant(r.status)}>{orderStatusLabel[r.status] ?? r.status}</Badge>
      ),
    },
    { id: 'createdAt', header: 'Ngày tạo', cell: (r) => formatDateTime(r.createdAt) },
    {
      id: 'actions',
      header: '',
      cell: (r) => (
        <Button variant="ghost" size="icon" onClick={() => openDetail(r)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
        <p className="mt-1 text-muted-foreground">Xem và quản lý đơn hàng</p>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-card">
      <DataTable
        columns={columns}
        data={orders}
        isLoading={loading}
        keyExtractor={(r) => r.id}
          emptyMessage="Chưa có đơn hàng."
        />
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Đơn hàng {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-muted-foreground">Khách hàng</h4>
                <p className="font-medium">{selectedOrder.user.name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.user.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Chi tiết đơn hàng</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Đơn giá</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="mt-2 font-medium">
                  Tổng cộng: {formatCurrency(selectedOrder.totalAmount)}
                </p>
              </div>
              {payment && (
                <div>
                  <h4 className="font-medium text-muted-foreground">Thanh toán (mẫu)</h4>
                  <p>Phương thức: {payment.method}</p>
                  <p>Trạng thái: <Badge variant={payment.status === 'SUCCESS' ? 'success' : 'destructive'}>{payment.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}</Badge></p>
                  <p className="text-sm text-muted-foreground">Mã giao dịch: {payment.transactionId}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-muted-foreground">Tải xuống</h4>
                <p className="text-sm text-muted-foreground">Mẫu: sản phẩm số có trong tài khoản khách hàng.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
