/**
 * Phase 4 — Resources and member home
 */

import { Permissions, webMethod } from "@wix/web-methods";
import wixData from "wix-data";

const RESOURCE_COLLECTION = "ONE_Resources";

function normaliseSearch(value = "") {
  return String(value).trim().toLowerCase();
}

export const listResources = webMethod(
  Permissions.SiteMember,
  async ({ search = "", topic = null, resourceType = null, accessLevels = ["ALL_MEMBERS"] } = {}) => {
    let query = wixData.query(RESOURCE_COLLECTION)
      .eq("publishStatus", "PUBLISHED");

    if (topic) query = query.eq("topic", topic);
    if (resourceType) query = query.eq("resourceType", resourceType);

    const result = await query.limit(100).find({ suppressAuth: true });
    const term = normaliseSearch(search);

    return result.items
      .filter(item => accessLevels.includes(item.accessLevel || "ALL_MEMBERS"))
      .filter(item => {
        if (!term) return true;
        const haystack = [
          item.title,
          item.summary,
          item.topic,
          item.resourceType
        ].filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(term);
      })
      .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
  }
);

export const getResource = webMethod(
  Permissions.SiteMember,
  async ({ resourceId, accessLevels = ["ALL_MEMBERS"] }) => {
    if (!resourceId) throw new Error("resourceId is required");

    const item = await wixData.get(RESOURCE_COLLECTION, resourceId, { suppressAuth: true });

    if (!item || item.publishStatus !== "PUBLISHED") return null;
    if (!accessLevels.includes(item.accessLevel || "ALL_MEMBERS")) return null;

    return item;
  }
);
