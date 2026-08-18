import { createFileRoute } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">About Dak Ghar Niryat Kendra</h1>
            <p className="mt-4 text-lg text-muted-foreground">Connecting Indian artisans to global markets through the trusted network of India Post.</p>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>Dak Ghar Niryat Kendra (DNK) is an initiative to boost exports from MSMEs, artisans, and small-scale industries in India. By leveraging the extensive network of India Post, DNK simplifies the export process, from documentation to customs clearance and international shipping.</p>
            <h3>Our Mission</h3>
            <p>To democratize international trade for every Indian artisan and small business owner, removing the complexities of global shipping and customs.</p>
            <h3>How We Help</h3>
            <ul>
              <li><strong>Simplified Customs:</strong> Postal Bill of Export (PBE) generation right from the platform.</li>
              <li><strong>Trusted Delivery:</strong> Global reach via India Post's international partnerships.</li>
              <li><strong>Export Readiness:</strong> Guided workflows to ensure every shipment meets international standards.</li>
            </ul>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  )
}
