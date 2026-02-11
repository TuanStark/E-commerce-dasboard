import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable, type Column } from '@/components/data-table'
import { delay, mockUsers } from '@/mocks'
import { formatDateTime } from '@/lib/utils'
import type { User } from '@/types'

export function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  useEffect(() => {
    let cancelled = false
    delay(mockUsers).then((data) => {
      if (cancelled) return
      setUsers(data)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = users.filter((u) => {
    const matchEmail = !search || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchEmail && matchRole
  })

  const handleToggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    )
  }

  const columns: Column<User>[] = [
    { id: 'name', header: 'Họ tên', cell: (r) => r.name },
    { id: 'email', header: 'Email', cell: (r) => r.email },
    {
      id: 'role',
      header: 'Vai trò',
      cell: (r) => (
        <Badge variant={r.role === 'ADMIN' ? 'default' : 'secondary'}>{r.role}</Badge>
      ),
    },
    {
      id: 'isActive',
      header: 'Kích hoạt',
      cell: (r) => (
        <Switch
          checked={r.isActive}
          onCheckedChange={() => handleToggleActive(r.id)}
        />
      ),
    },
    {
      id: 'emailVerified',
      header: 'Xác thực email',
      cell: (r) => (
        <Badge variant={r.emailVerified ? 'success' : 'secondary'}>
          {r.emailVerified ? 'Có' : 'Chưa'}
        </Badge>
      ),
    },
    { id: 'createdAt', header: 'Ngày tạo', cell: (r) => formatDateTime(r.createdAt) },
  ]

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4">
        <h1 className="text-3xl font-bold tracking-tight">Người dùng</h1>
        <p className="mt-1 text-muted-foreground">Quản lý tài khoản người dùng</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Tìm theo email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="USER">Người dùng</SelectItem>
            <SelectItem value="ADMIN">Quản trị</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-card">
        <DataTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        keyExtractor={(r) => r.id}
          emptyMessage="Không tìm thấy người dùng."
        />
      </div>
    </div>
  )
}
