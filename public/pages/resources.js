/**
 * Phase 4 page code example.
 */

import { listResources } from "backend/resources.web";

let filters = {
  search: "",
  topic: null,
  resourceType: null,
  accessLevels: ["ALL_MEMBERS"]
};

$w.onReady(function () {
  $w("#resourceSearch").onInput(async () => {
    filters.search = $w("#resourceSearch").value;
    await refresh();
  });

  $w("#topicFilter").onChange(async () => {
    filters.topic = $w("#topicFilter").value || null;
    await refresh();
  });

  $w("#typeFilter").onChange(async () => {
    filters.resourceType = $w("#typeFilter").value || null;
    await refresh();
  });

  refresh();
});

async function refresh() {
  try {
    const resources = await listResources(filters);

    $w("#emptyState").collapse();
    $w("#resourceRepeater").data = resources;

    if (resources.length === 0) {
      $w("#emptyState").expand();
    }
  } catch (error) {
    console.error(error);
    $w("#resourceError").expand();
  }
}
