import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SellerLayout } from '@/components/SellerLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORIES } from '@/data/seed'
import { Sparkles, ArrowLeft, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct } from '@/services/mockServices'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/seller/products/new')({
  component: NewProductPage,
})

function NewProductPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const handleSave = async (status: "draft" | "published") => {
    try {
      await createProduct({
        sellerId: user?.sellerId ?? "slr-1",
        name: "New Handcrafted Item",
        category: CATEGORIES[0],
        description: "A beautifully crafted item.",
        price: 999,
        currency: "INR",
        weightKg: 0.5,
        dimensions: { length: 10, width: 10, height: 10 },
        quantity: 10,
        origin: "India",
        image: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&w=800&q=80",
        status,
        keywords: [],
        highlights: []
      })
      toast.success(status === "published" ? "Product published!" : "Draft saved")
      navigate({ to: "/seller/products" })
    } catch (e) {
      toast.error("Failed to save product")
    }
  }

  return (
    <SellerLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/seller/products"><ArrowLeft className="size-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input placeholder="e.g. Handwoven Silk Saree" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 relative">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Description</label>
                  <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                    <Sparkles className="size-3" /> AI Generate
                  </button>
                </div>
                <Textarea placeholder="Describe your product..." rows={5} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (INR)</label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Export & Shipping (Required for DNK)</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input type="number" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">HSN/Tariff Code</label>
                  <Input placeholder="e.g. 6214.90" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Product Images</h2>
              <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-surface flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/50 transition-colors cursor-pointer">
                <ImagePlus className="size-8 mb-2" />
                <span className="text-sm font-medium">Click to upload</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Actions</h2>
              <div className="flex flex-col gap-3">
                <Button className="w-full" onClick={() => handleSave("published")}>Publish Product</Button>
                <Button className="w-full" variant="outline" onClick={() => handleSave("draft")}>Save as Draft</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}
