import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/services/db";

export const Route = createFileRoute("/seller/$id")({
  head: () => ({
    meta: [
      { title: "Verified seller profile — DNK" },
      { name: "description", content: "Verified Indian artisan profile with identity, business and export verification, delivery record and product catalogue." },
      { property: "og:title", content: "Verified seller — DNK" },
      { property: "og:description", content: "Trust information for an Indian artisan selling internationally." },
    ],
  }),
  component: SellerProfile,
});

function SellerProfile() {
  const { id } = Route.useParams();
  const state = useAppState();
  const seller = state.sellers.find((s) => s.id === id);
  const products = state.products.filter((p) => p.sellerId === id && p.status === "published");

  if (!seller) {
    return (
      <MarketplaceLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <EmptyState
            title="Seller not found"
            description="This seller profile is not available."
            action={
              <Button asChild>
                <Link to="/marketplace">Back to marketplace</Link>
              </Button>
            }
          />
        </div>
      </MarketplaceLayout>
    );
  }

  const trust = [
    { label: "Identity Verified", ok: seller.identityVerified },
    { label: "Business Verified", ok: seller.businessVerified },
    { label: "Product Origin Declared", ok: seller.originDeclared },
    { label: "Export Enabled", ok: seller.exportEnabled },
  ];

  return (
    <MarketplaceLayout>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <ShieldCheck className="size-3.5" aria-hidden="true" /> Verified Artisan
          </span>
          <h1 className="mt-3 text-3xl font-bold text-foreground">{seller.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" /> {seller.location}, {seller.country}
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 sm:max-w-md">
            <div>
              <dt className="text-xs text-muted-foreground">Orders</dt>
              <dd className="text-xl font-bold text-foreground">{seller.orders}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Successful deliveries</dt>
              <dd className="text-xl font-bold text-foreground">{seller.deliveries}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Rating</dt>
              <dd className="text-xl font-bold text-foreground">{seller.rating}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <li key={t.label} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm">
              <BadgeCheck className={t.ok ? "size-4 text-success" : "size-4 text-muted-foreground"} aria-hidden="true" />
              {t.label}
            </li>
          ))}
        </ul>

        <section className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Our story</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{seller.story}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {seller.businessType} · {seller.category} · Selling on DNK since {seller.joined}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">Products</h2>
          {products.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="No published products yet" description="This seller hasn't published a listing." />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} seller={seller} />
              ))}
            </div>
          )}
        </section>
      </div>
    </MarketplaceLayout>
  );
}

