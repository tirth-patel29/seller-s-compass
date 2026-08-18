import { createFileRoute } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { EmptyState } from '@/components/States'

export const Route = createFileRoute('/seller/profile')({
  component: SellerProfilePage,
})

function SellerProfilePage() {
  return (
    <SellerLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile & IEC Details</h1>
          <p className="text-sm text-muted-foreground">Manage your business information.</p>
        </div>

        <EmptyState 
          title="Profile details coming soon" 
          description="This section will allow you to update your business profile, IEC code, and AD Code."
        />
      </div>
    </SellerLayout>
  )
}
