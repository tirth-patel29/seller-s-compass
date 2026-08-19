import { createFileRoute, Link } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { inr } from '@/lib/format'
import { getOrderById, getExportOrderByOrderId, generateExportDocuments } from '@/services/mockServices'
import { useEffect, useState } from 'react'
import type { Order, ExportOrder } from '@/lib/types'
import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Box, CheckCircle2 } from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'

export const Route = createFileRoute('/seller/orders/$id')({
  component: SellerOrderDetail,
})

function SellerOrderDetail() {
  const { id } = Route.useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [exportOrder, setExportOrder] = useState<ExportOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingDocs, setGeneratingDocs] = useState(false)

  useEffect(() => {
    Promise.all([
      getOrderById(id),
      getExportOrderByOrderId(id)
    ]).then(([o, eo]) => {
      setOrder(o || null)
      setExportOrder(eo || null)
      setLoading(false)
    })
  }, [id])

  const handleGenerateDocuments = async () => {
    setGeneratingDocs(true)
    const eo = await generateExportDocuments(id)
    if (eo) setExportOrder({...eo}) // trigger re-render
    setGeneratingDocs(false)
  }

  if (loading) return <SellerLayout><div className="p-8 text-center animate-pulse">Loading...</div></SellerLayout>
  if (!order) return <SellerLayout><ErrorState description={`Order ${id} not found.`} /></SellerLayout>

  return (
    <SellerLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/seller/orders"><ArrowLeft className="size-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Order #{order.id}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-slate-800">Export Readiness</h2>
              
              {!exportOrder ? (
                <div className="rounded-lg border border-border p-4 bg-secondary/50 text-sm text-muted-foreground text-center">
                  Export details not available for this order yet.
                </div>
              ) : exportOrder.documentsGenerated ? (
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">Export Documents</h3>
                      <p className="text-sm text-muted-foreground mt-1">Generated and ready for submission.</p>
                    </div>
                    <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">GENERATED</span>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-slate-700">
                    <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Commercial Invoice</p>
                    <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Package Details</p>
                    <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Export Declaration</p>
                    <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> DNK Shipment Information</p>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <Button variant="outline" asChild size="sm" className="flex-1">
                      <Link to="/seller/orders/$id/export/documents" params={{ id: order.id }}>Preview Documents</Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1 bg-slate-800 hover:bg-slate-700">
                      <Link to="/seller/orders/$id/export/submit" params={{ id: order.id }}>Continue to DNK</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800">Prepare for Export</h3>
                    {(() => {
                      const total = Object.keys(exportOrder.checklist).length;
                      const completed = Object.values(exportOrder.checklist).filter(Boolean).length;
                      const percentage = Math.round((completed / total) * 100);
                      const isReady = percentage === 100;
                      
                      return (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${isReady ? 'bg-success/15 text-success' : 'bg-amber-100 text-amber-700'}`}>
                          {isReady ? 'READY ✓' : 'INCOMPLETE'}
                        </span>
                      );
                    })()}
                  </div>
                  
                  {(() => {
                      const total = Object.keys(exportOrder.checklist).length;
                      const completed = Object.values(exportOrder.checklist).filter(Boolean).length;
                      const percentage = Math.round((completed / total) * 100);
                      const isReady = percentage === 100;
                      
                      return (
                        <>
                          <p className="text-sm text-slate-600 mb-4">
                            {isReady 
                              ? "All required export information has been completed." 
                              : "Complete the remaining export information before generating the export document package."}
                          </p>
                          
                          <div className="mb-5">
                            <div className="flex justify-between text-xs font-medium mb-1 text-slate-600">
                              <span>Progress</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div className={`h-full transition-all duration-500 ${isReady ? 'bg-success' : 'bg-amber-400'}`} style={{ width: `${percentage}%` }} />
                            </div>
                            {!isReady && <p className="text-xs text-muted-foreground mt-1 text-right">{total - completed} items remaining</p>}
                          </div>
                          
                          {isReady ? (
                            <Button 
                              size="sm" 
                              className="w-full bg-slate-800 hover:bg-slate-700" 
                              onClick={handleGenerateDocuments}
                              disabled={generatingDocs}
                            >
                              {generatingDocs ? "Generating..." : "Generate Export Documents"}
                            </Button>
                          ) : (
                            <Button asChild size="sm" className="w-full bg-slate-800 hover:bg-slate-700">
                              <Link to="/seller/orders/$id/export" params={{ id: order.id }}>Complete Export Details</Link>
                            </Button>
                          )}
                        </>
                      );
                  })()}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="flex justify-between items-center py-2">
                <div className="flex gap-4">
                  <div className="size-16 rounded-md bg-secondary/50"></div>
                  <div>
                    <p className="font-medium">Product ID: {order.productId}</p>
                    <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{order.unitPrice}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Customer</h2>
              <p className="font-medium">{order.buyerName}</p>
              <p className="text-sm text-muted-foreground">{order.buyerEmail}</p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{order.address}</p>
                <p className="text-sm font-medium mt-2">{order.destinationCountry}</p>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{inr(order.sellerAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{inr(order.shippingAmount)}</span>
                </div>
                {order.dutyAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Import Duty (DDP)</span>
                    <span>{inr(order.dutyAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fees</span>
                  <span>{inr(order.platformFee)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
                  <span>Total</span>
                  <span>{inr(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}
