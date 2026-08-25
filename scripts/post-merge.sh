#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Keep the workspace aligned with the committed dependency graph without
# prompting or contacting the database.
npm ci --no-audit --no-fund

# Catch type errors and ensure the production bundle can be rebuilt after a
# task merge. Database schema changes are handled explicitly rather than
# mutating shared data automatically during merges.
npm run check
npm run build