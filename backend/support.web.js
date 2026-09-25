/**
 * Phase 5 — Ask the ONE Team
 *
 * Support only. Do not collect emergency, clinical or sensitive coaching
 * information in this general support workflow.
 */

import { Permissions, webMethod } from "@wix/web-methods";
import wixData from "wix-data";

const COLLECTION = "ONE_SupportRequests";
const ALLOWED = new Set(["MEMBERSHIP", "TECHNICAL", "SUGGESTION"]);

function assignedTeam(category) {
  switch (category) {
    case "MEMBERSHIP": return "ONE Membership";
    case "TECHNICAL": return "ONE Technical";
    case "SUGGESTION": return "ONE Product";
    default: return "ONE Team";
  }
}

export const createSupportRequest = webMethod(
  Permissions.SiteMember,
  async ({ memberId, category, subject, message }) => {
    if (!memberId || !category || !subject || !message) {
      throw new Error("All support fields are required");
    }
    if (!ALLOWED.has(category)) {
      throw new Error("Unsupported support category");
    }

    const now = new Date();

    return wixData.insert(COLLECTION, {
      memberId,
      category,
      subject: String(subject).slice(0, 140),
      message: String(message).slice(0, 4000),
      status: "OPEN",
      assignedTeam: assignedTeam(category),
      createdAt: now,
      updatedAt: now
    }, { suppressAuth: true });
  }
);
