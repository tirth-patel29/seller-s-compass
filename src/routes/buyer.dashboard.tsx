import { createFileRoute, Link } from '@tanstack/react-router'
import { Package, Heart, CreditCard } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/buyer/dashboard')({
  component: BuyerDashboard,
})

function BuyerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Emily</h1>
        <p className="text-muted-foreground">Manage your orders and discover new handcrafted products.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Package className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-bold text-foreground">2</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Heart className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <CreditCard className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">₹6,809</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
          <EmptyState 
            title="No recent orders" 
            description="You don't have any active orders right now." 
            actionText="Browse Marketplace"
            actionUrl="/marketplace"
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recommended for you</h2>
          <EmptyState 
            title="Recommendations" 
            description="Your personalized recommendations will appear here." 
            actionText="Explore Categories"
            actionUrl="/categories"
          />
        </div>
      </div>
    </div>
  )
}
