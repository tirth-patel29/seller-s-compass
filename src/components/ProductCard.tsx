import { Link } from "@tanstack/react-router";
import { BadgeCheck, Plane } from "lucide-react";
import { inr } from "@/lib/format";
import type { Product, Seller } from "@/lib/types";

export function ProductCard({ product, seller }: { product: Product; seller?: Seller | undefined }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated"
    >
      <div className="aspect-square overflow-hidden bg-surface">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={900}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{product.name}</h3>
        <p className="text-base font-semibold text-foreground">{inr(product.price)}</p>
        <p className="text-xs text-muted-foreground">
          {product.origin} · {seller?.name ?? "DNK Seller"}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {seller?.identityVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
              <BadgeCheck className="size-3" aria-hidden="true" /> Verified Seller
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            <Plane className="size-3" aria-hidden="true" /> International Shipping
          </span>
        </div>
      </div>
    </Link>
  );
}
