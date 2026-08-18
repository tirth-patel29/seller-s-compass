import { createFileRoute, Link } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { OrderCard } from '@/components/cards/OrderCard'
import { EmptyState } from '@/components/States'
import { useAppState } from '@/services/db'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/seller/orders/')({
  component: SellerOrdersPage,
})

function SellerOrdersPage() {
  const state = useAppState()
  const { user } = useAuth()
  const sellerId = user?.sellerId ?? "slr-1"
  const orders = state.orders.filter(o => o.sellerId === sellerId)

  return (
    <SellerLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage your customer orders and export process.</p>
        </div>

        {orders.length === 0 ? (
          <EmptyState 
            title="No orders yet" 
            description="When customers buy your products, their orders will appear here."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} role="seller" />
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  )
}
