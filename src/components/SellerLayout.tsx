import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Settings,
  Bell,
  Search,
  Menu,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { useAppState } from "@/services/db";

const NAV = [
  { label: "Dashboard", to: "/seller/dashboard" as const, icon: LayoutDashboard },
  { label: "Products", to: "/seller/products" as const, icon: Boxes },
  { label: "Orders", to: "/seller/orders" as const, icon: ShoppingBag },
  { label: "Export Readiness", to: "/seller/orders" as const, icon: ShieldCheck, search: { filter: "export" } },
  { label: "Shipments", to: "/seller/shipments" as const, icon: Truck },
];

function SidebarBody({ sellerName, onNavigate }: { sellerName: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <Logo />
      </div>
      <nav aria-label="Seller" className="flex-1 space-y-1 px-3">
        {NAV.map((n) => (
          <Link
            key={n.label}
            to={n.to}
            search={n.search as never}
            onClick={onNavigate}
            activeOptions={{ exact: false }}
            activeProps={{ className: "bg-secondary text-foreground" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <n.icon className="size-4" aria-hidden="true" />
            {n.label}
          </Link>
        ))}
        <div className="pt-4">
          <Link
            to="/seller/settings"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Settings className="size-4" aria-hidden="true" /> Settings
          </Link>
        </div>
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-sm font-medium text-foreground">{sellerName}</p>
        <p className="text-xs text-muted-foreground">Verified Seller</p>
      </div>
    </div>
  );
}

export function SellerLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const state = useAppState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const seller = state.sellers.find((s) => s.id === user?.sellerId);
  const sellerName = seller?.name ?? "Meena Handicrafts";

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-background lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody sellerName={sellerName} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background px-4 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Seller navigation</SheetTitle>
              <SidebarBody sellerName={sellerName} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="relative hidden w-72 sm:block">
            <label htmlFor="seller-search" className="sr-only">
              Search
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input id="seller-search" placeholder="Search orders, products" className="pl-9" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell />
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/marketplace">View marketplace</Link>
            </Button>
            <span className="hidden text-sm font-medium sm:inline">{user?.name ?? "Meena Patel"}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await authService.logout();
                navigate({ to: "/" });
              }}
            >
              <LogOut />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
