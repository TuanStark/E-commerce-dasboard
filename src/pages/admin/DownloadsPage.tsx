import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { DataTable, type Column } from '@/components/data-table'
import { delay, mockDownloads } from '@/mocks'
import type { Download } from '@/types'

export function DownloadsPage() {
  const [loading, setLoading] = useState(true)
  const [downloads, setDownloads] = useState<Download[]>([])

  useEffect(() => {
    let cancelled = false
    delay(mockDownloads).then((data) => {
      if (cancelled) return
      setDownloads(data)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const columns: Column<Download>[] = [
    { id: 'user', header: 'Người dùng', cell: (r) => r.user.name },
    { id: 'product', header: 'Sản phẩm', cell: (r) => r.product.name },
    { id: 'downloadCount', header: 'Số lần tải', cell: (r) => r.downloadCount },
    { id: 'downloadLimit', header: 'Giới hạn tải', cell: (r) => r.downloadLimit },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (r) => (
        <Badge
          variant={r.downloadCount >= r.downloadLimit ? 'destructive' : 'success'}
        >
          {r.downloadCount >= r.downloadLimit ? 'Vượt giới hạn' : 'Còn lượt'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold tracking-tight">Tải xuống</h1>
        <p className="mt-1 text-muted-foreground">Theo dõi lượt tải sản phẩm số</p>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-card">
        <DataTable
          columns={columns}
          data={downloads}
          isLoading={loading}
          keyExtractor={(r) => r.id}
          emptyMessage="Chưa có bản ghi tải xuống."
        />
      </div>
    </div>
  )
}
