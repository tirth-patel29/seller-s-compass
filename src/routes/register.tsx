import { createFileRoute, Link } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Store, Globe2 } from "lucide-react"

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-2">Create an account</h1>
          <p className="text-muted-foreground mb-8">Join the Dak Ghar Niryat Kendra platform</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex flex-col items-center justify-center p-6 border-2 border-primary rounded-xl bg-primary/5 text-primary">
              <Store className="size-8 mb-2" />
              <span className="font-semibold">I'm a Seller</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-secondary/50 text-foreground transition-colors">
              <Globe2 className="size-8 mb-2 text-muted-foreground" />
              <span className="font-semibold text-muted-foreground">I'm a Buyer</span>
            </button>
          </div>

          <form className="space-y-4 text-left bg-card p-8 rounded-xl border border-border shadow-sm" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fname" className="text-sm font-medium">First Name</label>
                <Input id="fname" placeholder="First Name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lname" className="text-sm font-medium">Last Name</label>
                <Input id="lname" placeholder="Last Name" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="iec" className="text-sm font-medium">IEC Code (Optional)</label>
              <Input id="iec" placeholder="Import Export Code" />
            </div>
            <Button type="submit" className="w-full mt-4" asChild>
              <Link to="/verify-account">Create Account</Link>
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </MarketplaceLayout>
  )
}
