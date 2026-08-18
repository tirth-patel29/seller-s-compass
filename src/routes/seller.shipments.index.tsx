import { createFileRoute, Link } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { EmptyState } from '@/components/shared/EmptyState'
import { useEffect, useState } from 'react'
import { getShipmentsBySeller } from '@/services/mockServices'
import { useAuth } from '@/hooks/useAuth'
import type { Shipment } from '@/lib/types'
import { Package, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/seller/shipments/')({
  component: SellerShipmentsPage,
})

function SellerShipmentsPage() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.sellerId) {
      getShipmentsBySeller(user.sellerId).then(data => {
        setShipments(data)
        setLoading(false)
      })
    }
  }, [user])

  if (loading) return <SellerLayout><div className="p-8 text-center animate-pulse">Loading...</div></SellerLayout>

  return (
    <SellerLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shipments</h1>
          <p className="text-sm text-muted-foreground">Track your packages sent via the DNK network.</p>
        </div>

        {shipments.length === 0 ? (
          <EmptyState 
            title="No active shipments" 
            description="Once you drop off your orders at a Dak Ghar Niryat Kendra, they will appear here for tracking."
          />
        ) : (
          <div className="grid gap-4">
            {shipments.map(shipment => (
              <Link 
                key={shipment.id} 
                to="/seller/shipments/$id" 
                params={{ id: shipment.id }}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Package className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground tracking-tight">{shipment.trackingId}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Order #{shipment.orderId} • {shipment.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium capitalize">{shipment.stage.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">ETA: {shipment.eta}</p>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  )
}
