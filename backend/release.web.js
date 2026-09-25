/**
 * Phase 6 — Accessibility, operations and release
 */

import { Permissions, webMethod } from "@wix/web-methods";
import wixData from "wix-data";

const COLLECTION = "ONE_ReleaseChecks";

export const recordReleaseCheck = webMethod(
  Permissions.Admin,
  async ({ area, severity, summary, owner, status, retestResult = "" }) => {
    const validSeverity = new Set(["BLOCKER", "MAJOR", "MINOR", "NOTE"]);
    if (!validSeverity.has(severity)) throw new Error("Invalid severity");

    return wixData.insert(COLLECTION, {
      area,
      severity,
      summary,
      owner,
      status,
      retestResult,
      updatedAt: new Date()
    }, { suppressAuth: true });
  }
);
