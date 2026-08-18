import { delay } from "./db";

export interface ListingInput {
  name: string;
  category: string;
  description: string;
  origin: string;
}

export interface GeneratedListing {
  title: string;
  description: string;
  keywords: string[];
  highlights: string[];
  category: string;
}

/**
 * AI abstraction.
 *
 * Today this returns a deterministic mock listing. To connect a real provider,
 * replace the body of `generateProductListing` with a server-side call (never
 * call a provider with a key from the browser) and keep the same return shape.
 */
export const aiService = {
  async generateProductListing(input: ListingInput): Promise<GeneratedListing> {
    await delay(1200);
    const base = input.name.trim() || "Handcrafted Indian Product";
    const origin = input.origin.trim() || "India";
    const category = input.category || "Handicrafts";

    return {
      title: `${base} — Handmade in ${origin.split(",")[0] ?? origin}`,
      description:
        `${base} is handmade by skilled artisans in ${origin}. ` +
        `Each piece is produced in small batches using traditional techniques passed down through generations, ` +
        `so slight variations in pattern and finish are part of its character. ` +
        (input.description.trim()
          ? `${input.description.trim()} `
          : "") +
        `Carefully packed for international delivery and shipped with full origin declaration and end-to-end tracking.`,
      keywords: [
        base.toLowerCase(),
        `handmade ${category.toLowerCase()}`,
        `indian ${category.toLowerCase()}`,
        `${(origin.split(",")[0] ?? origin).toLowerCase()} craft`,
        "artisan made",
        "fair trade gift",
      ],
      highlights: [
        "Handmade by verified Indian artisans",
        "Small-batch production, no two pieces identical",
        "Origin declared for international customs",
        "Ships worldwide with tracking",
      ],
      category,
    };
  },
};
