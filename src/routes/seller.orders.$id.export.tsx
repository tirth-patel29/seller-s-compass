import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, AlertTriangle, Save } from 'lucide-react'
import { getOrderById, getExportOrderByOrderId, updateExportDetails, generateExportDocuments } from '@/services/mockServices'
import { useEffect, useState } from 'react'
import type { Order, ExportOrder, ChecklistKey } from '@/lib/types'
import { ErrorState } from '@/components/shared/ErrorState'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/seller/orders/$id/export')({
  component: ExportReadinessPage,
})

function ExportReadinessPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [exportOrder, setExportOrder] = useState<ExportOrder | null>(null)
  const [loading, setLoading] = useState(true)

  // Local form state for dimensions/export info
  const [packageInfo, setPackageInfo] = useState({ length: '', width: '', height: '', weight: '' })
  const [exportInfo, setExportInfo] = useState({ hsCode: '', declaredValue: '', purpose: 'Commercial' })

  useEffect(() => {
    Promise.all([
      getOrderById(id),
      getExportOrderByOrderId(id)
    ]).then(([o, eo]) => {
      setOrder(o || null)
      if (eo) {
        setExportOrder({...eo})
        setPackageInfo({
          length: eo.packageInfo?.length || '',
          width: eo.packageInfo?.width || '',
          height: eo.packageInfo?.height || '',
          weight: eo.packageInfo?.weight || '',
        })
        setExportInfo({
          hsCode: eo.exportInfo?.hsCode || '',
          declaredValue: eo.exportInfo?.declaredValue || '',
          purpose: eo.exportInfo?.purpose || 'Commercial',
        })
      }
      setLoading(false)
    })
  }, [id])

  if (loading) return <SellerLayout><div className="p-8 text-center animate-pulse">Loading...</div></SellerLayout>
  if (!order || !exportOrder) return <SellerLayout><ErrorState description={`Export details not found.`} /></SellerLayout>

  const total = 5; // 5 checklist sections
  const completed = Object.entries(exportOrder.checklist).filter(([k, v]) => ["seller", "product", "packageInfo", "destination", "exportInfo"].includes(k) && v).length;
  const percentage = Math.round((completed / total) * 100);
  const isReady = percentage === 100;

  const handleSaveSection = async (sectionId: ChecklistKey, data?: any) => {
    const updates: Partial<ExportOrder> = { checklist: { ...exportOrder.checklist, [sectionId]: true } };
    
    if (sectionId === 'packageInfo' && data) {
      updates.packageInfo = data;
    }
    if (sectionId === 'exportInfo' && data) {
      updates.exportInfo = data;
    }

    const eo = await updateExportDetails(id, updates);
    if (eo) setExportOrder({ ...eo });
  }

  return (
    <SellerLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/seller/orders/$id" params={{ id }}><ArrowLeft className="size-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Complete Export Details</h1>
            <p className="text-sm text-muted-foreground">Complete the required information to prepare this order for export.</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Export Information</h2>
            <div className="text-right">
              <span className="text-sm text-slate-600 font-medium">Progress: {percentage}%</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-slate-800 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {/* SECTION 1: SELLER INFO */}
            <AccordionItem value="seller" className="border border-border rounded-lg bg-slate-50 px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium text-slate-800">Section 1 — Seller Information</span>
                  {exportOrder.checklist.seller ? <span className="text-success text-sm flex items-center gap-1">✓ Complete</span> : <span className="text-amber-500 text-sm flex items-center gap-1">⚠ Incomplete</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label>Business Name</Label>
                    <Input disabled value="Meena Handicrafts" className="mt-1 bg-slate-100" />
                  </div>
                  <div>
                    <Label>Contact Name</Label>
                    <Input disabled value="Meena Patel" className="mt-1 bg-slate-100" />
                  </div>
                  <div className="col-span-2">
                    <Label>Location</Label>
                    <Input disabled value="Kutch, Gujarat, India" className="mt-1 bg-slate-100" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleSaveSection('seller')} className="bg-slate-800 hover:bg-slate-700">Save & Continue</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 2: PRODUCT INFO */}
            <AccordionItem value="product" className="border border-border rounded-lg bg-slate-50 px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium text-slate-800">Section 2 — Product Information</span>
                  {exportOrder.checklist.product ? <span className="text-success text-sm flex items-center gap-1">✓ Complete</span> : <span className="text-amber-500 text-sm flex items-center gap-1">⚠ Incomplete</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="col-span-2">
                    <Label>Product Name</Label>
                    <Input disabled value="Handcrafted Kutch Embroidery Bag" className="mt-1 bg-slate-100" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input disabled value="Bags & Accessories" className="mt-1 bg-slate-100" />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input disabled value={order.quantity.toString()} className="mt-1 bg-slate-100" />
                  </div>
                  <div>
                    <Label>Unit Value (INR)</Label>
                    <Input disabled value={order.unitPrice.toString()} className="mt-1 bg-slate-100" />
                  </div>
                  <div>
                    <Label>Country of Origin</Label>
                    <Input disabled value="India" className="mt-1 bg-slate-100" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleSaveSection('product')} className="bg-slate-800 hover:bg-slate-700">Save & Continue</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 3: PACKAGE INFO */}
            <AccordionItem value="packageInfo" className="border border-border rounded-lg bg-slate-50 px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium text-slate-800">Section 3 — Package Information</span>
                  {exportOrder.checklist.packageInfo ? <span className="text-success text-sm flex items-center gap-1">✓ Complete</span> : <span className="text-amber-500 text-sm flex items-center gap-1">⚠ Incomplete</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input placeholder="e.g. 1.2" value={packageInfo.weight} onChange={e => setPackageInfo({...packageInfo, weight: e.target.value})} className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label>Length (cm)</Label>
                    <Input placeholder="e.g. 30" value={packageInfo.length} onChange={e => setPackageInfo({...packageInfo, length: e.target.value})} className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label>Width (cm)</Label>
                    <Input placeholder="e.g. 20" value={packageInfo.width} onChange={e => setPackageInfo({...packageInfo, width: e.target.value})} className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label>Height (cm)</Label>
                    <Input placeholder="e.g. 10" value={packageInfo.height} onChange={e => setPackageInfo({...packageInfo, height: e.target.value})} className="mt-1 bg-white" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleSaveSection('packageInfo', packageInfo)} className="bg-slate-800 hover:bg-slate-700">Save & Continue</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 4: DESTINATION */}
            <AccordionItem value="destination" className="border border-border rounded-lg bg-slate-50 px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium text-slate-800">Section 4 — Destination</span>
                  {exportOrder.checklist.destination ? <span className="text-success text-sm flex items-center gap-1">✓ Complete</span> : <span className="text-amber-500 text-sm flex items-center gap-1">⚠ Incomplete</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-1 gap-4 mt-2">
                  <div>
                    <Label>Buyer Name</Label>
                    <Input disabled value={order.buyerName} className="mt-1 bg-slate-100" />
                  </div>
                  <div>
                    <Label>Buyer Country</Label>
                    <Input disabled value={order.destinationCountry} className="mt-1 bg-slate-100" />
                  </div>
                  <div>
                    <Label>Shipping Address</Label>
                    <Input disabled value={order.address} className="mt-1 bg-slate-100" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleSaveSection('destination')} className="bg-slate-800 hover:bg-slate-700">Save & Continue</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 5: EXPORT INFO */}
            <AccordionItem value="exportInfo" className="border border-border rounded-lg bg-slate-50 px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium text-slate-800">Section 5 — Export Information</span>
                  {exportOrder.checklist.exportInfo ? <span className="text-success text-sm flex items-center gap-1">✓ Complete</span> : <span className="text-amber-500 text-sm flex items-center gap-1">⚠ Incomplete</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-1 gap-4 mt-2">
                  <div>
                    <Label>HS Code</Label>
                    <Input placeholder="e.g. 4202.22" value={exportInfo.hsCode} onChange={e => setExportInfo({...exportInfo, hsCode: e.target.value})} className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label>Total Declared Value (INR)</Label>
                    <Input placeholder="e.g. 1999" value={exportInfo.declaredValue} onChange={e => setExportInfo({...exportInfo, declaredValue: e.target.value})} className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label>Export Purpose</Label>
                    <Input value={exportInfo.purpose} onChange={e => setExportInfo({...exportInfo, purpose: e.target.value})} className="mt-1 bg-white" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleSaveSection('exportInfo', exportInfo)} className="bg-slate-800 hover:bg-slate-700">Save & Continue</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 pt-6 border-t border-border">
            {isReady ? (
              <div className="flex items-center justify-between bg-success/10 p-4 rounded-lg border border-success/20">
                <div>
                  <div className="flex items-center gap-3 text-success font-bold text-lg">
                    <CheckCircle2 className="size-6" />
                    Ready for Export ✓
                  </div>
                  <p className="text-sm text-success/80 mt-1">100% — All required export information has been completed.</p>
                </div>
                <Button asChild className="bg-success hover:bg-success/90 text-white shadow-md">
                  <Link to="/seller/orders/$id" params={{ id }}>Generate Export Documents</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 font-medium">
                  <AlertTriangle className="size-5" />
                  Please complete all sections to generate export documents.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}
