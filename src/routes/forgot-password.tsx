import { createFileRoute, Link } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-16 md:py-32">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-2">Reset Password</h1>
          <p className="text-muted-foreground mb-8">Enter your email address and we'll send you a link to reset your password.</p>
          
          <form className="space-y-4 text-left bg-card p-8 rounded-xl border border-border shadow-sm" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <Button type="button" className="w-full mt-2" asChild>
              <Link to="/login">Send Reset Link</Link>
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Remember your password? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </MarketplaceLayout>
  )
}
