import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Package, Star } from "lucide-react";
import type { Seller } from "@/lib/types";
import { getSellerImage } from "@/data/assets";

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-start gap-4">
        <img
          src={getSellerImage(seller.id)}
          alt={seller.name}
          className="size-16 rounded-full object-cover shadow-sm"
        />
        <div className="flex-1">
          <h3 className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
            {seller.name}
            {seller.identityVerified && <BadgeCheck className="size-4 text-success" />}
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {seller.location}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{seller.story}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" /> {seller.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Package className="size-4 text-muted-foreground" /> {seller.orders} Orders
          </span>
        </div>
        <Link
          to="/seller/$id"
          params={{ id: seller.id }}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View Seller
        </Link>
      </div>
    </div>
  );
}
