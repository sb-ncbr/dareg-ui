#!/usr/bin/env bash
# --------------------------------------------------------------
# replace-env-and-run.sh
#   * Replaces placeholder tokens in the Next.js build output
#   * Starts the Next.js server (node server.js)
# --------------------------------------------------------------

set -euo pipefail                     # fail fast, treat unset vars as errors

echo "=== Replacing environment placeholders in .next ==="

# -----------------------------------------------------------------
# 1️⃣  Mapping: placeholder → env‑var (with a harmless default)
# -----------------------------------------------------------------
declare -A PH=(
  # Core URLs / version information
  ["APP_BASE_URL_PLACEHOLDER"]="${APP_BASE_URL:-http://example.com}"
  ["APP_OIDC_REDIRECT_URL_PLACEHOLDER"]="${APP_OIDC_REDIRECT_URL:-/auth/callback}"
  ["APP_BASE_API_URL_PLACEHOLDER"]="${APP_BASE_API_URL:-https://api.example.com/v1/}"
  ["APP_BASE_ONEZONE_URL_PLACEHOLDER"]="${APP_BASE_ONEZONE_URL:-https://onezone.example.com/}"
  ["APP_BASE_ONEZONE_PRETTY_URL_PLACEHOLDER"]="${APP_BASE_ONEZONE_PRETTY_URL:-https://onezone.example.com/}"
  ["PORT_PLACEHOLDER"]="${PORT:-3000}"
  ["APP_VERSION_PLACEHOLDER"]="${APP_VERSION:-0.0.0}"
  ["APP_VERSION_DATE_PLACEHOLDER"]="${APP_VERSION_DATE:-1970-01-01}"
  ["APP_ENVIRONMENT_PLACEHOLDER"]="${APP_ENVIRONMENT:-development}"
  ["NEXTAUTH_URL_PLACEHOLDER"]="${NEXTAUTH_URL:-http://example.com}"
  ["NEXT_PUBLIC_API_URL_PLACEHOLDER"]="${NEXT_PUBLIC_API_URL:-https://api.example.com}"

  # OIDC / Auth (client‑side, must be prefixed with NEXT_PUBLIC_)
  ["NEXT_PUBLIC_AUTH_OIDC_ISSUER_PLACEHOLDER"]="${NEXT_PUBLIC_AUTH_OIDC_ISSUER:-https://idp.example.com/oidc/}"
  ["NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID_PLACEHOLDER"]="${NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID:-example-client-id}"
  ["NEXT_PUBLIC_APP_OIDC_SCOPE_PLACEHOLDER"]="${NEXT_PUBLIC_APP_OIDC_SCOPE:-openid profile email}"
  ["NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER_PLACEHOLDER"]="${NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER:-https://idp.example.com}"
  ["NEXT_PUBLIC_APP_OIDC_METADATA_JWKS_URI_PLACEHOLDER"]="${NEXT_PUBLIC_APP_OIDC_METADATA_JWKS_URI:-https://idp.example.com/jwks}"
  ["NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT_PLACEHOLDER"]="${NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT:-https://idp.example.com/oidc/auth}"
  ["NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT_PLACEHOLDER"]="${NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT:-https://idp.example.com/oidc/token}"
  ["NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT_PLACEHOLDER"]="${NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT:-https://idp.example.com/oidc/userinfo}"
  ["NEXT_PUBLIC_APP_OIDC_METADATA_END_SESSION_ENDPOINT_PLACEHOLDER"]="${NEXT_PUBLIC_APP_OIDC_METADATA_END_SESSION_ENDPOINT:-https://idp.example.com/oidc/logout}"
)

# -----------------------------------------------------------------
# 2️⃣  Build a single‑line sed expression (fast)
# -----------------------------------------------------------------
SED_EXPR=""
for ph in "${!PH[@]}"; do
  val="${PH[$ph]}"
  # Escape characters that would break sed (/, &, newline)
  esc=$(printf '%s' "$val" | sed -e 's/[\/&]/\\&/g')
  SED_EXPR="${SED_EXPR}s|${ph}|${esc}|g;"
done

# -----------------------------------------------------------------
# 3️⃣  Apply the expression to every .js file under .next
# -----------------------------------------------------------------
js_files=$(find .next -type f -name '*.js' 2>/dev/null || true)

if [[ -z "$js_files" ]]; then
  echo "⚠️  No JavaScript files found under .next – nothing to replace."
else
  echo "🔎  Replacing placeholders in $(echo "$js_files" | wc -l) files..."
  for f in $js_files; do
    sed -i '' -e "$SED_EXPR" "$f"
  done
  echo "✅  Replacement complete."
fi

# -----------------------------------------------------------------
# 4️⃣  Start the Next.js server
# -----------------------------------------------------------------
echo "🚀  Starting Next.js (node server.js) …"
exec node server.js