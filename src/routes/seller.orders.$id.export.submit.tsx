import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send, CheckCircle2, Building2, Package, Globe, CreditCard, Scale } from 'lucide-react'
import { getOrderById, getExportOrderByOrderId, submitToDNK } from '@/services/mockServices'
import { useEffect, useState } from 'react'
import type { Order, ExportOrder, Shipment } from '@/lib/types'
import { ErrorState } from '@/components/shared/ErrorState'
import { toast } from 'sonner'

export const Route = createFileRoute('/seller/orders/$id/export/submit')({
  component: SubmitDNKPage,
})

function SubmitDNKPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [exportOrder, setExportOrder] = useState<ExportOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<{ exportOrder: ExportOrder, shipment: Shipment } | null>(null)

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

  if (loading) return <SellerLayout><div className="p-8 text-center animate-pulse">Loading...</div></SellerLayout>
  if (!order || !exportOrder || !exportOrder.documentsGenerated) return <SellerLayout><ErrorState description={`Documents must be generated before submission.`} /></SellerLayout>

  const handleSubmit = async () => {
    setSubmitting(true)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const result = await submitToDNK(id, "Anand DNK")
    if (result) {
      setSuccessData(result)
      toast.success("Export request submitted successfully!")
    } else {
      toast.error("Failed to submit request.")
    }
    setSubmitting(false)
  }

  return (
    <SellerLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          {!successData && (
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link to="/seller/orders/$id/export/documents" params={{ id }}><ArrowLeft className="size-5" /></Link>
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {successData ? "Export Request Created" : "Submit to DNK"}
            </h1>
            <p className="text-sm text-muted-foreground">Order #{id}</p>
          </div>
        </div>

        {successData ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
              <div className="mx-auto size-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Submission Successful</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Your export request has been securely submitted to the Dak Ghar Niryat Kendra network.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-border p-4 px-6 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Submission Details</h3>
                <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded font-bold">PROTOTYPE</span>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">DNK Reference</p>
                  <p className="font-mono font-medium text-lg">{successData.exportOrder.pbeRef}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                  <p className="font-mono font-medium text-lg text-primary">{successData.shipment.trackingId}</p>
                </div>
                
                <div className="space-y-4 col-span-2 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Status</span>
                    <span className="font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded text-sm">Submitted</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">DNK Center</span>
                    <span className="font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded text-sm">{successData.exportOrder.dnk}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Customs</span>
                    <span className="font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded text-sm">Pending</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Shipment</span>
                    <span className="font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded text-sm">Preparing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/seller/orders/$id" params={{ id }}>Return to Order</Link>
              </Button>
              <Button asChild className="flex-1 bg-slate-800 hover:bg-slate-700 text-white">
                <Link to="/seller/shipments/$id" params={{ id: successData.shipment.id }}>Track Shipment</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Order Summary</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-3 items-start">
                  <Package className="size-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Product</p>
                    <p className="text-sm text-slate-600">{order.productId}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Globe className="size-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Destination</p>
                    <p className="text-sm text-slate-600">{order.destinationCountry}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Scale className="size-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Package Weight</p>
                    <p className="text-sm text-slate-600">{exportOrder.packageInfo.weight} kg</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <CreditCard className="size-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Declared Value</p>
                    <p className="text-sm text-slate-600">₹{order.total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">DNK Selection</h2>
              
              <div className="rounded-lg border-2 border-slate-800 bg-slate-50 p-4 flex gap-4 cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  NEAREST
                </div>
                <div className="bg-white p-3 rounded-full border border-slate-200 shrink-0">
                  <Building2 className="size-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Anand DNK</h3>
                  <p className="text-sm text-slate-600">Gujarat, India</p>
                  <p className="text-xs text-success font-medium flex items-center gap-1 mt-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </span>
                    Status: Operational
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">The documents and package must be handed over at this designated Dak Ghar Niryat Kendra.</p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="bg-slate-800 hover:bg-slate-700 text-white min-w-[200px]"
              >
                {submitting ? "Submitting export request..." : (
                  <>
                    <Send className="size-4 mr-2" />
                    Submit Export Request
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  )
}
