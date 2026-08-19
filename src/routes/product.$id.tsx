import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Plane, ShieldCheck, ArrowRight, Package } from "lucide-react";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/format";
import { useAppState } from "@/services/db";
import { currencyService } from "@/services/currencyService";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferences } from "@/hooks/usePreferences";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — DNK" },
      { name: "description", content: "Handmade Indian product from a verified artisan, with international shipping and end-to-end export tracking." },
      { property: "og:title", content: "Handmade Indian product — DNK" },
      { property: "og:description", content: "Buy directly from verified Indian artisans with DNK-enabled international delivery." },
    ],
  }),
  component: ProductDetail,
});

const TRUST = [
  "Seller Verified",
  "Product Origin Declared",
  "International Shipping",
  "Shipment Tracking",
];

function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const state = useAppState();
  const { t } = useTranslation();
  const { currency } = usePreferences();
  
  const product = state.products.find((p) => p.id === id);
  const seller = state.sellers.find((s) => s.id === product?.sellerId);

  if (!product) {
    return (
      <MarketplaceLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <EmptyState
            title="Product not found"
            description="This listing may have been removed or is no longer published."
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

  const otherProducts = state.products.filter(
    (p) => p.sellerId === product.sellerId && p.id !== product.id && p.status === "published",
  );

  return (
    <MarketplaceLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-3">
            <img
              src={product.image}
              alt={product.name}
              width={900}
              height={900}
              className="w-full rounded-2xl border border-border object-cover"
            />
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={product.image}
                  alt=""
                  loading="lazy"
                  width={900}
                  height={900}
                  className="aspect-square w-full rounded-lg border border-border object-cover opacity-80"
                />
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
            
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">
                {currencyService.formatConvertedPrice(product.price, currency)}
              </p>
              {currency !== "INR" && (
                <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                  <span>≈ {inr(product.price)} INR</span>
                  <span>·</span>
                  <span>Duties and taxes calculated at checkout</span>
                </p>
              )}
              {currency === "INR" && (
                <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                  <span>Duties and taxes calculated at checkout</span>
                </p>
              )}
            </div>

            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-32 text-muted-foreground">Seller</dt>
                <dd>
                  <Link to="/seller/$id" params={{ id: product.sellerId }} className="font-medium underline-offset-4 hover:underline">
                    {seller?.name}
                  </Link>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 text-muted-foreground">Origin</dt>
                <dd className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden="true" /> {product.origin}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 text-muted-foreground">Availability</dt>
                <dd>{product.quantity} in stock</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 text-muted-foreground">Shipping estimate</dt>
                <dd>9–14 days internationally</dd>
              </div>
            </dl>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
                  <BadgeCheck className="size-4 text-success" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate({ to: "/checkout/$id", params: { id: product.id } })}>
                {t("product.buy_now") || "Buy Now"} <ArrowRight />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: "/checkout/$id", params: { id: product.id } })}>
                {t("product.add_to_cart") || "Add to Cart"}
              </Button>
            </div>

            {product.highlights.length > 0 && (
              <ul className="mt-8 space-y-1 text-sm text-muted-foreground">
                {product.highlights.map((h) => (
                  <li key={h}>• {h}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">About this product</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </article>

          <article className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Export &amp; delivery</h2>
            <ol className="mt-4 space-y-3">
              {["Order", "DNK", "Customs", "International Delivery"].map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className="grid size-6 place-items-center rounded-full bg-secondary text-xs font-semibold">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Package className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Exports are processed through a Dak Ghar Niryat Kendra. DNK integration is simulated in
              this prototype.
            </p>
          </article>
        </section>

        {seller && (
          <section className="mt-10 rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                  <ShieldCheck className="size-3.5" aria-hidden="true" /> Verified Artisan
                </span>
                <h2 className="mt-3 text-lg font-semibold text-foreground">{seller.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {seller.location}, {seller.country} · {seller.rating} rating · {seller.deliveries} successful deliveries
                </p>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{seller.story}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/seller/$id" params={{ id: seller.id }}>
                  View seller profile
                </Link>
              </Button>
            </div>
          </section>
        )}

        {otherProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-foreground">More from this seller</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherProducts.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-card"
                >
                  <img src={p.image} alt={p.name} loading="lazy" width={900} height={900} className="aspect-square w-full rounded-lg object-cover" />
                  <p className="mt-2 line-clamp-1 text-sm font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{currencyService.formatConvertedPrice(p.price, currency)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
          <Plane className="size-3.5" aria-hidden="true" /> Ships from India to the United States, United
          Kingdom, Germany, Australia and Canada.
        </p>
      </div>
    </MarketplaceLayout>
  );
}

