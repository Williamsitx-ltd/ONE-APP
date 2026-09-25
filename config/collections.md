# Required Wix CMS collections

## ONE_UsageLedger
Private collection used only by trusted backend code.

Fields:
- `memberId` — text
- `planKey` — text
- `benefitType` — text (`ONE_TO_ONE` or `LIVE_SESSION`)
- `bookingId` — text
- `serviceId` — text
- `cycleStart` — date/time
- `cycleEnd` — date/time
- `status` — text (`ACTIVE`, `CANCELLED`, `REVERSED`)
- `createdAt` — date/time

Recommended permissions:
- Site visitors: none
- Site members: none
- Admin/backend only

## ONE_MemberPreferences
Member-owned preferences. Avoid clinical or sensitive coaching data.

Fields:
- `memberId` — text
- `interests` — tags/text array
- `onboardingSkipped` — boolean
- `updatedAt` — date/time

## ONE_Resources
Published resource library.

Fields:
- `title`
- `summary`
- `resourceType`
- `topic`
- `estimatedMinutes`
- `mediaUrl`
- `externalUrl`
- `accessLevel`
- `publishStatus`
- `isExternal`
- `sortOrder`

Use CMS permissions plus backend filtering so draft/restricted content is not returned to unauthorised members.

## ONE_SupportRequests
Private support workflow.

Fields:
- `memberId`
- `category`
- `subject`
- `message`
- `status`
- `assignedTeam`
- `createdAt`
- `updatedAt`

Do not use this for clinical, emergency or sensitive coaching notes.

## ONE_ReleaseChecks
Operational test evidence for Phase 6.

Fields:
- `area`
- `severity`
- `summary`
- `owner`
- `status`
- `retestResult`
- `updatedAt`
