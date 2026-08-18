import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, ShoppingBag, Ship, IndianRupee } from "lucide-react";
import { SellerLayout } from "@/components/SellerLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { inr } from "@/lib/format";
import { useAppState } from "@/services/db";
import { useAuth } from "@/hooks/useAuth";
import { exportService, readinessLabel, readinessScore } from "@/services/exportService";

export const Route = createFileRoute("/seller/dashboard")({
  head: () => ({
    meta: [
      { title: "Seller dashboard — DNK" },
      { name: "description", content: "Track products, international orders, export readiness and revenue in one seller dashboard." },
      { property: "og:title", content: "Seller dashboard — DNK" },
      { property: "og:description", content: "Your export business at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const state = useAppState();
  const { user } = useAuth();
  const sellerId = user?.sellerId ?? "slr-1";
  const seller = state.sellers.find((s) => s.id === sellerId);
  const products = state.products.filter((p) => p.sellerId === sellerId);
  const orders = state.orders.filter((o) => o.sellerId === sellerId);
  const exportOrders = state.exportOrders.filter((e) => orders.some((o) => o.id === e.orderId));
  const revenue = orders.reduce((sum, o) => sum + o.unitPrice * o.quantity, 0);

  const scores = exportOrders.map((e) => readinessScore(e));
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 100;
  const needsAttention = exportOrders.filter((e) => readinessScore(e) < 100).length;

  const stats = [
    { label: "Products", value: String(products.length), icon: Boxes },
    { label: "Active Orders", value: String(orders.filter((o) => o.status !== "delivered").length), icon: ShoppingBag },
    { label: "Export Orders", value: String(exportOrders.length), icon: Ship },
    { label: "Revenue", value: inr(revenue), icon: IndianRupee },
  ];

  const firstName = (user?.name ?? "Meena").split(" ")[0];

  return (
    <SellerLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Good morning, {firstName} 👋</h1>
            <p className="text-sm text-muted-foreground">{seller?.name} · {seller?.location}</p>
          </div>
          <Button asChild>
            <Link to="/seller/products/new">Add product</Link>
          </Button>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <s.icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <dd className="mt-2 text-2xl font-bold text-foreground">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-4 lg:grid-cols-3">
          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-base font-semibold text-foreground">Export Readiness</h2>
            <p className="mt-4 text-4xl font-bold text-foreground">{avgScore}%</p>
            <p className="text-sm font-medium text-brand-foreground">{readinessLabel(avgScore)}</p>
            <Progress value={avgScore} className="mt-4" />
            <p className="mt-3 text-sm text-muted-foreground">
              {needsAttention} order{needsAttention === 1 ? "" : "s"} need attention
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/seller/orders">Review Orders</Link>
            </Button>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Recent Orders</h2>
              <Link to="/seller/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                View all
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No orders yet" description="Publish a product to start receiving international orders." />
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th scope="col" className="pb-2 pr-4 font-medium">Order</th>
                      <th scope="col" className="pb-2 pr-4 font-medium">Product</th>
                      <th scope="col" className="pb-2 pr-4 font-medium">Buyer</th>
                      <th scope="col" className="pb-2 pr-4 font-medium">Destination</th>
                      <th scope="col" className="pb-2 pr-4 font-medium">Value</th>
                      <th scope="col" className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.slice(0, 5).map((o) => {
                      const product = state.products.find((p) => p.id === o.productId);
                      return (
                        <tr key={o.id} className="hover:bg-secondary/50">
                          <td className="py-3 pr-4">
                            <Link to="/seller/orders/$id" params={{ id: o.id }} className="font-medium underline-offset-4 hover:underline">
                              {o.id}
                            </Link>
                          </td>
                          <td className="max-w-[180px] truncate py-3 pr-4">{product?.name ?? "—"}</td>
                          <td className="py-3 pr-4">{o.buyerName}</td>
                          <td className="py-3 pr-4">{o.destinationCountry}</td>
                          <td className="py-3 pr-4">{inr(o.total)}</td>
                          <td className="py-3">
                            <StatusBadge status={o.status} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold text-foreground">Product Performance</h2>
          {products.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="You haven't added any products yet."
                action={
                  <Button asChild>
                    <Link to="/seller/products/new">Add Your First Product</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="pb-2 pr-4 font-medium">Product</th>
                    <th scope="col" className="pb-2 pr-4 font-medium">Views</th>
                    <th scope="col" className="pb-2 pr-4 font-medium">Orders</th>
                    <th scope="col" className="pb-2 font-medium">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.slice(0, 6).map((p) => {
                    const count = orders.filter((o) => o.productId === p.id).length;
                    const conv = p.views ? ((count / p.views) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={p.id}>
                        <td className="max-w-[220px] truncate py-3 pr-4">{p.name}</td>
                        <td className="py-3 pr-4">{p.views}</td>
                        <td className="py-3 pr-4">{count}</td>
                        <td className="py-3">{conv}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {needsAttention > 0 && (
          <Link
            to="/seller/orders"
            className="flex items-center justify-between rounded-xl border border-brand/40 bg-brand-soft px-6 py-4 text-sm font-medium text-brand-foreground"
          >
            {needsAttention} order{needsAttention === 1 ? "" : "s"} still need export details before DNK submission.
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
        <p className="sr-only">{exportService.getForOrder("ORD-10231") ? "" : ""}</p>
      </div>
    </SellerLayout>
  );
}
