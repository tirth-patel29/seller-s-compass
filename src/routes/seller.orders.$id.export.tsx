import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'
import { getOrderById, getExportOrderByOrderId, updateExportChecklist } from '@/services/mockServices'
import { useEffect, useState } from 'react'
import type { Order, ExportOrder, ChecklistKey } from '@/lib/types'
import { ErrorState } from '@/components/shared/ErrorState'

export const Route = createFileRoute('/seller/orders/$id/export')({
  component: ExportReadinessPage,
})

const CHECKLIST_SECTIONS: { id: ChecklistKey, label: string, items: string[] }[] = [
  { id: "seller", label: "Seller Information", items: ["Seller name", "Contact information", "Seller location"] },
  { id: "product", label: "Product Information", items: ["Product name", "Category", "Quantity", "Product value", "Country of origin"] },
  { id: "packageInfo", label: "Package Information", items: ["Weight", "Length", "Width", "Height"] },
  { id: "destination", label: "Destination", items: ["Buyer country", "Shipping address"] },
  { id: "exportInfo", label: "Export Information", items: ["Required declarations", "Export-related information"] },
]

function ExportReadinessPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [exportOrder, setExportOrder] = useState<ExportOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getOrderById(id),
      getExportOrderByOrderId(id)
    ]).then(([o, eo]) => {
      setOrder(o || null)
      setExportOrder(eo ? {...eo} : null)
      setLoading(false)
    })
  }, [id])

  if (loading) return <SellerLayout><div className="p-8 text-center animate-pulse">Loading...</div></SellerLayout>
  if (!order || !exportOrder) return <SellerLayout><ErrorState description={`Export details not found.`} /></SellerLayout>

  const total = Object.keys(exportOrder.checklist).filter(k => CHECKLIST_SECTIONS.some(s => s.id === k)).length;
  const completed = Object.entries(exportOrder.checklist).filter(([k, v]) => CHECKLIST_SECTIONS.some(s => s.id === k) && v).length;
  const percentage = Math.round((completed / total) * 100);
  const isReady = percentage === 100;

  const toggleSection = async (sectionId: ChecklistKey) => {
    const currentStatus = exportOrder.checklist[sectionId];
    const eo = await updateExportChecklist(id, { [sectionId]: !currentStatus } as Record<ChecklistKey, boolean>);
    if (eo) {
      setExportOrder({ ...eo });
    }
  }

  return (
    <SellerLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/seller/orders/$id" params={{ id }}><ArrowLeft className="size-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Export Checklist</h1>
            <p className="text-sm text-muted-foreground">Order #{id}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Required Information</h2>
            <div className="text-right">
              <span className="text-sm text-slate-600 font-medium">Progress: {percentage}%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {CHECKLIST_SECTIONS.map((section) => {
              const isComplete = exportOrder.checklist[section.id]
              return (
                <div key={section.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-slate-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 flex items-center gap-2">
                      {section.label}
                      <span className="text-sm font-normal">
                        {isComplete ? <span className="text-success flex items-center gap-1">✓</span> : <span className="text-amber-500 flex items-center gap-1">⚠</span>}
                      </span>
                    </h3>
                    <ul className="text-sm text-slate-500 mt-2 list-disc list-inside">
                      {section.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <Button 
                      variant={isComplete ? "outline" : "default"} 
                      size="sm" 
                      onClick={() => toggleSection(section.id)}
                      className={!isComplete ? "bg-slate-800 hover:bg-slate-700" : ""}
                    >
                      {isComplete ? "Edit" : "Complete Section"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            {isReady ? (
              <div className="flex items-center justify-between bg-success/10 p-4 rounded-lg border border-success/20">
                <div className="flex items-center gap-3 text-success font-medium">
                  <CheckCircle2 className="size-5" />
                  All requirements met!
                </div>
                <Button asChild className="bg-success hover:bg-success/90 text-white">
                  <Link to="/seller/orders/$id" params={{ id }}>Return to Order</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 font-medium">
                  <AlertTriangle className="size-5" />
                  Please complete all sections to proceed.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}
