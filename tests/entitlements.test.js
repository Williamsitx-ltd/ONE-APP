import { ONE_PLANS } from "../config/plan-entitlements.js";

function allowed(planKey, type, duration, used) {
  const plan = ONE_PLANS[planKey];

  if (type === "ONE_TO_ONE") {
    if (plan.oneToOne.durationMinutes !== duration) return false;
    return used < plan.oneToOne.monthlyQuantity;
  }

  if (type === "LIVE_SESSION") {
    if (plan.liveSessions.unlimited) return true;
    return used < plan.liveSessions.monthlyQuantity;
  }

  return false;
}

const cases = [
  ["BRONZE", "ONE_TO_ONE", 20, 0, true],
  ["BRONZE", "ONE_TO_ONE", 20, 1, false],
  ["BRONZE", "ONE_TO_ONE", 30, 0, false],
  ["BRONZE", "LIVE_SESSION", null, 0, true],
  ["BRONZE", "LIVE_SESSION", null, 1, false],

  ["SILVER", "ONE_TO_ONE", 30, 0, true],
  ["SILVER", "ONE_TO_ONE", 30, 1, false],
  ["SILVER", "LIVE_SESSION", null, 0, true],
  ["SILVER", "LIVE_SESSION", null, 1, true],
  ["SILVER", "LIVE_SESSION", null, 2, false],

  ["GOLD", "ONE_TO_ONE", 20, 0, true],
  ["GOLD", "ONE_TO_ONE", 20, 1, true],
  ["GOLD", "ONE_TO_ONE", 20, 2, false],
  ["GOLD", "LIVE_SESSION", null, 25, true],

  ["PLATINUM", "ONE_TO_ONE", 30, 0, true],
  ["PLATINUM", "ONE_TO_ONE", 30, 1, true],
  ["PLATINUM", "ONE_TO_ONE", 30, 2, false],
  ["PLATINUM", "LIVE_SESSION", null, 25, true]
];

for (const [plan, type, duration, used, expected] of cases) {
  const actual = allowed(plan, type, duration, used);
  if (actual !== expected) {
    throw new Error(
      `Failed: ${plan} ${type} duration=${duration} used=${used}; expected=${expected}, actual=${actual}`
    );
  }
}

console.log(`Passed ${cases.length} entitlement cases.`);
