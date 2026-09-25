# ONE by IWC — Wix Development Codebase

This repository implements the phased development plan for the **ONE by IWC** Wix Studio member web application.

Target Wix site: `a68392db-aa26-4dad-a22e-4a3b1e0480bb`

## Architecture

The plan deliberately uses native Wix capability first:

- Wix Members Area
- Wix Pricing Plans
- Wix Bookings
- Wix CMS
- Wix Groups

Custom code is limited to gaps that need trusted backend logic, especially:

- membership entitlement checks
- custom monthly usage ledgers
- member-only dashboard aggregation
- restricted resource queries
- support-request routing
- operational diagnostics

## Important implementation rule

Do **not** publish paid plans until Phase 1 proves that the displayed Bronze, Silver, Gold and Platinum allowances match what Wix actually permits members to book.

## Membership entitlement model

| Tier | Monthly price | ONE-to-ONE allowance | Live sessions |
|---|---:|---|---|
| Bronze | £15 | 1 × 20 min | 1 |
| Silver | £25 | 1 × 30 min | 2 |
| Gold | £35 | 2 × 20 min | Unlimited |
| Platinum | £50 | 2 × 30 min | Unlimited |

## Repository map

- `backend/config.js` — canonical tier rules and Wix IDs
- `config/` — human-readable collection contracts and source configuration
- `backend/` — trusted Wix backend web methods
- `public/pages/` — page-code examples for Wix Studio pages
- `tests/` — entitlement engine test matrix
- `docs/` — phase-by-phase implementation notes

## Wix setup prerequisites

1. Enable Velo on the ONE by IWC Wix Studio site.
2. Install/configure Members Area, Pricing Plans and Bookings before using the member journey code.
3. Create the CMS collections listed in `config/collections.md`.
4. Keep private collections restricted. Hiding UI elements is not a security boundary.
5. Replace placeholder Wix Plan IDs and service IDs in `config/ids.js`.
6. Run the Phase 1 test matrix using separate test accounts before live sales.
