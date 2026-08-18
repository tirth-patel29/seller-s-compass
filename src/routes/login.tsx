import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Store, Globe2, ShieldCheck } from "lucide-react";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ExportSetu" },
      { name: "description", content: "Sign in to ExportSetu as a seller, international buyer or operations admin." },
      { property: "og:title", content: "Sign in — ExportSetu" },
      { property: "og:description", content: "Demo sign-in for the ExportSetu export-enablement prototype." },
    ],
  }),
  component: LoginPage,
});

const ROLES: { role: Role; name: string; desc: string; icon: typeof Store; to: string }[] = [
  { role: "seller", name: "Meena Patel · Meena Handicrafts", desc: "Indian artisan seller in Kutch, Gujarat", icon: Store, to: "/seller/dashboard" },
  { role: "buyer", name: "Emily Carter", desc: "International buyer in the United States", icon: Globe2, to: "/marketplace" },
  { role: "admin", name: "Operations Admin", desc: "DNK and export operations dashboard", icon: ShieldCheck, to: "/admin" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<Role | null>(null);

  const login = async (role: Role, to: string) => {
    setPending(role);
    try {
      const user = await authService.loginAs(role);
      toast.success(`Signed in as ${user.name}`);
      navigate({ to });
    } catch {
      toast.error("Could not sign in. Please try again.");
    } finally {
      setPending(null);
    }
  };

  return (
    <MarketplaceLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">Sign in to ExportSetu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a demo account. Authentication is mocked in this prototype and is wired behind
          <code className="mx-1 rounded bg-secondary px-1 py-0.5 text-xs">authService</code>
          so it can be replaced with real auth without changing screens.
        </p>

        <div className="mt-8 space-y-3">
          {ROLES.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => login(r.role, r.to)}
              disabled={pending !== null}
              className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60 disabled:opacity-60"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-foreground">
                <r.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{r.name}</span>
                <span className="block text-xs text-muted-foreground">{r.desc}</span>
              </span>
              <span className="ml-auto text-sm font-medium text-muted-foreground">
                {pending === r.role ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">New seller?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in as the seller account to walk through onboarding, product creation and the export
            workflow.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => login("seller", "/seller/onboarding")}
            disabled={pending !== null}
          >
            Start seller onboarding
          </Button>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
