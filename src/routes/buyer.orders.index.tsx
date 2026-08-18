import { createFileRoute } from '@tanstack/react-router'
import { OrderCard } from '@/components/cards/OrderCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { useEffect, useState } from 'react'
import type { Order } from '@/lib/types'
import { initialState } from '@/data/seed'

export const Route = createFileRoute('/buyer/orders/')({
  component: BuyerOrdersList,
})

function BuyerOrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  
  useEffect(() => {
    // Mock getting orders for buyer
    const buyerEmail = "emily@buyer.com"; // From initialState user Emily
    const buyerOrders = initialState.orders.filter(o => o.buyerEmail === buyerEmail);
    setOrders(buyerOrders);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Orders</h1>
        <p className="text-muted-foreground">View and track your global purchases.</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} role="buyer" />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No orders yet" 
          description="You haven't placed any orders. Discover authentic products from India." 
          actionText="Browse Marketplace"
          actionUrl="/marketplace"
        />
      )}
    </div>
  )
}
