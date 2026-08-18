import { createFileRoute } from '@tanstack/react-router'
import { MarketplaceLayout } from '@/components/MarketplaceLayout'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const Route = createFileRoute('/faq')({
  component: FAQPage,
})

function FAQPage() {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-center mb-12">Frequently Asked Questions</h1>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Who can register on DNK?</AccordionTrigger>
              <AccordionContent>Any registered MSME, artisan, or business in India with an IEC (Import Export Code) can register to export products through DNK.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What is a Postal Bill of Export (PBE)?</AccordionTrigger>
              <AccordionContent>PBE is a customs document required for exporting goods via the postal network. DNK helps you generate this document digitally.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How long does international shipping take?</AccordionTrigger>
              <AccordionContent>Delivery times vary by destination, typically ranging from 7 to 21 working days depending on the selected India Post service (EMS, Air Parcel, etc.).</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MarketplaceLayout>
  )
}
