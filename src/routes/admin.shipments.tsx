import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/admin/shipments')({
  component: AdminShipmentsPage,
})

function AdminShipmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Shipments Tracker</h1>
        <p className="text-muted-foreground">Monitor the status of all outgoing international shipments.</p>
      </div>

      <EmptyState 
        title="Shipments" 
        description="A list of in-transit shipments will be displayed here."
      />
    </div>
  )
}
