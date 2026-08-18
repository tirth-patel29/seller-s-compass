import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/admin/dnk')({
  component: AdminDNKPage,
})

function AdminDNKPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dak Ghar Niryat Kendra Network</h1>
        <p className="text-muted-foreground">Manage physical post office locations acting as DNKs.</p>
      </div>

      <EmptyState 
        title="DNK Network" 
        description="A map and list of all active DNK locations."
      />
    </div>
  )
}
