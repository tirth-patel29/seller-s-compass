import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Globe2,
  BadgeCheck,
  Sparkles,
  ClipboardCheck,
  Building2,
  Truck,
} from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DNK — Take Your Products From India to the World" },
      {
        name: "description",
        content:
          "DNK helps Indian artisans and MSMEs create a digital storefront, reach international buyers and export through DNK-enabled logistics.",
      },
      { property: "og:title", content: "DNK — From India to the World" },
      {
        property: "og:description",
        content: "Digital storefront. Trusted buyers. Assisted exports. DNK-enabled delivery.",
      },
    ],
  }),
  component: Landing,
});

const METRICS = [
  { value: "1,000+", label: "DNKs" },
  { value: "Verified", label: "Sellers" },
  { value: "Worldwide", label: "International Shipping" },
  { value: "End-to-End", label: "Tracking" },
];

const FEATURES = [
  { icon: Globe2, title: "Global Marketplace", text: "Publish once and be discoverable by buyers in the US, UK, EU and beyond." },
  { icon: BadgeCheck, title: "Seller Verification", text: "Identity, business and origin signals that international buyers can trust." },
  { icon: Sparkles, title: "AI Product Assistant", text: "Turn a few words into an export-ready listing with title, description and keywords." },
  { icon: ClipboardCheck, title: "Export Readiness", text: "A guided checklist that turns a normal order into an export-ready package." },
  { icon: Building2, title: "DNK Workflow", text: "Submit the export request to a Dak Ghar Niryat Kendra and get a PBE reference." },
  { icon: Truck, title: "Shipment Tracking", text: "One timeline from DNK submission to international delivery, for seller and buyer." },
];

const STEPS = [
  { n: "01", title: "List", text: "Add your product with AI-assisted content." },
  { n: "02", title: "Sell", text: "International buyers discover and order." },
  { n: "03", title: "Export", text: "Complete readiness and submit to DNK." },
  { n: "04", title: "Deliver", text: "Track the shipment until it lands." },
];

function Landing() {
  const { t } = useTranslation();

  return (
    <MarketplaceLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-foreground">
              {t("landing.prototype_badge") || "DNK-enabled export platform · Prototype"}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              {t("landing.hero_title") || "Take Your Products From India to the World."}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              {t("landing.hero_subtitle") || "Create your digital storefront, reach international buyers and simplify your export journey through DNK-enabled logistics."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  {t("landing.start_selling") || "Start Selling"} <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/marketplace">{t("landing.explore_products") || "Explore Products"}</Link>
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="text-xl font-bold text-foreground">{m.value}</dd>
                  <dd className="text-xs text-muted-foreground">{m.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-4">
            <img
              src={heroImage}
              alt="Handcrafted Indian products prepared for international export"
              width={1400}
              height={1000}
              className="w-full rounded-2xl border border-border object-cover shadow-elevated"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-4 text-xs font-medium text-muted-foreground">
              {["Indian Seller", "International Buyer", "DNK", "Global Delivery"].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-foreground">{s}</span>
                  {i < 3 && <ArrowRight className="size-3.5" aria-hidden="true" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Everything a small exporter needs to go global.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <f.icon className="size-5 text-brand" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How it works</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-xl border border-border bg-card p-6">
                <span className="text-xs font-bold text-brand">{s.n}</span>
                <h3 className="mt-2 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/login">Start Selling</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/marketplace">Explore Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketplaceLayout>
  );
}

