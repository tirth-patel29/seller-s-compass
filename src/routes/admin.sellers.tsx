import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/admin/sellers')({
  component: AdminSellersPage,
})

function AdminSellersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sellers Management</h1>
        <p className="text-muted-foreground">Manage and verify registered sellers.</p>
      </div>

      <EmptyState 
        title="Sellers list" 
        description="A table of all sellers will be displayed here."
      />
    </div>
  )
}
