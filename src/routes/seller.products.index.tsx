import { createFileRoute, Link } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/services/db'
import { useAuth } from '@/hooks/useAuth'
import { EmptyState } from '@/components/States'
import { Plus, Edit, Eye, Archive } from 'lucide-react'
import { inr } from '@/lib/format'

export const Route = createFileRoute('/seller/products/')({
  component: SellerProductsPage,
})

function SellerProductsPage() {
  const state = useAppState()
  const { user } = useAuth()
  const sellerId = user?.sellerId ?? "slr-1"
  const products = state.products.filter(p => p.sellerId === sellerId)

  return (
    <SellerLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">Manage your product catalog.</p>
          </div>
          <Button asChild>
            <Link to="/seller/products/new" className="gap-2">
              <Plus className="size-4" /> Add Product
            </Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <EmptyState 
            title="No products found" 
            description="You haven't added any products yet."
            action={
              <Button asChild>
                <Link to="/seller/products/new">Add Your First Product</Link>
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="size-10 rounded-md object-cover bg-surface" />
                          <span className="font-medium text-foreground">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                      <td className="px-6 py-4 font-medium">{inr(p.price)}</td>
                      <td className="px-6 py-4">{p.quantity}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${p.status === 'published' ? 'bg-success/15 text-success' : 'bg-secondary text-secondary-foreground'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to="/product/$id" params={{ id: p.id }} title="View">
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Archive" className="text-destructive hover:text-destructive">
                            <Archive className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  )
}
