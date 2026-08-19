export interface ShippingQuoteInput {
  originCountry: string;
  destinationCountry: string;
  weightKg: number;
  productValueINR: number;
}

export interface ShippingServiceOption {
  id: string;
  serviceName: string;
  basePostageINR: number;
  estimatedDelivery: string;
  tracking: boolean;
}

export interface ShippingQuote {
  options: ShippingServiceOption[];
  dutiesINR: number; // Destination-country tax/duty
}

/**
 * Prototype Shipping Quote Service
 * Provides mock shipping quotes and duty estimates for the DNK demonstration.
 * Later, this should be replaced with live India Post official API rates.
 */
export const shippingQuoteService = {
  getQuote(input: ShippingQuoteInput): ShippingQuote {
    const { destinationCountry, productValueINR } = input;
    
    // Default fallback prototype duty
    let dutiesINR = Math.round(productValueINR * 0.1); 
    
    // Prototype rules for USA
    if (destinationCountry === "United States") {
      dutiesINR = Math.round(productValueINR * 0.5); // 50% for prototype US DDP demo
    }

    const options: ShippingServiceOption[] = [
      {
        id: "ems",
        serviceName: "India Post EMS",
        basePostageINR: 2100, // Fixed at 2100 for prototype
        estimatedDelivery: "8–14 days",
        tracking: true,
      },
      {
        id: "iap",
        serviceName: "India Post International Parcel",
        basePostageINR: 1650,
        estimatedDelivery: "15–20 days",
        tracking: true,
      }
    ];

    return {
      options,
      dutiesINR
    };
  }
};
