/**
 * Phase 5 — Ask the ONE Team
 */

import { createSupportRequest } from "backend/support.web";

export async function submitSupportRequest({ memberId, category, subject, message }) {
  if (!memberId) {
    return { ok: false, message: "Please sign in before sending a request." };
  }

  try {
    const result = await createSupportRequest({
      memberId,
      category,
      subject,
      message
    });

    return {
      ok: true,
      requestId: result._id,
      message: "Your request has been sent to the ONE Team."
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Your request could not be sent. Please try again."
    };
  }
}
