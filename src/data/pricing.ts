/**
 * CENTRALIZED PRICING CONFIGURATION
 * 
 * Single source of truth for all package prices and regional markups
 * All pages (destination, booking, etc) fetch prices from here
 */

// Regional pricing with markup percentages
export type RegionConfig = {
  code: string; // Country code: "IN", "US", "GB", etc.
  name: string;
  currency: string;
  markupPercent: number; // Percentage markup for non-Indian regions
};

export const REGION_CONFIGS: Record<string, RegionConfig> = {
  IN: {
    code: "IN",
    name: "India",
    currency: "INR",
    markupPercent: 0, // No markup for India - base price
  },
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    markupPercent: 50, // 50% markup for USA
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    markupPercent: 50,
  },
  AU: {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    markupPercent: 50,
  },
  CA: {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    markupPercent: 50,
  },
  EU: {
    code: "EU",
    name: "Europe",
    currency: "EUR",
    markupPercent: 50,
  },
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
 * Calculate price with regional markup
 * @param basePrice - Price in INR
 * @param regionCode - Country code (e.g., "IN", "US", "GB")
 * @returns Price with markup applied
 */
export function calculateRegionalPrice(
  basePrice: number,
  regionCode: string = "IN"
): number {
  const region = REGION_CONFIGS[regionCode];
  if (!region) return basePrice;

  const markupFactor = 1 + region.markupPercent / 100;
  return Math.round(basePrice * markupFactor);
}

/**
 * Get package pricing
 */
export function getPackagePricing(packageSlug: string): PackagePricingConfig | null {
  return PACKAGE_PRICING[packageSlug] || null;
}

/**
 * Get bike pricing with seating preference
 */
export function getBikePrice(
  packageSlug: string,
  bikeId: string,
  seatingPreference: "solo" | "dual-sharing" | "seat-in-backup" = "solo",
  regionCode: string = "IN"
): number {
  const packagePricing = getPackagePricing(packageSlug);
  if (!packagePricing) return 0;

  const bike = packagePricing.bikes.find((b) => b.id === bikeId);
  if (!bike) return packagePricing.basePriceINR;

  const basePrice = bike.seatingPrices[seatingPreference] || packagePricing.basePriceINR;
  return calculateRegionalPrice(basePrice, regionCode);
}
