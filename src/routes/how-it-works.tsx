import { createFileRoute } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'

export const Route = createFileRoute('/how-it-works')({
  component: HowItWorksPage,
})

function HowItWorksPage() {
  const steps = [
    { title: "Register & List", description: "Sign up as a seller and list your handcrafted products." },
    { title: "Receive Global Orders", description: "Buyers worldwide discover and purchase your products." },
    { title: "Complete Export Readiness", description: "Follow our simple checklist to prepare your shipment for export." },
    { title: "Submit to DNK", description: "Select your nearest Dak Ghar Niryat Kendra and submit the details." },
    { title: "Drop & Ship", description: "Drop the package at the DNK. India Post handles customs and international delivery." },
  ]

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-center mb-12">How DNK Works</h1>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  )
}
