import { createFileRoute } from '@tanstack/react-router'
import { getOrderById } from '@/services/mockServices'
import { useEffect, useState } from 'react'
import type { Order } from '@/lib/types'
import { ErrorState } from '@/components/shared/ErrorState'
import { EventList } from '@/components/Timeline'

export const Route = createFileRoute('/buyer/orders/$id')({
  component: BuyerOrderDetail,
})

function BuyerOrderDetail() {
  const { id } = Route.useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrderById(id).then(o => {
      setOrder(o || null)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="p-8 text-center animate-pulse">Loading order details...</div>
  
  if (!order) return <ErrorState description={`Order ${id} not found.`} />

  // Create mock tracking events based on status
  const events = [
    { date: "August 10", label: "Order Placed", description: "Order confirmed by seller" },
  ];
  if (order.status !== "placed") events.push({ date: "August 12", label: "DNK Processing", description: "Seller submitted package to Dak Ghar Niryat Kendra" });
  if (order.status === "customs" || order.status === "in_transit" || order.status === "delivered") events.push({ date: "August 14", label: "Customs Cleared", description: "Export customs processed" });
  if (order.status === "in_transit" || order.status === "delivered") events.push({ date: "August 16", label: "International Dispatch", description: "Package en route to destination" });
  if (order.status === "delivered") events.push({ date: "August 20", label: "Delivered", description: "Package delivered to buyer" });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Order #{order.id}</h1>
        <p className="text-muted-foreground">Order details and tracking information.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
            <EventList events={events} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <p className="text-sm font-medium">{order.buyerName}</p>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{order.address}</p>
          </div>
          
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.unitPrice * order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹{order.shipping}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
