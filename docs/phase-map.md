# Phase-by-phase development map

## Phase 0 — Structure and visual system

**Code in this repo**
- `config/plan-entitlements.js`
- `config/ids.js`
- page-code folder conventions

**Native Wix work**
- responsive Welcome, How ONE Works, Membership Plans and Sign In pages
- reusable Wix Studio components
- Members Area page architecture
- design tokens and accessibility states

No checkout or booking UI should be presented as working until configured.

---

## Phase 1 — Membership feasibility proof

**Code**
- `backend/entitlements.web.js`
- `tests/entitlements.test.js`

**Purpose**
- encode the intended four-tier allowance rules
- create a custom usage-ledger fallback if native Pricing Plans + Bookings cannot enforce two allowance types correctly
- support a written allowed/rejected booking matrix

**Critical gate**
Do not start paid sales until native Wix behaviour and the custom fallback agree with the marketed entitlement.

---

## Phase 2 — Joining and My ONE

**Code**
- `backend/member.web.js`
- `public/pages/my-one.js`

**Purpose**
- return the member's current plan/order summary
- store lightweight, optional interests
- support My ONE without duplicating native Wix account/subscription pages unnecessarily

---

## Phase 3 — Reliable bookings

**Code**
- `backend/entitlements.web.js`
- `public/pages/sessions.js`

**Purpose**
- preflight each booking against the member's current allowance
- reject wrong check-in duration, exhausted allowance and unsupported service
- maintain a trusted usage ledger if required by the Phase 1 finding

**Still required in Wix**
- final booking creation flow
- capacity enforcement
- cancellation synchronisation
- duplicate/concurrency test
- service availability and facilitator configuration

---

## Phase 4 — Resources and member home

**Code**
- `backend/resources.web.js`
- `public/pages/resources.js`
- `config/collections.md`

**Purpose**
- query only published resources
- filter by topic/type/access level
- keep editorial updates in CMS instead of hard-coded page layouts

---

## Phase 5 — Community and ONE Team pilot

**Code**
- `backend/support.web.js`
- `public/pages/support.js`

**Native Wix work**
- Wix Groups access rules
- moderator roles
- profile-field review
- reporting/escalation process

The support-request collection is deliberately separate from community content.

---

## Phase 6 — Accessibility, operations and release

**Code**
- `backend/release.web.js`
- operational CMS contract in `config/collections.md`

**Release checks**
- keyboard and visible focus
- zoom/reflow
- screen-reader labels
- contrast
- error recovery
- member/editor/coach/admin permissions
- booking entitlement regression
- support and moderation operations
- preview vs live-function labelling
