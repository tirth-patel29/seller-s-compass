import { createFileRoute, Link } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute('/verify-account')({
  component: VerifyAccountPage,
})

function VerifyAccountPage() {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-16 md:py-32">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-2">Verify Account</h1>
          <p className="text-muted-foreground mb-8">We've sent a 6-digit verification code to your email.</p>
          
          <form className="space-y-6 text-left bg-card p-8 rounded-xl border border-border shadow-sm" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-center block">Verification Code</label>
              <Input id="code" type="text" className="text-center text-2xl tracking-widest h-14" placeholder="------" maxLength={6} />
            </div>
            <Button type="button" className="w-full" asChild>
              <Link to="/login">Verify & Sign In</Link>
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Didn't receive the code? <button className="text-primary hover:underline font-medium cursor-pointer">Resend</button>
          </p>
        </div>
      </div>
    </MarketplaceLayout>
  )
}
