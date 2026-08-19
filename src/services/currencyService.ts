/**
 * Prototype Currency Service
 * Hardcoded prototype exchange rates for the DNK demonstration.
 */

const RATES: Record<string, number> = {
  USD: 95.70, // 1 USD = 95.70 INR
  GBP: 118.50,
  EUR: 102.20,
  CAD: 70.30,
  AUD: 62.10,
  INR: 1.0,
};

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  "United States": "USD",
  "United Kingdom": "GBP",
  "Germany": "EUR",
  "France": "EUR",
  "Canada": "CAD",
  "Australia": "AUD",
  "India": "INR",
};

export const currencyService = {
  /** Gets the currency code for a given destination country */
  getCurrencyForCountry(country: string): string {
    return COUNTRY_CURRENCY_MAP[country] || "USD";
  },

  /** Gets the exchange rate from INR to target currency */
  getRateFromINR(targetCurrency: string): number {
    const rateToINR = RATES[targetCurrency] || RATES["USD"] || 95.70;
    return 1 / rateToINR;
  },

  /** Convert INR to target currency */
  convertFromINR(amountINR: number, targetCurrency: string): number {
    if (targetCurrency === "INR") return amountINR;
    const rateToINR = RATES[targetCurrency] || RATES["USD"] || 95.70;
    return amountINR / rateToINR;
  },

  /** Format a number as a currency string */
  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  },

  /** Get the prototype rate to display (e.g., 95.70 for USD) */
  getDisplayRate(currency: string): number {
    return RATES[currency] || RATES["USD"] || 95.70;
  }
};
