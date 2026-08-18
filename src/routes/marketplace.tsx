import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/data/seed";
import { useAppState } from "@/services/db";

interface MarketplaceSearch {
  q?: string;
  category?: string;
  verified?: string;
  maxPrice?: number;
  origin?: string;
  view?: string;
}

export const Route = createFileRoute("/marketplace")({
  validateSearch: (search: Record<string, unknown>): MarketplaceSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    verified: search["verified"] === "true" ? "true" : undefined,
    maxPrice: Number(search["maxPrice"]) > 0 ? Number(search["maxPrice"]) : undefined,
    origin: typeof search["origin"] === "string" ? search["origin"] : undefined,
    view: typeof search["view"] === "string" ? search["view"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Marketplace — Handmade Indian products for global buyers | ExportSetu" },
      {
        name: "description",
        content:
          "Browse verified Indian artisans and MSMEs. Handcrafted bags, handloom textiles, terracotta decor, wood craft, paintings and jewellery with international shipping.",
      },
      { property: "og:title", content: "ExportSetu Marketplace" },
      { property: "og:description", content: "Handmade Indian products from verified sellers, shipped worldwide." },
    ],
  }),
  component: Marketplace,
});

const PRICE_BANDS = [
  { label: "Under ₹1,000", value: 1000 },
  { label: "Under ₹2,500", value: 2500 },
  { label: "Under ₹5,000", value: 5000 },
];

function Marketplace() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/marketplace" });
  const state = useAppState();

  const setSearch = (patch: Partial<MarketplaceSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const origins = Array.from(new Set(state.products.map((p) => p.origin)));

  const products = state.products.filter((p) => {
    if (p.status !== "published") return false;
    const seller = state.sellers.find((s) => s.id === p.sellerId);
    if (search.q && !`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search.q.toLowerCase()))
      return false;
    if (search.category && p.category !== search.category) return false;
    if (search.origin && p.origin !== search.origin) return false;
    if (search.maxPrice && p.price > search.maxPrice) return false;
    if (search.verified === "true" && !seller?.identityVerified) return false;
    return true;
  });

  const filtersActive = Boolean(
    search.q || search.category || search.origin || search.maxPrice || search.verified,
  );

  return (
    <MarketplaceLayout>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Handmade products from verified Indian artisans and MSMEs, ready for international
            shipping with full tracking.
          </p>
          <div className="relative mt-6 max-w-xl">
            <label htmlFor="marketplace-search" className="sr-only">
              Search products
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="marketplace-search"
              value={search.q ?? ""}
              onChange={(e) => setSearch({ q: e.target.value || undefined })}
              placeholder="Search for bags, textiles, jewellery…"
              className="bg-background pl-9"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-foreground">Category</h2>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={search.category === c}
                  onClick={() => setSearch({ category: search.category === c ? undefined : c })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    search.category === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-foreground">Price</h2>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {PRICE_BANDS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  aria-pressed={search.maxPrice === b.value}
                  onClick={() => setSearch({ maxPrice: search.maxPrice === b.value ? undefined : b.value })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    search.maxPrice === b.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-foreground">Country of origin</h2>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {origins.map((o) => (
                <button
                  key={o}
                  type="button"
                  aria-pressed={search.origin === o}
                  onClick={() => setSearch({ origin: search.origin === o ? undefined : o })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    search.origin === o
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Trust</h2>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border-input"
                checked={search.verified === "true"}
                onChange={(e) => setSearch({ verified: e.target.checked ? "true" : undefined })}
              />
              Verified sellers only
            </label>
            <p className="text-xs text-muted-foreground">All listed products ship internationally.</p>
          </section>

          {filtersActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate({ search: {} })
              }
            >
              Clear filters
            </Button>
          )}
        </aside>

        <section aria-label="Products">
          <p className="mb-4 text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
          {products.length === 0 ? (
            <EmptyState
              title="No products match these filters"
              description="Try clearing a filter or searching for a different craft."
              action={<Button onClick={() => navigate({ search: {} })}>Clear filters</Button>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} seller={state.sellers.find((s) => s.id === p.sellerId)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </MarketplaceLayout>
  );
}
