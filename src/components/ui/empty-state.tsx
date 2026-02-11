import { FileQuestion } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function EmptyState({
  icon,
  title = 'Chưa có dữ liệu',
  description = 'Chưa có nội dung nào để hiển thị.',
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 bg-muted/20 p-12 text-center',
        className
      )}
    >
      {icon ?? <FileQuestion className="h-14 w-14 text-muted-foreground/70" />}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
