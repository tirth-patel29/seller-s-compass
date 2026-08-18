import { createFileRoute } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'
import { SellerCard } from '@/components/cards/SellerCard'
import { getSellers } from '@/services/mockServices'
import { useEffect, useState } from 'react'
import type { Seller } from '@/lib/types'

export const Route = createFileRoute('/sellers')({
  component: SellersPage,
})

function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])

  useEffect(() => {
    getSellers().then(setSellers)
  }, [])

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Verified DNK Sellers</h1>
          <p className="mt-2 text-muted-foreground">Meet the artisans and small businesses exporting authentic Indian products.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      </div>
    </MarketplaceLayout>
  )
}
