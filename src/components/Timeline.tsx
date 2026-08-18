import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGES, stageIndex } from "@/services/shipmentService";
import type { ShipmentStage, TrackingEvent } from "@/lib/types";

export function StageTimeline({
  stage,
  variant = "seller",
}: {
  stage: ShipmentStage;
  variant?: "seller" | "buyer";
}) {
  const current = stageIndex(stage);
  return (
    <ol className="space-y-0">
      {STAGES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                  done && "border-success bg-success text-success-foreground",
                  active && "border-brand bg-brand text-brand-foreground",
                  !done && !active && "border-border bg-background text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" /> : active ? "●" : ""}
              </span>
              {i < STAGES.length - 1 && (
                <span className={cn("w-px flex-1", done ? "bg-success/50" : "bg-border")} />
              )}
            </div>
            <div className={cn("pb-6", i === STAGES.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "text-sm",
                  done || active ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {variant === "buyer" ? s.buyerLabel : s.label}
              </p>
              {active && <p className="text-xs text-muted-foreground">In progress</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function EventList({ events }: { events: TrackingEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No tracking events yet.</p>;
  }
  return (
    <ul className="space-y-4">
      {events
        .slice()
        .reverse()
        .map((e, i) => (
          <li key={`${e.date}-${e.label}-${i}`} className="flex gap-4">
            <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">{e.date}</span>
            <span className="text-sm text-foreground">
              {e.label}
              {e.location && <span className="text-muted-foreground"> · {e.location}</span>}
            </span>
          </li>
        ))}
    </ul>
  );
}
