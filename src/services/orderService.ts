import { delay, getState, setState } from "./db";
import { exportService } from "./exportService";
import { currencyService } from "./currencyService";
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
  shippingOptionId: string;
  shippingAmountINR: number;
  dutyAmountINR: number;
  buyerCurrency: string;
}

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
    const fees = Math.round(subtotal * 0.05); // Platform fee INR
    
    // Import currencyService here inside the file or dynamically
    // Actually, let's just pass exchange rate down or require the currencyService in the file.
    
    // Total in INR (for backwards compatibility/seller display)
    const totalINR = subtotal + input.shippingAmountINR + input.dutyAmountINR + fees;
    
    const exchangeRate = currencyService.getRateFromINR(input.buyerCurrency);
    const buyerAmount = currencyService.convertFromINR(subtotal, input.buyerCurrency);
    const totalBuyerCurrency = currencyService.convertFromINR(totalINR, input.buyerCurrency);
    
    const order: Order = {
      id: nextOrderId(),
      productId: input.product.id,
      sellerId: input.product.sellerId,
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      destinationCountry: input.destinationCountry,
      address: input.address,
      quantity: input.quantity,
      
      // Base product
      unitPrice: input.product.price,
      
      // Multi-currency support
      sellerAmount: subtotal,
      sellerCurrency: "INR",
      buyerAmount,
      buyerCurrency: input.buyerCurrency,
      exchangeRate,
      
      shippingAmount: input.shippingAmountINR,
      shippingCurrency: "INR",
      dutyAmount: input.dutyAmountINR,
      dutyCurrency: "INR",
      platformFee: fees,
      platformFeeCurrency: "INR",
      
      // Backwards compatible fields
      shipping: input.shippingAmountINR,
      fees,
      total: totalINR,
      
      totalBuyerCurrency,

      status: "export_pending",
      createdAt: new Date().toISOString(),
    };
    
    setState((s) => ({ ...s, orders: [order, ...s.orders] }));
    // Every international order immediately becomes an export workflow item.
    await exportService.ensureExportOrder(order.id);
    return order;
  },
};
