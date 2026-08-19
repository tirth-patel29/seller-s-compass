import { MapPin } from "lucide-react";
import { Pill } from "@/components/StatusBadge";
import type { DNKLocation } from "@/lib/types";

export function DNKCard({ 
  location, 
  onClick 
}: { 
  location: DNKLocation; 
  onClick: () => void; 
}) {
  const getStatusTone = (status: string) => {
    switch (status) {
      case "verified": return "success";
      case "verification_required": return "brand";
      case "historical": return "muted";
      default: return "muted";
    }
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{location.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin className="size-3.5" />
            {location.city}, {location.state === "Union Territory" ? location.state : "Gujarat"}
          </p>
        </div>
        <Pill tone="muted">{location.postOfficeType}</Pill>
      </div>
      
      <div className="space-y-3 mt-1 flex-1">
        <div className="text-sm">
          <span className="text-muted-foreground mr-2">Mapped FPO:</span>
          <span className="font-medium">{location.mappedFpo}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {location.services.map(service => (
            <span key={service} className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground border border-border/50">
              {service}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <Pill tone={getStatusTone(location.verificationStatus)}>
            {formatStatus(location.verificationStatus)}
          </Pill>
        </div>
        
        <button 
          onClick={onClick}
          className="text-sm font-medium text-primary hover:underline underline-offset-4 focus:outline-none"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
