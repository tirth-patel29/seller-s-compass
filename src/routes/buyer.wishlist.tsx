import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/EmptyState'

export const Route = createFileRoute('/buyer/wishlist')({
  component: BuyerWishlist,
})

function BuyerWishlist() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Wishlist</h1>
        <p className="text-muted-foreground">Products you've saved for later.</p>
      </div>

      <EmptyState 
        title="Your wishlist is empty" 
        description="Save your favorite handcrafted products to view them here later." 
        actionText="Explore Marketplace"
        actionUrl="/marketplace"
      />
    </div>
  )
}
