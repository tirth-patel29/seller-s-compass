import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/admin/products')({
  component: AdminProductsPage,
})

function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Products Management</h1>
        <p className="text-muted-foreground">Monitor and manage all listed products across the DNK network.</p>
      </div>

      <EmptyState 
        title="Products catalog" 
        description="A list of all products will be displayed here."
      />
    </div>
  )
}
