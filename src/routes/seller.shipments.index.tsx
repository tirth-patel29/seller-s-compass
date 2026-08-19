import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { useEffect, useState, useMemo } from 'react'
import { getShipmentsBySeller, getOrdersBySeller, getProductsBySeller } from '@/services/mockServices'
import { useAuth } from '@/hooks/useAuth'
import type { Shipment, Order, Product } from '@/lib/types'
import { Package, Search, Filter, RefreshCcw, MapPin, Truck, CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StageTimeline } from '@/components/Timeline'

export const Route = createFileRoute('/seller/shipments/')({
  component: SellerShipmentsPage,
})

type EnrichedShipment = Shipment & {
  order: Order;
  product: Product | undefined;
};

function SellerShipmentsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [shipments, setShipments] = useState<EnrichedShipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('All')

  const fetchShipments = async () => {
    if (!user?.sellerId) {
      // If we don't have a user yet, just wait for hydration
      // If we confirm they are not a seller, they shouldn't be here
      return;
    }
    
    setLoading(true);
    setError(false);
    try {
      // Mock timeout for realistic loading
      await new Promise(resolve => setTimeout(resolve, 800));

      const [rawShipments, orders, products] = await Promise.all([
        getShipmentsBySeller(user.sellerId),
        getOrdersBySeller(user.sellerId),
        getProductsBySeller(user.sellerId)
      ]);

      const enriched: EnrichedShipment[] = rawShipments.map(shipment => {
        const order = orders.find(o => o.id === shipment.orderId);
        const product = products.find(p => p.id === order?.productId);
        return { ...shipment, order: order!, product };
      }).filter(s => s.order); // Ensure order exists

      setShipments(enriched);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [user]);

  const stats = useMemo(() => {
    const active = shipments.filter(s => s.stage !== 'delivered');
    const inTransit = shipments.filter(s => s.stage === 'in_transit' || s.stage === 'dispatched');
    const pendingDnk = shipments.filter(s => s.stage === 'preparing' || s.stage === 'dnk_submitted');
    const delivered = shipments.filter(s => s.stage === 'delivered');
    return {
      active: active.length,
      inTransit: inTransit.length,
      pendingDnk: pendingDnk.length,
      delivered: delivered.length
    };
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      const matchesSearch = 
        shipment.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shipment.product?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'All' || 
        (activeFilter === 'DNK Processing' && shipment.stage === 'dnk_submitted') ||
        shipment.stage.replace('_', ' ').toLowerCase() === activeFilter.toLowerCase();
        
      return matchesSearch && matchesFilter;
    });
  }, [shipments, searchQuery, activeFilter]);

  if (!user?.sellerId) return null;

  if (loading) {
    return (
      <SellerLayout>
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>)}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </SellerLayout>
    )
  }

  if (error) {
    return (
      <SellerLayout>
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Shipments</h1>
          </div>
          <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl border border-border shadow-sm text-center">
            <ErrorState description="We couldn't retrieve your shipment information." />
            <Button onClick={fetchShipments} variant="outline" className="mt-4 gap-2">
              <RefreshCcw className="size-4" /> Retry
            </Button>
          </div>
        </div>
      </SellerLayout>
    )
  }

  return (
    <SellerLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shipments</h1>
          <p className="text-sm text-muted-foreground">Track and manage your international export shipments.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Active Shipments</p>
            <p className="text-2xl font-bold mt-1 text-slate-800">{stats.active}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">In Transit</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.inTransit}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Pending DNK</p>
            <p className="text-2xl font-bold mt-1 text-amber-600">{stats.pendingDnk}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Delivered</p>
            <p className="text-2xl font-bold mt-1 text-success">{stats.delivered}</p>
          </div>
        </div>

        {shipments.length === 0 ? (
          <div className="py-12 bg-card border border-border rounded-xl shadow-sm text-center">
            <EmptyState 
              title="No shipments yet" 
              description="Your international export shipments will appear here once an order is submitted to DNK."
            />
            <Button asChild className="mt-6 bg-slate-800 hover:bg-slate-700 text-white">
              <Link to="/seller/orders">View Orders</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Search shipments..." 
                  className="pl-9 w-full bg-card"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
                {['All', 'Preparing', 'DNK Processing', 'Customs', 'Dispatched', 'In Transit', 'Delivered'].map(filter => (
                  <Button 
                    key={filter} 
                    variant={activeFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className={activeFilter === filter ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-card hover:bg-slate-100'}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Shipment Cards */}
            <div className="space-y-4">
              {filteredShipments.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
                  No shipments match your search filters.
                </div>
              ) : (
                filteredShipments.map(shipment => (
                  <div key={shipment.id} className="rounded-xl border border-border bg-card p-0 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-48 bg-slate-50 flex-shrink-0 border-b md:border-b-0 md:border-r border-border p-4 flex items-center justify-center">
                      {shipment.product?.image ? (
                        <img src={shipment.product.image} alt={shipment.product.name} className="w-32 h-32 object-cover rounded-lg shadow-sm" />
                      ) : (
                        <div className="size-32 bg-slate-200 rounded-lg flex items-center justify-center text-muted-foreground">
                          <Package className="size-8" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800 leading-tight mb-1">
                            {shipment.product?.name || `Product for Order #${shipment.orderId}`}
                          </h3>
                          <div className="text-sm text-slate-600 flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            <span><span className="font-medium text-slate-500">Order:</span> {shipment.orderId}</span>
                            <span><span className="font-medium text-slate-500">Buyer:</span> {shipment.order.buyerName}</span>
                            <span className="flex items-center gap-1"><span className="font-medium text-slate-500">Destination:</span> {shipment.destination}</span>
                          </div>
                        </div>
                        
                        <div className="md:text-right space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 self-start">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tracking ID</p>
                          <p className="font-mono font-bold text-slate-800">{shipment.trackingId}</p>
                          <p className="text-xs text-slate-500">India Post • International Export</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status:</span>
                            <span className="font-bold text-slate-800 capitalize">{shipment.stage === 'dnk_submitted' ? 'DNK Processing' : shipment.stage.replace('_', ' ')}</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Estimated delivery: <span className="font-medium">{shipment.eta}</span>
                          </p>
                        </div>
                        
                        <div className="flex gap-3 w-full md:w-auto">
                          <Button variant="outline" asChild className="flex-1 md:flex-none">
                            <Link to="/seller/orders/$id" params={{ id: shipment.orderId }}>View Order</Link>
                          </Button>
                          <Button asChild className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white">
                            <Link to="/seller/shipments/$id" params={{ id: shipment.id }}>Track Shipment</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </SellerLayout>
  )
}
