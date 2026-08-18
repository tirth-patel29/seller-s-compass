import { createFileRoute } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'
import { CategoryCard } from '@/components/cards/CategoryCard'
import { CATEGORIES } from '@/data/seed'

export const Route = createFileRoute('/categories/')({
  component: CategoriesPage,
})

function CategoriesPage() {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Explore Categories</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category}
              name={category}
              slug={category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}
              description={`Discover authentic ${category.toLowerCase()} from Indian artisans.`}
              productCount={Math.floor(Math.random() * 50) + 10}
            />
          ))}
        </div>
      </div>
    </MarketplaceLayout>
  )
}
