---
name: Public portfolio and admin recovery
description: Keep the public portfolio reachable regardless of sign-in, and verify recovery without creating test data.
---

The homepage must remain usable for signed-in visitors, including Google accounts that are not authorized as administrators. Do not restore automatic homepage-to-dashboard redirects.

**Why:** The owner reported that a non-admin Google sign-in became trapped in a dashboard error and could not return home. This is a public portfolio, not a user portal.

**How to apply:** Keep administrator authorization server-side, but ensure denial, session expiry, and authorization-service errors always offer navigation back to the portfolio and a sign-out option.

Successful administrator sign-in should open the dashboard, while manually visiting Home must still open the public portfolio.

**Why:** The owner expects authorized login to reach the dashboard, not merely to return Home after the denied-access recovery fix. The owner explicitly confirmed both Google sign-in with the proper email and email/password sign-in followed by a delivered email code open the dashboard in the development preview only, not production. Preserve both methods and the restricted administrator access rather than broadening access to all Google accounts.

**How to apply:** Verify both allowed-admin and denied-account navigation when changing authentication routing; testing the denial branch alone does not establish that administrator sign-in works. Keep development-preview and production verification separate; never describe a preview-only confirmation as resolving a live-site issue.

Keep first-administrator onboarding restricted to the owner-configured email rather than enabling public self-service registration to solve production login failures.

**Why:** Preview and production identities are separate. A sign-in-only portfolio must still establish its real owner in production, without opening registration to visitors or copying development passwords and identities.

**How to apply:** Use the target environment's identity provider, preserve existing account settings and restrictions, and never seed test accounts or default passwords. Treat the administrator email configuration as an explicit trust decision.

Do not create test accounts or database records when verifying these flows.

**Why:** The owner explicitly requested that testing not pollute the database.

**How to apply:** Use isolated middleware tests and browser-only simulated authorization states; disclose that real signed-in production behavior has not been verified when relying on simulations.
