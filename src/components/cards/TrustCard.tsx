import { ShieldCheck, Plane, CheckCircle, Search } from "lucide-react";

export function TrustCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">DNK Assurances</h3>
      <ul className="flex flex-col gap-4">
        <li className="flex items-start gap-3">
          <ShieldCheck className="size-5 text-success shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Verified Seller</p>
            <p className="text-xs text-muted-foreground">Identity & business verified by DNK.</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle className="size-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Authentic Origin</p>
            <p className="text-xs text-muted-foreground">Products sourced directly from artisans.</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <Plane className="size-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Global Delivery</p>
            <p className="text-xs text-muted-foreground">Export shipping handled via India Post.</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <Search className="size-5 text-amber-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">End-to-End Tracking</p>
            <p className="text-xs text-muted-foreground">Track your order globally until delivery.</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
