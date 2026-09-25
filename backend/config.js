/**
 * Shared trusted backend configuration for ONE by IWC.
 * Replace placeholder Wix IDs after Phase 1 configuration.
 */

/**
 * Phase 1 / Phase 3
 * Canonical ONE membership entitlement rules.
 *
 * IMPORTANT:
 * These rules describe IWC's intended offer.
 * They do not prove Wix Pricing Plans + Bookings enforce them natively.
 */

export const ONE_PLANS = Object.freeze({
  BRONZE: {
    key: "BRONZE",
    name: "Bronze",
    monthlyPriceGBP: 15,
    oneToOne: { durationMinutes: 20, monthlyQuantity: 1 },
    liveSessions: { unlimited: false, monthlyQuantity: 1 }
  },
  SILVER: {
    key: "SILVER",
    name: "Silver",
    monthlyPriceGBP: 25,
    oneToOne: { durationMinutes: 30, monthlyQuantity: 1 },
    liveSessions: { unlimited: false, monthlyQuantity: 2 }
  },
  GOLD: {
    key: "GOLD",
    name: "Gold",
    monthlyPriceGBP: 35,
    oneToOne: { durationMinutes: 20, monthlyQuantity: 2 },
    liveSessions: { unlimited: true, monthlyQuantity: null }
  },
  PLATINUM: {
    key: "PLATINUM",
    name: "Platinum",
    monthlyPriceGBP: 50,
    oneToOne: { durationMinutes: 30, monthlyQuantity: 2 },
    liveSessions: { unlimited: true, monthlyQuantity: null }
  }
});

export function getPlanRule(planKey) {
  const rule = ONE_PLANS[planKey];
  if (!rule) throw new Error(`Unknown ONE plan: ${planKey}`);
  return rule;
}

/**
 * Replace these placeholders after the Phase 1 Wix configuration is created.
 * Keep plan/service IDs here rather than scattering them through page code.
 */
export const WIX_IDS = Object.freeze({
  plans: {
    BRONZE: "REPLACE_WITH_WIX_PLAN_ID",
    SILVER: "REPLACE_WITH_WIX_PLAN_ID",
    GOLD: "REPLACE_WITH_WIX_PLAN_ID",
    PLATINUM: "REPLACE_WITH_WIX_PLAN_ID"
  },
  services: {
    CHECKIN_20: "REPLACE_WITH_WIX_BOOKINGS_SERVICE_ID",
    CHECKIN_30: "REPLACE_WITH_WIX_BOOKINGS_SERVICE_ID",
    LIVE_SESSION: "REPLACE_WITH_WIX_BOOKINGS_SERVICE_ID"
  }
});
