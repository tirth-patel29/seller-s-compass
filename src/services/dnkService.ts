import { delay, getState, setState } from "./db";
import { shipmentService } from "./shipmentService";
import type { ExportOrder, Shipment } from "@/lib/types";

export interface DnkResponse {
  pbeRef: string;
  dnk: string;
  status: "Submitted";
  customs: "Pending";
  shipment: "Preparing";
  shipmentId: string;
}

/**
 * SIMULATED DNK integration.
 *
 * This is a prototype stub. A production deployment would call authorised
 * government APIs from a trusted server environment; nothing here reaches any
 * official system.
 */
export const dnkService = {
  centres(): string[] {
    return ["Anand DNK", "Ahmedabad DNK", "Jaipur DNK", "Kolkata DNK", "Chennai DNK"];
  },

  async submitExport(orderId: string, dnk: string): Promise<DnkResponse> {
    await delay(1600);
    const pbeRef = `DNK2026${Math.floor(1000 + Math.random() * 8999)}`;
    const exportOrder = getState().exportOrders.find((e) => e.orderId === orderId);
    if (!exportOrder) throw new Error("Export request not found for this order.");

    const patched: ExportOrder = {
      ...exportOrder,
      dnk,
      pbeRef,
      status: "submitted",
      submittedAt: new Date().toISOString(),
    };

    setState((s) => ({
      ...s,
      exportOrders: s.exportOrders.map((e) => (e.orderId === orderId ? patched : e)),
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, status: "dnk_submitted" } : o)),
    }));

    const shipment: Shipment = await shipmentService.createShipment(orderId, patched.id, dnk);

    return {
      pbeRef,
      dnk,
      status: "Submitted",
      customs: "Pending",
      shipment: "Preparing",
      shipmentId: shipment.id,
    };
  },
};
