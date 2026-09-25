# Phase 1 acceptance test matrix

Record the actual Wix result against every row using separate test members.

| Tier | Attempt | Expected |
|---|---|---|
| Bronze | first 20-min check-in in cycle | Permit |
| Bronze | second 20-min check-in in cycle | Reject |
| Bronze | 30-min check-in | Reject |
| Bronze | first live session | Permit |
| Bronze | second live session | Reject |
| Silver | first 30-min check-in | Permit |
| Silver | second 30-min check-in | Reject |
| Silver | first live session | Permit |
| Silver | second live session | Permit |
| Silver | third live session | Reject |
| Gold | first 20-min check-in | Permit |
| Gold | second 20-min check-in | Permit |
| Gold | third 20-min check-in | Reject |
| Gold | multiple live sessions | Permit |
| Platinum | first 30-min check-in | Permit |
| Platinum | second 30-min check-in | Permit |
| Platinum | third 30-min check-in | Reject |
| Platinum | multiple live sessions | Permit |

Additional tests:
- booking exactly before and after renewal boundary
- cancellation returns allowance only if approved business rule says it should
- duplicate booking submission
- two concurrent booking requests for the last remaining allowance
- full class capacity
- cancelled/paused plan
- upgrade/downgrade mid-cycle
- expired membership
- service outside the member's plan
