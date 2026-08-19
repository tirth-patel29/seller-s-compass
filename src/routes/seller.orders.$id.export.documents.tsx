import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, CheckCircle2, FileDown } from 'lucide-react'
import { getOrderById, getExportOrderByOrderId } from '@/services/mockServices'
import { useEffect, useState } from 'react'
import type { Order, ExportOrder } from '@/lib/types'
import { ErrorState } from '@/components/shared/ErrorState'
import { toast } from 'sonner'

import { documentService } from '@/services/documentService'

export const Route = createFileRoute('/seller/orders/$id/export/documents')({
  component: ExportDocumentsPage,
})

function ExportDocumentsPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [exportOrder, setExportOrder] = useState<ExportOrder | null>(null)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getOrderById(id),
      getExportOrderByOrderId(id)
    ]).then(async ([o, eo]) => {
      setOrder(o || null)
      setExportOrder(eo || null)
      if (o) {
        const { getProductById } = await import('@/services/mockServices')
        const p = await getProductById(o.productId)
        setProduct(p || null)
      }
      setLoading(false)
    })
  }, [id])

  if (loading) return <SellerLayout><div className="p-8 text-center animate-pulse">Loading...</div></SellerLayout>
  if (!order || !exportOrder || !exportOrder.documentsGenerated) return <SellerLayout><ErrorState description={`Documents not generated yet.`} /></SellerLayout>

  const documents = [
    { name: "Commercial Invoice", id: "inv" },
    { name: "Package Details", id: "pkg" },
    { name: "Export Declaration", id: "dec" },
    { name: "DNK Shipment Information", id: "dnk" },
  ]

  const generatePdfBlob = () => {
    if (!order || !exportOrder || !product) return null;
    return documentService.generateExportPackagePdf(order, exportOrder, product);
  };

  const handlePreview = () => {
    try {
      const doc = generatePdfBlob();
      if (!doc) throw new Error("Missing data");
      
      const blobUrl = doc.output('bloburl');
      window.open(blobUrl, '_blank');
    } catch (e) {
      toast.error("Unable to preview export documents");
    }
  };

  const handleDownload = () => {
    try {
      const doc = generatePdfBlob();
      if (!doc) throw new Error("Missing data");
      
      const fileName = exportOrder.documentFileName || `DNK-${order.id}-Export-Package.pdf`;
      doc.save(fileName);
      toast.success("Document downloaded successfully");
    } catch (e) {
      toast.error("Unable to download export documents");
    }
  };

  return (
    <SellerLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/seller/orders/$id" params={{ id }}><ArrowLeft className="size-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Export Document Package</h1>
            <p className="text-sm text-muted-foreground">Order #{id}</p>
          </div>
          <div className="ml-auto">
            <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">GENERATED</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Generated Documents</h2>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-slate-50">
                <div className="bg-white p-2 rounded shadow-sm border border-slate-200">
                  <FileText className="size-6 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800">{doc.name}</h3>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <CheckCircle2 className="size-3" /> Ready
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handlePreview} title="Preview">
                  <FileDown className="size-4 text-slate-500" />
                </Button>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-8">
            <h3 className="font-medium text-slate-800 mb-2">Package Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Destination</p>
                <p className="font-medium">{order.destinationCountry}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Product</p>
                <p className="font-medium truncate">{product ? product.name : order.productId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Value</p>
                <p className="font-medium">₹{order.total}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Weight</p>
                <p className="font-medium">{exportOrder.packageInfo.weight} kg</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-between">
            <Button variant="outline" asChild>
              <Link to="/seller/orders/$id" params={{ id }}>Back to Order</Link>
            </Button>
            <div className="space-x-3">
              <Button variant="secondary" onClick={handlePreview}>
                Preview PDF
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                Download PDF
              </Button>
              <Button asChild className="bg-slate-800 hover:bg-slate-700 text-white">
                <Link to="/seller/orders/$id/export/submit" params={{ id }}>Continue to DNK</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}
