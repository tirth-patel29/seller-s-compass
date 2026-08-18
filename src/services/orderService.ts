import { delay, getState, setState } from "./db";
import { exportService } from "./exportService";
import type { Order, Product } from "@/lib/types";

const nextOrderId = () => {
  const nums = getState()
    .orders.map((o) => Number(o.id.replace("ORD-", "")))
    .filter((n) => !Number.isNaN(n));
  return `ORD-${Math.max(10240, ...nums) + 1}`;
};

export interface CheckoutInput {
  product: Product;
  quantity: number;
  buyerName: string;
  buyerEmail: string;
  destinationCountry: string;
  address: string;
}

export const SHIPPING_FLAT = 850;

/** Order service — swap for Supabase `orders` / `order_items` queries. */
export const orderService = {
  async list(): Promise<Order[]> {
    await delay(200);
    return getState().orders;
  },

  async getById(id: string): Promise<Order | undefined> {
    await delay(150);
    return getState().orders.find((o) => o.id === id);
  },

  async createOrder(input: CheckoutInput): Promise<Order> {
    await delay(900);
    const subtotal = input.product.price * input.quantity;
    const fees = Math.round(subtotal * 0.05);
    const order: Order = {
      id: nextOrderId(),
      productId: input.product.id,
      sellerId: input.product.sellerId,
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      destinationCountry: input.destinationCountry,
      address: input.address,
      quantity: input.quantity,
      unitPrice: input.product.price,
      shipping: SHIPPING_FLAT,
      fees,
      total: subtotal + SHIPPING_FLAT + fees,
      status: "export_pending",
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, orders: [order, ...s.orders] }));
    // Every international order immediately becomes an export workflow item.
    await exportService.ensureExportOrder(order.id);
    return order;
  },
};
