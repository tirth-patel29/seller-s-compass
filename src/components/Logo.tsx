import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import dnkLogo from "@/assets/dnk.png";

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}
      aria-label="DNK home"
    >
      <img 
        src={dnkLogo} 
        alt="DNK Logo" 
        className="h-8 w-auto object-contain"
      />
    </Link>
  );
}

