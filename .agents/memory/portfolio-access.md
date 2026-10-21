---
name: Public portfolio and admin recovery
description: Keep the public portfolio reachable regardless of sign-in, and verify recovery without creating test data.
---

The homepage must remain usable for signed-in visitors, including Google accounts that are not authorized as administrators. Do not restore automatic homepage-to-dashboard redirects.

**Why:** The owner reported that a non-admin Google sign-in became trapped in a dashboard error and could not return home. This is a public portfolio, not a user portal.

**How to apply:** Keep administrator authorization server-side, but ensure denial, session expiry, and authorization-service errors always offer navigation back to the portfolio and a sign-out option.

Do not create test accounts or database records when verifying these flows.

**Why:** The owner explicitly requested that testing not pollute the database.

**How to apply:** Use isolated middleware tests and browser-only simulated authorization states; disclose that real signed-in production behavior has not been verified when relying on simulations.
