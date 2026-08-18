import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/buyer/settings')({
  component: BuyerSettings,
})

function BuyerSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Preferences</h1>
        <p className="text-muted-foreground">Manage notifications and account preferences.</p>
      </div>
      
      <EmptyState 
        title="Settings unavailable" 
        description="We are currently building this feature. Check back soon." 
      />
    </div>
  )
}
