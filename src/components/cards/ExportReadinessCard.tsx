import { Link } from "@tanstack/react-router";
import { CheckCircle2, AlertCircle, ChevronRight, CheckCircle } from "lucide-react";
import type { ExportOrder } from "@/lib/types";

export function ExportReadinessCard({ exportOrder }: { exportOrder: ExportOrder }) {
  const checklist = exportOrder.checklist;
  const total = Object.keys(checklist).length;
  const completed = Object.values(checklist).filter(Boolean).length;
  const percentage = Math.round((completed / total) * 100);

  const getStatus = () => {
    if (exportOrder.status === "cleared") return { text: "Cleared Customs", color: "text-success", icon: CheckCircle };
    if (exportOrder.status === "customs") return { text: "In Customs", color: "text-primary", icon: AlertCircle };
    if (exportOrder.status === "submitted") return { text: "Submitted to DNK", color: "text-primary", icon: CheckCircle2 };
    if (percentage === 100) return { text: "Ready for DNK", color: "text-success", icon: CheckCircle2 };
    return { text: "Incomplete", color: "text-amber-500", icon: AlertCircle };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Order #{exportOrder.orderId}</h3>
        <span className={`flex items-center gap-1 text-sm font-medium ${status.color}`}>
          <status.icon className="size-4" /> {status.text}
        </span>
      </div>
      
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Export Readiness</span>
          <span className="font-semibold">{percentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className={`h-full transition-all duration-500 ${percentage === 100 ? 'bg-success' : 'bg-primary'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {completed} of {total} requirements met
        </p>
      </div>

      <div className="mt-2 text-right">
        <Link
          to="/seller/orders/$id/export"
          params={{ id: exportOrder.orderId }}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {percentage === 100 && exportOrder.status === "draft" ? "Submit to DNK" : "View Export Details"}
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
