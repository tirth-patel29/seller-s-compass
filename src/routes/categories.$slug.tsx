import { createFileRoute } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'
import { ProductCard } from '@/components/ProductCard'
import { getProductsByCategory, getSellers } from '@/services/mockServices'
import { useEffect, useState } from 'react'
import type { Product, Seller } from '@/lib/types'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/categories/$slug')({
  component: CategorySlugPage,
})

function CategorySlugPage() {
  const { slug } = Route.useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Record<string, Seller>>({})
  const [loading, setLoading] = useState(true)

  const categoryName = slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace(' And ', ' & ')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const allSellers = await getSellers()
      const sellerMap = allSellers.reduce((acc, s) => ({ ...acc, [s.id]: s }), {})
      setSellers(sellerMap)
      
      const allProducts = await getProductsByCategory(categoryName)
      if (allProducts.length === 0) {
        const { getProducts } = await import('@/services/mockServices');
        const fallback = await getProducts();
        setProducts(fallback.slice(0, 4));
      } else {
        setProducts(allProducts)
      }
      setLoading(false)
    }
    loadData()
  }, [categoryName])

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">{categoryName}</h1>
        <p className="mb-8 text-muted-foreground">Discover handcrafted {categoryName.toLowerCase()} created by Indian artisans and small businesses.</p>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
             {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-xl bg-secondary animate-pulse" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} seller={sellers[product.sellerId]} />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No products found" 
            description="We couldn't find any products in this category at the moment."
            actionText="Browse all products"
            actionUrl="/marketplace"
          />
        )}
      </div>
    </MarketplaceLayout>
  )
}
