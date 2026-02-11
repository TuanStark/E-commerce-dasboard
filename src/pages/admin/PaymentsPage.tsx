import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable, type Column } from '@/components/data-table'
import { delay, mockPayments } from '@/mocks'
import { formatDateTime } from '@/lib/utils'
import type { Payment } from '@/types'

export function PaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    let cancelled = false
    delay(mockPayments).then((data) => {
      if (cancelled) return
      setPayments(data)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = payments.filter((p) => {
    const matchMethod = methodFilter === 'all' || p.method === methodFilter
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchMethod && matchStatus
  })

  const columns: Column<Payment>[] = [
    { id: 'orderId', header: 'Mã đơn', cell: (r) => r.orderId },
    { id: 'method', header: 'Phương thức', cell: (r) => r.method },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (r) => (
        <Badge variant={r.status === 'SUCCESS' ? 'success' : 'destructive'}>
          {r.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
        </Badge>
      ),
    },
    { id: 'transactionId', header: 'Mã giao dịch', cell: (r) => r.transactionId },
    { id: 'createdAt', header: 'Ngày tạo', cell: (r) => formatDateTime(r.createdAt) },
  ]

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold tracking-tight">Thanh toán</h1>
        <p className="mt-1 text-muted-foreground">Lịch sử và trạng thái thanh toán</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Phương thức" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phương thức</SelectItem>
            <SelectItem value="MOMO">MOMO</SelectItem>
            <SelectItem value="BANK">Ngân hàng</SelectItem>
            <SelectItem value="PAYPAL">PayPal</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="SUCCESS">Thành công</SelectItem>
            <SelectItem value="FAIL">Thất bại</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-card">
        <DataTable
          columns={columns}
          data={filtered}
          isLoading={loading}
          keyExtractor={(r) => r.id}
          emptyMessage="Không tìm thấy giao dịch."
        />
      </div>
    </div>
  )
}
