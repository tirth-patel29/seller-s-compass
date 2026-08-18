import { Link } from "@tanstack/react-router";
import { Box, Plane, CheckCircle2, ChevronRight, Truck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { Shipment } from "@/lib/types";

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const getIcon = () => {
    switch (shipment.stage) {
      case "delivered": return <CheckCircle2 className="size-5 text-success" />;
      case "in_transit": return <Plane className="size-5 text-primary" />;
      case "dispatched": return <Truck className="size-5 text-primary" />;
      default: return <Box className="size-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated sm:flex-row sm:items-center">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/50">
        {getIcon()}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{shipment.trackingId}</span>
          <StatusBadge status={shipment.stage} />
        </div>
        <p className="text-sm text-foreground">
          Destination: <span className="font-medium">{shipment.destination}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          ETA: {shipment.eta}
        </p>
      </div>
      <div className="mt-2 sm:mt-0">
        <Link
          to="/seller/shipments/$id"
          params={{ id: shipment.id }}
          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          Track <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
