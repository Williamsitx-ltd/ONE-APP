/**
 * Phase 3 page code example.
 *
 * This page demonstrates the entitlement gate.
 * The final booking action must use the Phase 1 architecture decision:
 * native Wix flow where sufficient, custom flow only where necessary.
 */

import { checkBookingEntitlement } from "backend/entitlements.web";

export async function preflightBooking({ memberId, serviceId }) {
  const result = await checkBookingEntitlement({ memberId, serviceId });

  if (!result.allowed) {
    return {
      ok: false,
      message: friendlyReason(result.reason, result.expectedDuration)
    };
  }

  return {
    ok: true,
    remaining: result.remaining,
    unlimited: Boolean(result.unlimited),
    cycleEnd: result.cycleEnd
  };
}

function friendlyReason(reason, expectedDuration) {
  switch (reason) {
    case "NO_ACTIVE_PLAN":
      return "You need an active ONE membership before booking this session.";
    case "WRONG_CHECKIN_DURATION":
      return `Your membership includes a ${expectedDuration}-minute ONE-to-ONE check-in.`;
    case "MONTHLY_ALLOWANCE_USED":
      return "You have used this month’s included allowance.";
    case "SERVICE_NOT_INCLUDED":
      return "This service is not included in your current membership.";
    default:
      return "This booking cannot be confirmed yet. Please contact the ONE Team.";
  }
}
