import { delay, getState, setState, uid } from "./db";
import type { Product } from "@/lib/types";

export type NewProduct = Omit<Product, "id" | "views" | "createdAt">;

/** Product service — swap the store calls for Supabase `products` queries. */
export const productService = {
  async list(): Promise<Product[]> {
    await delay(200);
    return getState().products;
  },

  async getById(id: string): Promise<Product | undefined> {
    await delay(150);
    return getState().products.find((p) => p.id === id);
  },

  async createProduct(input: NewProduct): Promise<Product> {
    await delay(500);
    const product: Product = {
      ...input,
      id: uid("prd"),
      views: 0,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, products: [product, ...s.products] }));
    return product;
  },

  async updateProduct(id: string, patch: Partial<Product>): Promise<void> {
    await delay(400);
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(300);
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
  },
};
