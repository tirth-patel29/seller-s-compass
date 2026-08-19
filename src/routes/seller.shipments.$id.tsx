import { createFileRoute, Link } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, MapPin } from 'lucide-react'
import { StageTimeline, EventList } from '@/components/Timeline'
import { useEffect, useState } from 'react'
import { getShipmentByTrackingId } from '@/services/mockServices' // wait, I don't have getShipmentById in mockServices?
import { shipmentService } from '@/services/shipmentService'
import type { Shipment } from '@/lib/types'
import { ErrorState } from '@/components/shared/ErrorState'

export const Route = createFileRoute('/seller/shipments/$id')({
  component: ShipmentTrackingPage,
})

function ShipmentTrackingPage() {
  const { id } = Route.useParams()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true;
    
    const fetchTracking = async () => {
      setLoading(true);
      setError(false);
      try {
        const s = await shipmentService.getTracking(id);
        if (isMounted) setShipment(s || null);
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchTracking();
    
    return () => { isMounted = false; };
  }, [id])

  if (loading) return <SellerLayout><div className="p-8 text-center animate-pulse">Loading...</div></SellerLayout>
  if (error || !shipment) return <SellerLayout><ErrorState description={`Shipment ${id} not found.`} /></SellerLayout>

  return (
    <SellerLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/seller/shipments"><ArrowLeft className="size-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Shipment Details</h1>
            <p className="text-sm text-primary font-mono">{shipment.trackingId}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Tracking Timeline</h2>
              <div className="pl-2">
                <StageTimeline stage={shipment.stage} variant="seller" />
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
              <EventList events={shipment.events} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Order</p>
                    <Link to="/seller/orders/$id" params={{ id: shipment.orderId }} className="text-sm text-primary hover:underline">
                      #{shipment.orderId}
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Destination</p>
                    <p className="text-sm text-muted-foreground">{shipment.destination}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium">Estimated Arrival</p>
                  <p className="text-sm text-muted-foreground">{shipment.eta}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}
