import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { DataTable, type Column } from '@/components/data-table'
import { delay, mockProducts, mockCategories } from '@/mocks'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { Product, ProductType, ProductStatus } from '@/types'
import { Pencil, Image, ListTree, Plus } from 'lucide-react'

const productFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  price: z.coerce.number().min(0),
  productType: z.enum(['DIGITAL', 'PHYSICAL', 'POD']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      price: 0,
      productType: 'DIGITAL',
      status: 'DRAFT',
    },
  })

  useEffect(() => {
    let cancelled = false
    delay(mockProducts).then((data) => {
      if (cancelled) return
      setProducts(data)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    form.reset({
      name: product.name,
      slug: product.slug,
      price: product.price,
      productType: product.productType,
      status: product.status,
    })
    setEditOpen(true)
  }

  const openCreate = () => {
    setEditingProduct(null)
    form.reset({
      name: '',
      slug: '',
      price: 0,
      productType: 'DIGITAL',
      status: 'DRAFT',
    })
    setEditOpen(true)
  }

  const onSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...p, ...values } : p
        )
      )
    } else {
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        name: values.name,
        slug: values.slug,
        price: values.price,
        productType: values.productType,
        status: values.status,
        createdAt: new Date().toISOString(),
      }
      setProducts((prev) => [newProduct, ...prev])
    }
    setEditOpen(false)
    setEditingProduct(null)
  }

  const toggleStatus = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              status: p.status === 'PUBLISHED' ? ('DRAFT' as ProductStatus) : ('PUBLISHED' as ProductStatus),
            }
          : p
      )
    )
  }

  const columns: Column<Product>[] = [
    { id: 'name', header: 'Tên', cell: (r) => r.name },
    { id: 'slug', header: 'Slug', cell: (r) => r.slug },
    { id: 'type', header: 'Loại SP', cell: (r) => r.productType },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (r) => (
        <Badge variant={r.status === 'PUBLISHED' ? 'success' : 'secondary'}>
          {r.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
        </Badge>
      ),
    },
    { id: 'price', header: 'Giá', cell: (r) => formatCurrency(r.price) },
    { id: 'createdAt', header: 'Ngày tạo', cell: (r) => formatDateTime(r.createdAt) },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStatus(r)}
          >
            {r.status === 'PUBLISHED' ? 'Gỡ xuất bản' : 'Xuất bản'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-l-4 border-primary pl-4">
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="mt-1 text-muted-foreground">Quản lý danh mục sản phẩm</p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-card">
      <DataTable
        columns={columns}
        data={products}
        isLoading={loading}
        keyExtractor={(r) => r.id}
          emptyMessage="Chưa có sản phẩm."
        />
      </div>

      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setEditingProduct(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs key={editingProduct?.id ?? 'new'} defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">Chung</TabsTrigger>
                <TabsTrigger value="assets">Tài nguyên</TabsTrigger>
                <TabsTrigger value="attributes">Thuộc tính</TabsTrigger>
                <TabsTrigger value="categories">Danh mục</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên</Label>
                  <Input id="name" {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Đường dẫn (slug)</Label>
                  <Input id="slug" {...form.register('slug')} />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Giá</Label>
                  <Input id="price" type="number" step="0.01" {...form.register('price')} />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Loại sản phẩm</Label>
                  <Select
                    value={form.watch('productType')}
                    onValueChange={(v) => form.setValue('productType', v as ProductType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIGITAL">Số hóa</SelectItem>
                      <SelectItem value="PHYSICAL">Vật lý</SelectItem>
                      <SelectItem value="POD">POD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Trạng thái</Label>
                  <Select
                    value={form.watch('status')}
                    onValueChange={(v) => form.setValue('status', v as ProductStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Bản nháp</SelectItem>
                      <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="assets" className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Image className="h-5 w-5" />
                  <span>Danh sách ảnh mẫu (placeholder)</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tải ảnh sẽ được kết nối với API sau.
                </p>
              </TabsContent>
              <TabsContent value="attributes" className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ListTree className="h-5 w-5" />
                  <span>Thuộc tính dạng key/value</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {editingProduct?.attributes
                    ? Object.entries(editingProduct.attributes ?? {}).map(([k, v]) => (
                        <span key={k} className="mr-2 rounded bg-muted px-2 py-1 text-xs">
                          {k}: {v}
                        </span>
                      ))
                    : 'Chưa có thuộc tính. Kết nối API để chỉnh sửa.'}
                </p>
              </TabsContent>
              <TabsContent value="categories" className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Danh mục: {mockCategories.map((c) => c.name).join(', ')} (chọn nhiều - mẫu)
                </p>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">{editingProduct ? 'Lưu' : 'Thêm'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
