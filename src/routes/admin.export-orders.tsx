import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/admin/export-orders')({
  component: AdminExportOrdersPage,
})

function AdminExportOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Export Customs Processing</h1>
        <p className="text-muted-foreground">Review and clear customs for international shipments.</p>
      </div>

      <EmptyState 
        title="Export Orders" 
        description="A list of orders requiring customs clearance will be displayed here."
      />
    </div>
  )
}
