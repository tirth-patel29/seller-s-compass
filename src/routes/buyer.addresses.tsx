import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { MapPin, Plus } from 'lucide-react'

export const Route = createFileRoute('/buyer/addresses')({
  component: BuyerAddresses,
})

function BuyerAddresses() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Saved Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping destinations.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" /> Add Address
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-6 shadow-sm relative">
          <div className="absolute top-4 right-4 text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-md">Default</div>
          <div className="flex items-start gap-4">
            <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Home</h3>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                Emily Carter
                418 Beacon St
                Boston, MA 02115
                United States
              </p>
              <div className="mt-4 flex gap-3">
                <button className="text-sm font-medium text-primary hover:underline">Edit</button>
                <button className="text-sm font-medium text-destructive hover:underline">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
