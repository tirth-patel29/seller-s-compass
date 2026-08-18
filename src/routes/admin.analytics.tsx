import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/admin/analytics')({
  component: AdminAnalyticsPage,
})

function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Network Analytics</h1>
        <p className="text-muted-foreground">Deep dive into export performance, revenue, and geographical distribution.</p>
      </div>

      <EmptyState 
        title="Analytics Dashboard" 
        description="Charts and detailed reports will appear here."
      />
    </div>
  )
}
