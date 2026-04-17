/**
 * CENTRALIZED PRICING CONFIGURATION
 * 
 * Single source of truth for all package prices and regional markups
 * All pages (destination, booking, etc) fetch prices from here
 */

// Currency pricing with markup percentages
export type CurrencyConfig = {
  currencyCode: string; // "INR", "USD", "EUR", etc.
  name: string;
  markupPercent: number; // Percentage markup - 0% for India, 50% for all others
};

// All supported currencies with their markup
// India (INR) = 0% markup (base price)
// All other countries = 50% markup
export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  INR: { currencyCode: "INR", name: "Indian Rupee", markupPercent: 0 },
  USD: { currencyCode: "USD", name: "United States Dollar", markupPercent: 50 },
  EUR: { currencyCode: "EUR", name: "Euro", markupPercent: 50 },
  GBP: { currencyCode: "GBP", name: "British Pound", markupPercent: 50 },
  AED: { currencyCode: "AED", name: "United Arab Emirates Dirham", markupPercent: 50 },
  SGD: { currencyCode: "SGD", name: "Singapore Dollar", markupPercent: 50 },
  AUD: { currencyCode: "AUD", name: "Australian Dollar", markupPercent: 50 },
  CAD: { currencyCode: "CAD", name: "Canadian Dollar", markupPercent: 50 },
  JPY: { currencyCode: "JPY", name: "Japanese Yen", markupPercent: 50 },
  CNY: { currencyCode: "CNY", name: "Chinese Yuan", markupPercent: 50 },
  CHF: { currencyCode: "CHF", name: "Swiss Franc", markupPercent: 50 },
  HKD: { currencyCode: "HKD", name: "Hong Kong Dollar", markupPercent: 50 },
  NZD: { currencyCode: "NZD", name: "New Zealand Dollar", markupPercent: 50 },
  SEK: { currencyCode: "SEK", name: "Swedish Krona", markupPercent: 50 },
  NOK: { currencyCode: "NOK", name: "Norwegian Krone", markupPercent: 50 },
  DKK: { currencyCode: "DKK", name: "Danish Krone", markupPercent: 50 },
  ZAR: { currencyCode: "ZAR", name: "South African Rand", markupPercent: 50 },
  THB: { currencyCode: "THB", name: "Thai Baht", markupPercent: 50 },
  MYR: { currencyCode: "MYR", name: "Malaysian Ringgit", markupPercent: 50 },
  IDR: { currencyCode: "IDR", name: "Indonesian Rupiah", markupPercent: 50 },
  LKR: { currencyCode: "LKR", name: "Sri Lankan Rupee", markupPercent: 50 },
  BHD: { currencyCode: "BHD", name: "Bahraini Dinar", markupPercent: 50 },
  QAR: { currencyCode: "QAR", name: "Qatari Riyal", markupPercent: 50 },
  OMR: { currencyCode: "OMR", name: "Omani Rial", markupPercent: 50 },
  KWD: { currencyCode: "KWD", name: "Kuwaiti Dinar", markupPercent: 50 },
};

// Package pricing configuration
export type PackagePricingConfig = {
  slug: string;
  name: string;
  basePriceINR: number; // Base price in INR (used for India + calculation base for others)
  oldPriceINR?: number; // Original price (for showing discount)
  bikes: {
    id: string;
    name: string;
    seatingPrices: {
      solo: number;
      "dual-sharing": number;
      "seat-in-backup": number;
    };
  }[];
};

// All packages pricing
export const PACKAGE_PRICING: Record<string, PackagePricingConfig> = {
  "trans-himalayan-ride": {
    slug: "trans-himalayan-ride",
    name: "Trans Himalayan Ride",
    basePriceINR: 30999,
    oldPriceINR: 64460,
    bikes: [
      {
        id: "classic-350",
        name: "Royal Enfield Classic 350",
        seatingPrices: {
          solo: 53459,
          "dual-sharing": 41689,
          "seat-in-backup": 30799,
        },
      },
      {
        id: "himalayan-411",
        name: "Royal Enfield Himalayan 411",
        seatingPrices: {
          solo: 55109,
          "dual-sharing": 42679,
          "seat-in-backup": 30799,
        },
      },
      {
        id: "himalayan-452",
        name: "Royal Enfield Himalayan 452",
        seatingPrices: {
          solo: 68474,
          "dual-sharing": 49279,
          "seat-in-backup": 30799,
        },
      },
      {
        id: "seat-in-backup",
        name: "Seat in Backup",
        seatingPrices: {
          solo: 30799,
          "dual-sharing": 30799,
          "seat-in-backup": 30799,
        },
      },
      {
        id: "own-bike",
        name: "Own Bike",
        seatingPrices: {
          solo: 30799,
          "dual-sharing": 30799,
          "seat-in-backup": 30799,
        },
      },
    ],
  },
  ladakh: {
    slug: "ladakh",
    name: "Ladakh Adventure",
    basePriceINR: 27500,
    oldPriceINR: null,
    bikes: [
      {
        id: "classic-350",
        name: "Royal Enfield Classic 350",
        seatingPrices: {
          solo: 53459,
          "dual-sharing": 41689,
          "seat-in-backup": 30799,
        },
      },
      {
        id: "himalayan-411",
        name: "Royal Enfield Himalayan 411",
        seatingPrices: {
          solo: 55109,
          "dual-sharing": 42679,
          "seat-in-backup": 30799,
        },
      },
      {
        id: "himalayan-452",
        name: "Royal Enfield Himalayan 452",
        seatingPrices: {
          solo: 68474,
          "dual-sharing": 49279,
          "seat-in-backup": 30799,
        },
      },
    ],
  },
};

/**
 * Calculate price with currency markup
 * @param basePrice - Price in INR (base currency)
 * @param currencyCode - Currency code (e.g., "INR", "USD", "GBP")
 * @returns Price with markup applied
 */
export function calculateCurrencyPrice(
  basePrice: number,
  currencyCode: string = "INR"
): number {
  const currencyConfig = CURRENCY_CONFIGS[currencyCode];
  if (!currencyConfig) return basePrice;

  const markupFactor = 1 + currencyConfig.markupPercent / 100;
  return Math.round(basePrice * markupFactor);
}

/**
 * Get package pricing
 */
export function getPackagePricing(packageSlug: string): PackagePricingConfig | null {
  return PACKAGE_PRICING[packageSlug] || null;
}

/**
 * Get bike pricing with seating preference and currency
 */
export function getBikePrice(
  packageSlug: string,
  bikeId: string,
  seatingPreference: "solo" | "dual-sharing" | "seat-in-backup" = "solo",
  currencyCode: string = "INR"
): number {
  const packagePricing = getPackagePricing(packageSlug);
  if (!packagePricing) return 0;

  const bike = packagePricing.bikes.find((b) => b.id === bikeId);
  if (!bike) return packagePricing.basePriceINR;

  const basePrice = bike.seatingPrices[seatingPreference] || packagePricing.basePriceINR;
  return calculateCurrencyPrice(basePrice, currencyCode);
}
