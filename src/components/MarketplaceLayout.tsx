import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Menu, LogOut, LayoutDashboard, Package } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector, CurrencySelector } from "@/components/shared/PreferenceSelectors";

export function MarketplaceLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [q, setQ] = useState("");

  const NAV = [
    { label: t("nav.explore"), to: "/marketplace" as const },
    { label: t("nav.categories"), to: "/marketplace" as const, search: { view: "categories" } },
    { label: t("nav.verified_sellers"), to: "/marketplace" as const, search: { verified: "true" } },
    { label: t("nav.how_it_works"), to: "/" as const, hash: "how-it-works" as string | undefined },
  ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/marketplace", search: { q } });
  };

  const links = (
    <>
      {NAV.map((n) => (
        <Link
          key={n.label}
          to={n.to}
          search={n.search as never}
          {...(n.hash ? { hash: n.hash } : {})}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {n.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo />
          <nav aria-label="Main" className="ml-6 hidden items-center gap-6 lg:flex">
            {links}
          </nav>
          <form onSubmit={submitSearch} className="ml-auto hidden w-64 md:block" role="search">
            <label htmlFor="site-search" className="sr-only">
              {t("nav.search_products")}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="site-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("nav.search_products")}
                className="pl-9"
              />
            </div>
          </form>
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSelector />
            <CurrencySelector />
          </div>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {user ? (
              <>
                {user.role === "seller" && (
                  <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                    <Link to="/seller/dashboard">
                      <LayoutDashboard /> {t("nav.dashboard")}
                    </Link>
                  </Button>
                )}
                {user.role === "buyer" && (
                  <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                    <Link to="/buyer/orders">
                      <Package /> {t("nav.my_orders")}
                    </Link>
                  </Button>
                )}
                <span className="hidden text-sm font-medium text-foreground sm:inline">{user.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await authService.logout();
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut /> <span className="sr-only sm:not-sr-only">{t("nav.sign_out")}</span>
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="mb-6">{t("nav.menu")}</SheetTitle>
                <div className="mb-6 flex flex-col gap-3">
                  <LanguageSelector />
                  <CurrencySelector />
                </div>
                <nav aria-label="Mobile" className="flex flex-col gap-4">
                  {links}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Digital storefront. Trusted buyers. Assisted exports. DNK-enabled delivery.
            </p>
          </div>
          <p className="max-w-sm text-xs text-muted-foreground">
            Prototype built for SIH 2026. DNK submission is simulated — a production deployment would
            connect to authorised government APIs.
          </p>
        </div>
      </footer>
    </div>
  );
}
