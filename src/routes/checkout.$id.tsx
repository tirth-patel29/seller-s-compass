import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DESTINATIONS } from "@/data/seed";
import { inr } from "@/lib/format";
import { useAppState } from "@/services/db";
import { orderService } from "@/services/orderService";
import { currencyService } from "@/services/currencyService";
import { shippingQuoteService } from "@/services/shippingQuoteService";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferences } from "@/hooks/usePreferences";

export const Route = createFileRoute("/checkout/$id")({
  head: () => ({
    meta: [
      { title: "Checkout — DNK" },
      { name: "description", content: "Complete your international order from a verified Indian artisan on DNK." },
      { property: "og:title", content: "Checkout — DNK" },
      { property: "og:description", content: "Secure mocked checkout for the DNK prototype." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { id } = Route.useParams();
  const state = useAppState();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { currency } = usePreferences();
  const product = state.products.find((p) => p.id === id);

  const [name, setName] = useState(user?.role === "buyer" ? user.name : "Emily Carter");
  const [email, setEmail] = useState(user?.role === "buyer" ? user.email : "emily@buyer.com");
  const [address, setAddress] = useState("418 Beacon St, Boston, MA 02115");
  const [country, setCountry] = useState("United States");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!product) {
    return (
      <MarketplaceLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <EmptyState
            title="Product unavailable"
            description="We couldn't find the product you were checking out."
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

  const subtotalINR = product.price * quantity;
  const feesINR = Math.round(subtotalINR * 0.05);
  
  // Dynamic Quote
  const quote = shippingQuoteService.getQuote({
    originCountry: "India", // Default origin
    destinationCountry: country,
    weightKg: product.weightKg || 1,
    productValueINR: subtotalINR,
  });
  
  const [selectedShippingId, setSelectedShippingId] = useState(quote.options[0]?.id || "ems");
  const selectedShipping = quote.options.find(o => o.id === selectedShippingId) || quote.options[0];
  const shippingINR = selectedShipping?.basePostageINR || 0;
  
  const totalINR = subtotalINR + shippingINR + quote.dutiesINR + feesINR;

  // Global Currency Preference
  const buyerCurrency = currency;
  const fmt = (inrVal: number) => currencyService.formatConvertedPrice(inrVal, buyerCurrency);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const order = await orderService.createOrder({
        product,
        quantity,
        buyerName: name,
        buyerEmail: email,
        destinationCountry: country,
        address,
        shippingOptionId: selectedShippingId,
        shippingAmountINR: shippingINR,
        dutyAmountINR: quote.dutiesINR,
        buyerCurrency,
      });
      setOrderId(order.id);
      toast.success("Order confirmed");
    } catch {
      toast.error("We couldn't place the order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <MarketplaceLayout>
        <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Order Confirmed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The seller has been notified and will begin the export readiness process.
          </p>
          <p className="mt-6 rounded-xl border border-border bg-card px-6 py-4 text-sm">
            Order ID <span className="font-semibold text-foreground">{orderId}</span>
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate({ to: "/buyer/orders/$id", params: { id: orderId } })}>
              Track Order
            </Button>
            <Button variant="outline" asChild>
              <Link to="/marketplace">Continue browsing</Link>
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <form onSubmit={placeOrder} className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">{t("checkout.title") || "Checkout"}</h1>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">Destination country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DESTINATIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Shipping method</h2>
            <p className="mt-2 text-sm text-muted-foreground mb-4">
              International shipping rates are automatically calculated based on the destination and package weight ({product.weightKg || 1}kg).
            </p>
            <div className="space-y-3">
              {quote.options.map(opt => (
                <label key={opt.id} className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${selectedShippingId === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" value={opt.id} checked={selectedShippingId === opt.id} onChange={() => setSelectedShippingId(opt.id)} className="size-4 text-primary" />
                    <div>
                      <p className="font-medium">{opt.serviceName}</p>
                      <p className="text-xs text-muted-foreground">Estimated delivery: {opt.estimatedDelivery}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{fmt(opt.basePostageINR)}</p>
                    <p className="text-xs text-muted-foreground">{inr(opt.basePostageINR)}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Payment</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Payment is mocked in this prototype. No card details are collected and no charge is made.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-semibold text-foreground">Order summary</h2>
          <div className="mt-4 flex gap-3">
            <img src={product.image} alt="" width={900} height={900} className="size-16 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {product.origin} · Qty {quantity}
              </p>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("checkout.product") || "Product"}</dt>
              <dd className="text-right">
                <div>{fmt(subtotalINR)}</div>
                {currency !== "INR" && <div className="text-xs text-muted-foreground">≈ {inr(subtotalINR)} INR</div>}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("checkout.shipping") || "Shipping"} ({selectedShipping?.serviceName})</dt>
              <dd className="text-right">
                <div>{fmt(shippingINR)}</div>
                {currency !== "INR" && <div className="text-xs text-muted-foreground">≈ {inr(shippingINR)} INR</div>}
              </dd>
            </div>
            {quote.dutiesINR > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("checkout.import_duty") || "Estimated Import Duty"} (DDP)</dt>
                <dd className="text-right">
                  <div>{fmt(quote.dutiesINR)}</div>
                  {currency !== "INR" && <div className="text-xs text-muted-foreground">≈ {inr(quote.dutiesINR)} INR</div>}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("checkout.platform_fees") || "Platform fees"}</dt>
              <dd className="text-right">
                <div>{fmt(feesINR)}</div>
                {currency !== "INR" && <div className="text-xs text-muted-foreground">≈ {inr(feesINR)} INR</div>}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>{t("checkout.total") || "Total"}</dt>
              <dd className="text-right">
                <div>{fmt(totalINR)}</div>
                {currency !== "INR" && <div className="text-xs font-normal text-muted-foreground mt-0.5">≈ {inr(totalINR)} INR</div>}
              </dd>
            </div>
          </dl>
          <Button type="submit" className="mt-6 w-full" size="lg" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />} {t("checkout.place_order") || "Place Order"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            By placing the order you agree to origin declaration for customs purposes.
          </p>
        </aside>
      </form>
    </MarketplaceLayout>
  );
}

