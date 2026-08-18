import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrdersPage,
})

function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Orders</h1>
        <p className="text-muted-foreground">View all orders placed across the network.</p>
      </div>

      <EmptyState 
        title="All Orders" 
        description="A comprehensive list of orders will be shown here."
      />
    </div>
  )
}
