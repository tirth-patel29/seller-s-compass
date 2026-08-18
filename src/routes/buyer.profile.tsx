import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ASSETS } from '@/data/assets'

export const Route = createFileRoute('/buyer/profile')({
  component: BuyerProfile,
})

function BuyerProfile() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>
      
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <img src={ASSETS.placeholders.avatar} alt="Avatar" className="size-20 rounded-full border border-border" />
          <Button variant="outline">Change Photo</Button>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fname" className="text-sm font-medium">First Name</label>
              <Input id="fname" defaultValue="Emily" />
            </div>
            <div className="space-y-2">
              <label htmlFor="lname" className="text-sm font-medium">Last Name</label>
              <Input id="lname" defaultValue="Carter" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <Input id="email" type="email" defaultValue="emily@buyer.com" readOnly />
            <p className="text-xs text-muted-foreground">To change your email, please contact support.</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
            <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
          </div>
          <div className="pt-4">
            <Button>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
