/**
 * Phase 2 page code example.
 * Element IDs must match the Wix Studio page.
 */

import { getMyOneSummary } from "backend/member.web";

$w.onReady(async function () {
  setLoading(true);

  try {
    const summary = await getMyOneSummary();

    if (!summary.hasPlan) {
      $w("#noPlanState").expand();
      $w("#planState").collapse();
      return;
    }

    $w("#noPlanState").collapse();
    $w("#planState").expand();

    const order = summary.order;
    $w("#planStatus").text = order.status || "Active";

    if (order.endDate) {
      $w("#renewalDate").text = new Date(order.endDate).toLocaleDateString("en-GB");
    }
  } catch (error) {
    console.error(error);
    $w("#errorState").expand();
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  if (isLoading) {
    $w("#loadingState").expand();
  } else {
    $w("#loadingState").collapse();
  }
}
