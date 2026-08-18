import { delay, getState, setState, uid } from "./db";
import type { ChecklistKey, ExportOrder } from "@/lib/types";

export const CHECKLIST_LABELS: Record<ChecklistKey, string> = {
  seller: "Seller information",
  product: "Product information",
  destination: "Destination",
  packageInfo: "Package information",
  exportInfo: "Export information",
  documents: "Required documents",
  dnk: "DNK information",
};

export const CHECKLIST_ORDER: ChecklistKey[] = [
  "seller",
  "product",
  "destination",
  "packageInfo",
  "exportInfo",
  "documents",
  "dnk",
];

export const readinessScore = (exp: ExportOrder) => {
  const done = CHECKLIST_ORDER.filter((k) => exp.checklist[k]).length;
  return Math.round((done / CHECKLIST_ORDER.length) * 100);
};

export const readinessLabel = (score: number) =>
  score === 100 ? "Export Ready" : score >= 70 ? "Almost Ready" : "Needs Attention";

/** Export readiness service — swap for Supabase `export_orders` / `documents`. */
export const exportService = {
  getForOrder(orderId: string): ExportOrder | undefined {
    return getState().exportOrders.find((e) => e.orderId === orderId);
  },

  async ensureExportOrder(orderId: string): Promise<ExportOrder> {
    const existing = exportService.getForOrder(orderId);
    if (existing) return existing;
    const exp: ExportOrder = {
      id: uid("EXP"),
      orderId,
      checklist: {
        seller: true,
        product: true,
        destination: true,
        packageInfo: false,
        exportInfo: false,
        documents: false,
        dnk: true,
      },
      packageInfo: { length: "", width: "", height: "", weight: "" },
      exportInfo: { hsCode: "", declaredValue: "", purpose: "" },
      documents: { invoice: false, originDeclaration: false },
      dnk: "Anand DNK",
      status: "draft",
    };
    setState((s) => ({ ...s, exportOrders: [exp, ...s.exportOrders] }));
    return exp;
  },

  async update(orderId: string, patch: Partial<ExportOrder>): Promise<void> {
    await delay(400);
    setState((s) => ({
      ...s,
      exportOrders: s.exportOrders.map((e) =>
        e.orderId === orderId ? { ...e, ...patch, checklist: { ...e.checklist, ...(patch.checklist ?? {}) } } : e,
      ),
    }));
  },
};
