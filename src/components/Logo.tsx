import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}
      aria-label="DNK home"
    >
      <span
        className={cn(
          "grid size-8 place-items-center rounded-lg text-sm font-bold",
          invert ? "bg-brand text-brand-foreground" : "bg-primary text-primary-foreground",
        )}
        aria-hidden="true"
      >
        ES
      </span>
      <span className={cn("text-lg", invert && "text-primary-foreground")}>
        Export<span className="text-brand">Setu</span>
      </span>
    </Link>
  );
}

