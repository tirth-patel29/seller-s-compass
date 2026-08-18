import { createFileRoute } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">Contact Us</h1>
          <p className="text-muted-foreground mb-12">Have questions about exporting with DNK? We're here to help.</p>
          
          <form className="space-y-6 text-left bg-card p-8 rounded-xl border border-border shadow-sm" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea id="message" placeholder="How can we help you?" rows={5} />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </MarketplaceLayout>
  )
}
