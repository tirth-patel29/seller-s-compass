import { createFileRoute } from '@tanstack/react-router'
import { getOrderById } from '@/services/mockServices'
import { shipmentService } from '@/services/shipmentService'
import { currencyService } from '@/services/currencyService'
import { useEffect, useState } from 'react'
import type { Order, Shipment } from '@/lib/types'
import { ErrorState } from '@/components/shared/ErrorState'
import { EventList, StageTimeline } from '@/components/Timeline'
import { Package } from 'lucide-react'
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferences } from "@/hooks/usePreferences";

export const Route = createFileRoute('/buyer/orders/$id')({
  component: BuyerOrderDetail,
})

function BuyerOrderDetail() {
  const { id } = Route.useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const { currency } = usePreferences()

  useEffect(() => {
    getOrderById(id).then(o => {
      setOrder(o || null)
      if (o) {
        const s = shipmentService.getByOrder(o.id)
        setShipment(s || null)
      }
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="p-8 text-center animate-pulse">Loading order details...</div>
  
  if (!order) return <ErrorState description={`Order ${id} not found.`} />

  // Create tracking events based on shipment or fallback to order status
  const events = shipment ? shipment.events : [
    { date: new Date(order.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' }), label: "Order Placed", description: "Order confirmed by seller" },
  ];
  
  if (!shipment) {
    const statusLevels = {
      placed: 0,
      export_pending: 1,
      export_ready: 2,
      dnk_submitted: 3,
      customs: 4,
      in_transit: 5,
      delivered: 6
    };
    
    const currentLevel = statusLevels[order.status as keyof typeof statusLevels] || 0;

    if (currentLevel >= 1) events.push({ date: "August 11", label: "Preparing for Export", description: "Seller is preparing international export documentation" });
    if (currentLevel >= 2) events.push({ date: "August 11", label: "Export Ready", description: "Export processing completed" });
    if (currentLevel >= 3) events.push({ date: "August 12", label: "DNK Processing", description: "Package submitted to Dak Ghar Niryat Kendra postal network" });
    if (currentLevel >= 4) events.push({ date: "August 14", label: "Customs Cleared", description: "Export customs processed" });
    if (currentLevel >= 5) events.push({ date: "August 16", label: "International Dispatch", description: "Package en route to destination" });
    if (currentLevel >= 6) events.push({ date: "August 20", label: "Delivered", description: "Package delivered to buyer" });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Order #{order.id}</h1>
          <p className="text-muted-foreground">Order details and tracking information.</p>
        </div>
        {shipment && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-right">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Tracking ID</p>
            <p className="font-mono text-lg font-bold text-slate-800">{shipment.trackingId}</p>
            <p className="text-sm font-medium capitalize text-slate-600">Status: {shipment.stage === 'dnk_submitted' ? 'DNK Processing' : shipment.stage.replace('_', ' ')}</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {shipment && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Tracking Timeline</h2>
              <div className="pl-2">
                <StageTimeline stage={shipment.stage} variant="buyer" />
              </div>
            </div>
          )}

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
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <div className="text-right">
                  <div>{currencyService.formatConvertedPrice(order.sellerAmount, currency)}</div>
                  {currency !== "INR" && <div className="text-xs text-muted-foreground">≈ ₹{order.sellerAmount}</div>}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <div className="text-right">
                  <div>{currencyService.formatConvertedPrice(order.shippingAmount, currency)}</div>
                  {currency !== "INR" && <div className="text-xs text-muted-foreground">≈ ₹{order.shippingAmount}</div>}
                </div>
              </div>
              {order.dutyAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Import Duty (DDP)</span>
                  <div className="text-right">
                    <div>{currencyService.formatConvertedPrice(order.dutyAmount, currency)}</div>
                    {currency !== "INR" && <div className="text-xs text-muted-foreground">≈ ₹{order.dutyAmount}</div>}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fees</span>
                <div className="text-right">
                  <div>{currencyService.formatConvertedPrice(order.platformFee, currency)}</div>
                  {currency !== "INR" && <div className="text-xs text-muted-foreground">≈ ₹{order.platformFee}</div>}
                </div>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border mt-2 text-base">
                <span>Total</span>
                <div className="text-right">
                  <div>{currencyService.formatConvertedPrice(order.total, currency)}</div>
                  {currency !== "INR" && <div className="text-xs font-normal text-muted-foreground mt-0.5">≈ ₹{order.total}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
