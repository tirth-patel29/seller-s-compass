import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const MAP: Record<OrderStatus, { label: string; className: string }> = {
  placed: { label: "Placed", className: "bg-secondary text-secondary-foreground" },
  export_pending: { label: "Export Pending", className: "bg-warning/20 text-warning-foreground" },
  dnk_submitted: { label: "DNK Submitted", className: "bg-info/15 text-info" },
  customs: { label: "Customs", className: "bg-brand-soft text-brand-foreground" },
  in_transit: { label: "In Transit", className: "bg-info/15 text-info" },
  delivered: { label: "Delivered", className: "bg-success/15 text-success" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const s = MAP[status as OrderStatus] || { label: status.replace(/_/g, " "), className: "bg-secondary text-secondary-foreground" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        s.className,
        className,
      )}
    >
      {s.label}
    </span>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "success" | "brand" | "info";
}) {
  const tones = {
    muted: "bg-secondary text-secondary-foreground",
    success: "bg-success/15 text-success",
    brand: "bg-brand-soft text-brand-foreground",
    info: "bg-info/15 text-info",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}
