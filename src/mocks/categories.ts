import type { Category } from '@/types'

export const mockCategories: Category[] = [
  { id: 'c1', name: 'Templates', parentId: null },
  { id: 'c2', name: 'Graphics', parentId: null },
  { id: 'c3', name: 'Fonts', parentId: null },
  { id: 'c4', name: 'Notion Templates', parentId: 'c1' },
  { id: 'c5', name: 'Figma', parentId: 'c1' },
  { id: 'c6', name: 'Icons', parentId: 'c2' },
  { id: 'c7', name: 'Illustrations', parentId: 'c2' },
]

export function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>()
  categories.forEach((c) => map.set(c.id, { ...c, children: [] }))
  const roots: Category[] = []
  map.forEach((cat) => {
    if (!cat.parentId) {
      roots.push(cat)
    } else {
      const parent = map.get(cat.parentId)
      if (parent) {
        parent.children = parent.children ?? []
        parent.children.push(cat)
      } else {
        roots.push(cat)
      }
    }
  })
  return roots
}
