/**
 * Phase 1 + Phase 3
 * Backend entitlement engine.
 *
 * Uses @wix/web-methods, documented for backend .web.js files.
 * Wire this to your actual member identity and Wix plan/service IDs after
 * completing the Phase 1 feasibility proof.
 */

import { Permissions, webMethod } from "@wix/web-methods";
import { orders } from "@wix/pricing-plans";
import wixData from "wix-data";
import { ONE_PLANS, WIX_IDS } from "./config.js";

const USAGE_COLLECTION = "ONE_UsageLedger";

function planKeyFromPlanId(planId) {
  const entry = Object.entries(WIX_IDS.plans).find(([, id]) => id === planId);
  return entry ? entry[0] : null;
}

function classifyBenefit(serviceId) {
  if (serviceId === WIX_IDS.services.CHECKIN_20) {
    return { benefitType: "ONE_TO_ONE", durationMinutes: 20 };
  }
  if (serviceId === WIX_IDS.services.CHECKIN_30) {
    return { benefitType: "ONE_TO_ONE", durationMinutes: 30 };
  }
  if (serviceId === WIX_IDS.services.LIVE_SESSION) {
    return { benefitType: "LIVE_SESSION", durationMinutes: null };
  }
  return null;
}

async function getActiveMemberPlan() {
  const response = await orders.memberListOrders({
    orderStatuses: ["ACTIVE"],
    limit: 50,
    fieldSet: "BASIC"
  });

  const active = (response.orders || [])[0];
  if (!active) return null;

  const planId = active.planId || active.plan?._id || active.plan?.id;
  const planKey = planKeyFromPlanId(planId);

  if (!planKey) {
    throw new Error("Active Wix plan is not mapped in config/ids.js");
  }

  return {
    planKey,
    orderId: active._id,
    startDate: active.startDate || active._createdDate,
    endDate: active.endDate || null
  };
}

function billingCycleForDate(startDate, now = new Date()) {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) throw new Error("Invalid plan start date");

  let cycleStart = new Date(start);
  while (true) {
    const next = new Date(cycleStart);
    next.setMonth(next.getMonth() + 1);
    if (next > now) {
      return { cycleStart, cycleEnd: next };
    }
    cycleStart = next;
  }
}

async function countUsage(memberId, benefitType, cycleStart, cycleEnd) {
  const result = await wixData.query(USAGE_COLLECTION)
    .eq("memberId", memberId)
    .eq("benefitType", benefitType)
    .eq("status", "ACTIVE")
    .ge("cycleStart", cycleStart)
    .lt("cycleEnd", cycleEnd)
    .find({ suppressAuth: true });

  return result.items.length;
}

function evaluateRule(planKey, benefit, used) {
  const plan = ONE_PLANS[planKey];
  if (!plan) return { allowed: false, reason: "UNKNOWN_PLAN" };

  if (benefit.benefitType === "ONE_TO_ONE") {
    if (plan.oneToOne.durationMinutes !== benefit.durationMinutes) {
      return {
        allowed: false,
        reason: "WRONG_CHECKIN_DURATION",
        expectedDuration: plan.oneToOne.durationMinutes
      };
    }

    return {
      allowed: used < plan.oneToOne.monthlyQuantity,
      reason: used < plan.oneToOne.monthlyQuantity ? "OK" : "MONTHLY_ALLOWANCE_USED",
      remaining: Math.max(plan.oneToOne.monthlyQuantity - used, 0)
    };
  }

  if (benefit.benefitType === "LIVE_SESSION") {
    if (plan.liveSessions.unlimited) {
      return { allowed: true, reason: "OK", remaining: null, unlimited: true };
    }

    return {
      allowed: used < plan.liveSessions.monthlyQuantity,
      reason: used < plan.liveSessions.monthlyQuantity ? "OK" : "MONTHLY_ALLOWANCE_USED",
      remaining: Math.max(plan.liveSessions.monthlyQuantity - used, 0),
      unlimited: false
    };
  }

  return { allowed: false, reason: "UNKNOWN_BENEFIT" };
}

export const checkBookingEntitlement = webMethod(
  Permissions.SiteMember,
  async ({ memberId, serviceId, nowIso }) => {
    if (!memberId || !serviceId) throw new Error("memberId and serviceId are required");

    const benefit = classifyBenefit(serviceId);
    if (!benefit) return { allowed: false, reason: "SERVICE_NOT_INCLUDED" };

    const activePlan = await getActiveMemberPlan();
    if (!activePlan) return { allowed: false, reason: "NO_ACTIVE_PLAN" };

    const now = nowIso ? new Date(nowIso) : new Date();
    const { cycleStart, cycleEnd } = billingCycleForDate(activePlan.startDate, now);

    const used = await countUsage(
      memberId,
      benefit.benefitType,
      cycleStart,
      cycleEnd
    );

    return {
      ...evaluateRule(activePlan.planKey, benefit, used),
      planKey: activePlan.planKey,
      benefitType: benefit.benefitType,
      used,
      cycleStart,
      cycleEnd
    };
  }
);

export const recordBookingConsumption = webMethod(
  Permissions.SiteMember,
  async ({ memberId, bookingId, serviceId, cycleStart, cycleEnd, planKey }) => {
    if (!memberId || !bookingId || !serviceId || !planKey) {
      throw new Error("Missing booking usage fields");
    }

    const benefit = classifyBenefit(serviceId);
    if (!benefit) throw new Error("Unsupported service");

    const item = {
      memberId,
      planKey,
      benefitType: benefit.benefitType,
      bookingId,
      serviceId,
      cycleStart: new Date(cycleStart),
      cycleEnd: new Date(cycleEnd),
      status: "ACTIVE",
      createdAt: new Date()
    };

    return wixData.insert(USAGE_COLLECTION, item, { suppressAuth: true });
  }
);
