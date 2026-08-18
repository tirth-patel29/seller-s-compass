import { delay, getState, setState, uid } from "./db";
import type { Shipment, ShipmentStage } from "@/lib/types";

export const STAGES: { key: ShipmentStage; label: string; buyerLabel: string }[] = [
  { key: "order_confirmed", label: "Order Confirmed", buyerLabel: "Order Confirmed" },
  { key: "export_processing", label: "Export Processing", buyerLabel: "Export Processing" },
  { key: "dnk_submitted", label: "DNK Submitted", buyerLabel: "DNK Processing" },
  { key: "customs", label: "Customs Processing", buyerLabel: "Customs" },
  { key: "dispatched", label: "Dispatched", buyerLabel: "Dispatched" },
  { key: "in_transit", label: "In Transit", buyerLabel: "International Transit" },
  { key: "delivered", label: "Delivered", buyerLabel: "Delivered" },
];

export const stageIndex = (stage: ShipmentStage) => STAGES.findIndex((s) => s.key === stage);

const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

/** Shipment service — swap for Supabase `shipments` / `tracking_events`. */
export const shipmentService = {
  getByOrder(orderId: string): Shipment | undefined {
    return getState().shipments.find((s) => s.orderId === orderId);
  },

  async getTracking(shipmentId: string): Promise<Shipment | undefined> {
    await delay(300);
    return getState().shipments.find((s) => s.id === shipmentId);
  },

  async createShipment(orderId: string, exportOrderId: string, dnk: string): Promise<Shipment> {
    const existing = shipmentService.getByOrder(orderId);
    if (existing) return existing;
    const now = new Date();
    const eta = new Date(now);
    eta.setDate(eta.getDate() + 9);
    const shipment: Shipment = {
      id: uid("SHP"),
      orderId,
      exportOrderId,
      trackingId: `IN${Math.floor(100000000 + Math.random() * 899999999)}IN`,
      destination: getState().orders.find((o) => o.id === orderId)?.destinationCountry ?? "International",
      stage: "dnk_submitted",
      eta: eta.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      events: [
        { date: fmt(now), label: "Order confirmed", location: "ExportSetu" },
        { date: fmt(now), label: "Export details completed", location: "Seller" },
        { date: fmt(now), label: "DNK submission created", location: dnk },
      ],
    };
    setState((s) => ({ ...s, shipments: [shipment, ...s.shipments] }));
    return shipment;
  },

  /** Demo helper: advance the shipment to the next tracking stage. */
  async advance(shipmentId: string): Promise<void> {
    await delay(600);
    setState((s) => ({
      ...s,
      shipments: s.shipments.map((sh) => {
        if (sh.id !== shipmentId) return sh;
        const next = STAGES[Math.min(stageIndex(sh.stage) + 1, STAGES.length - 1)]!;
        if (next.key === sh.stage) return sh;
        return {
          ...sh,
          stage: next.key,
          events: [
            ...sh.events,
            { date: fmt(new Date()), label: next.label, location: sh.destination },
          ],
        };
      }),
      orders: s.orders.map((o) => {
        const sh = s.shipments.find((x) => x.id === shipmentId);
        if (!sh || o.id !== sh.orderId) return o;
        const next = STAGES[Math.min(stageIndex(sh.stage) + 1, STAGES.length - 1)]!.key;
        const map: Partial<Record<string, typeof o.status>> = {
          customs: "customs",
          dispatched: "in_transit",
          in_transit: "in_transit",
          delivered: "delivered",
        };
        return { ...o, status: map[next] ?? o.status };
      }),
    }));
  },
};
