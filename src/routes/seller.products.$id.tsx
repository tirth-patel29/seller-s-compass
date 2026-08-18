import { createFileRoute, Link } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/services/db'
import { ArrowLeft, Edit } from 'lucide-react'

export const Route = createFileRoute('/seller/products/$id')({
  component: SellerProductDetail,
})

function SellerProductDetail() {
  const { id } = Route.useParams()
  const state = useAppState()
  const product = state.products.find(p => p.id === id)

  if (!product) return <SellerLayout>Product not found</SellerLayout>

  return (
    <SellerLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/seller/products"><ArrowLeft className="size-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/seller/products/$id/edit" params={{ id }}><Edit className="size-4" /> Edit</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-2 overflow-hidden shadow-sm">
             <img src={product.image} alt={product.name} className="w-full h-auto aspect-square object-cover rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Details</h2>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium">₹{product.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-medium">{product.quantity} units</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{product.status}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}
