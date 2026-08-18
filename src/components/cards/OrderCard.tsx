import { Link } from "@tanstack/react-router";
import { ChevronRight, Package, MapPin } from "lucide-react";
import { inr } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import type { Order } from "@/lib/types";

export function OrderCard({ order, role = "seller" }: { order: Order; role?: "seller" | "buyer" | "admin" }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{order.id}</span>
          <StatusBadge status={order.status} />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {order.quantity}x {order.productId}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {order.destinationCountry}
          {role !== "buyer" && ` • ${order.buyerName}`}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">{inr(order.total)}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link
          to={role === "seller" ? "/seller/orders/$id" : role === "buyer" ? "/buyer/orders/$id" : "/admin/orders"}
          params={{ id: order.id }}
          className="flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          View <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
