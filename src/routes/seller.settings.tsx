import { createFileRoute } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { EmptyState } from '@/components/States'

export const Route = createFileRoute('/seller/settings')({
  component: SellerSettingsPage,
})

function SellerSettingsPage() {
  return (
    <SellerLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account preferences and notifications.</p>
        </div>

        <EmptyState 
          title="Settings unavailable" 
          description="This feature is not yet available in the prototype."
        />
      </div>
    </SellerLayout>
  )
}
