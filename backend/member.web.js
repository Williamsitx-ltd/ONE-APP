/**
 * Phase 2 — Joining and My ONE
 *
 * Aggregates the current member's active Pricing Plan order.
 * Use Wix's native My Bookings / My Subscriptions pages where they already
 * satisfy the journey, rather than rebuilding them without evidence.
 */

import { Permissions, webMethod } from "@wix/web-methods";
import { orders } from "@wix/pricing-plans";
import wixData from "wix-data";

const PREFS_COLLECTION = "ONE_MemberPreferences";

export const getMyOneSummary = webMethod(
  Permissions.SiteMember,
  async () => {
    const response = await orders.memberListOrders({
      orderStatuses: ["ACTIVE", "PAUSED"],
      limit: 50,
      fieldSet: "BASIC"
    });

    const order = (response.orders || [])[0] || null;

    return {
      hasPlan: Boolean(order),
      order: order ? {
        id: order._id,
        planId: order.planId || order.plan?._id || null,
        status: order.status || null,
        startDate: order.startDate || null,
        endDate: order.endDate || null,
        autoRenewCanceled: order.autoRenewCanceled || false
      } : null
    };
  }
);

export const saveMemberPreferences = webMethod(
  Permissions.SiteMember,
  async ({ memberId, interests = [], onboardingSkipped = false }) => {
    if (!memberId) throw new Error("memberId is required");

    const existing = await wixData.query(PREFS_COLLECTION)
      .eq("memberId", memberId)
      .limit(1)
      .find({ suppressAuth: true });

    const current = existing.items[0];

    const payload = {
      ...(current || {}),
      memberId,
      interests,
      onboardingSkipped,
      updatedAt: new Date()
    };

    return wixData.save(PREFS_COLLECTION, payload, { suppressAuth: true });
  }
);
