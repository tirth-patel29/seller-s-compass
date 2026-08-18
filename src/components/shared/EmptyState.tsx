import { Link } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";

export function EmptyState({ title, description, actionText, actionUrl }: { title: string; description: string; actionText?: string; actionUrl?: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center bg-surface">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary">
        <FolderOpen className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionText && actionUrl && (
        <Link
          to={actionUrl as any}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
