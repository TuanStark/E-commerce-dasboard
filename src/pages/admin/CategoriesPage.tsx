import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { delay, mockCategories, buildCategoryTree } from '@/mocks'
import { ChevronRight, FolderPlus, Pencil } from 'lucide-react'
import type { Category } from '@/types'
import { cn } from '@/lib/utils'

export function CategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [tree, setTree] = useState<Category[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formName, setFormName] = useState('')
  const [formParentId, setFormParentId] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    delay(mockCategories).then((data) => {
      if (cancelled) return
      setCategories(data)
      setTree(buildCategoryTree(data))
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const openCreate = () => {
    setEditingCategory(null)
    setFormName('')
    setFormParentId('')
    setDialogOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditingCategory(cat)
    setFormName(cat.name)
    setFormParentId(cat.parentId ?? '')
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, name: formName.trim(), parentId: formParentId || null } : c
        )
      )
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          name: formName.trim(),
          parentId: formParentId || null,
        },
      ])
    }
    setDialogOpen(false)
  }

  useEffect(() => {
    setTree(buildCategoryTree(categories))
  }, [categories])

  function CategoryRow({ node, depth = 0 }: { node: Category; depth?: number }) {
    const hasChildren = node.children && node.children.length > 0
    return (
      <div className="flex flex-col">
        <div
          className={cn(
            'flex items-center gap-2 rounded-md py-2 px-2 hover:bg-muted/50',
            depth > 0 && 'ml-6'
          )}
          style={{ paddingLeft: depth * 16 + 8 }}
        >
          {hasChildren ? (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <span className="w-4" />
          )}
          <span className="font-medium">{node.name}</span>
          <div className="ml-auto flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(node)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {hasChildren &&
          node.children!.map((child) => (
            <CategoryRow key={child.id} node={child} depth={depth + 1} />
          ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-primary pl-4">
          <h1 className="text-3xl font-bold tracking-tight">Danh mục</h1>
          <p className="mt-1 text-muted-foreground">Tổ chức sản phẩm theo danh mục</p>
        </div>
        <Button onClick={openCreate}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Đang tải...</div>
        ) : tree.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Chưa có danh mục. Hãy tạo danh mục đầu tiên.
          </div>
        ) : (
          <div className="p-4">
            {tree.map((node) => (
              <CategoryRow key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cat-name">Tên</Label>
              <Input
                id="cat-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Tên danh mục"
              />
            </div>
            <div className="grid gap-2">
              <Label>Danh mục cha</Label>
              <Select value={formParentId || 'none'} onValueChange={(v) => setFormParentId(v === 'none' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Không có" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không (gốc)</SelectItem>
                  {categories
                    .filter((c) => !editingCategory || c.id !== editingCategory.id)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">{editingCategory ? 'Lưu' : 'Tạo'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
