#!/bin/bash

echo "🚀 STARTUP SCRIPT EXECUTING..."
echo "Current directory: $(pwd)"
echo "Current user: $(whoami)"
echo "Environment variables:"
env | grep -E "(AUTH|NEXT_PUBLIC|APP_)" | head -10

echo "Replacing env constants in Next.js build files"

# Check initial environment state
echo "=== CHECKING INITIAL ENVIRONMENT ==="
echo "NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID: $NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID"
echo "NEXT_PUBLIC_AUTH_OIDC_ISSUER: $NEXT_PUBLIC_AUTH_OIDC_ISSUER"
echo "NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER: $NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER"
echo "=== END INITIAL CHECK ==="

# Check what placeholders exist in the build
echo "=== CHECKING EXISTING PLACEHOLDERS ==="
if grep -r "PLACEHOLDER" .next/ 2>/dev/null; then
  echo "Found placeholders in build:"
  grep -r "PLACEHOLDER" .next/ 2>/dev/null | head -10
else
  echo "No placeholders found in build"
fi

# Also check for any OIDC-related strings that might be placeholders
echo "=== CHECKING FOR OIDC STRINGS ==="
if grep -r -i "oidc" .next/ 2>/dev/null | head -5; then
  echo "Found OIDC-related strings"
else
  echo "No OIDC strings found"
fi
echo "=== END CHECK ==="

# Process compiled JavaScript files
for file in .next/**/*.js;
do
  echo "Processing $(basename "$file") ..."
  sed -i -e "s|APP_BASE_URL_PLACEHOLDER|${APP_BASE_URL:-http://example.com}|g" \
         -e "s|APP_OIDC_REDIRECT_URL_PLACEHOLDER|${APP_OIDC_REDIRECT_URL:-/auth/callback}|g" \
         -e "s|APP_BASE_API_URL_PLACEHOLDER|${APP_BASE_API_URL:-https://api.example.com/v1/}|g" \
         -e "s|APP_BASE_ONEZONE_URL_PLACEHOLDER|${APP_BASE_ONEZONE_URL:-https://onezone.example.com/}|g" \
         -e "s|APP_BASE_ONEZONE_PRETTY_URL_PLACEHOLDER|${APP_BASE_ONEZONE_PRETTY_URL:-https://onezone.example.com/}|g" \
         -e "s|PORT_PLACEHOLDER|${PORT:-3000}|g" \
         -e "s|APP_VERSION_PLACEHOLDER|${APP_VERSION:-0.0.0}|g" \
         -e "s|APP_VERSION_DATE_PLACEHOLDER|${APP_VERSION_DATE:-1970-01-01}|g" \
         -e "s|APP_ENVIRONMENT_PLACEHOLDER|${APP_ENVIRONMENT:-development}|g" \
         -e "s|NEXTAUTH_URL_PLACEHOLDER|${NEXTAUTH_URL:-http://example.com}|g" \
         -e "s|NEXT_PUBLIC_API_URL_PLACEHOLDER|${NEXT_PUBLIC_API_URL:-https://api.example.com}|g" \
         -e "s|NEXT_PUBLIC_AUTH_OIDC_ISSUER_PLACEHOLDER|${NEXT_PUBLIC_AUTH_OIDC_ISSUER:-https://idp.example.com/oidc/}|g" \
         -e "s|NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID_PLACEHOLDER|${NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID:-example-client-id}|g" \
         -e "s|NEXT_PUBLIC_APP_OIDC_SCOPE_PLACEHOLDER|${NEXT_PUBLIC_APP_OIDC_SCOPE:-openid profile email}|g" \
         -e "s|NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER_PLACEHOLDER|${NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER:-https://idp.example.com}|g" \
         -e "s|NEXT_PUBLIC_APP_OIDC_METADATA_JWKS_URI_PLACEHOLDER|${NEXT_PUBLIC_APP_OIDC_METADATA_JWKS_URI:-https://idp.example.com/jwks}|g" \
         -e "s|NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT_PLACEHOLDER|${NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT:-https://idp.example.com/oidc/auth}|g" \
         -e "s|NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT_PLACEHOLDER|${NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT:-https://idp.example.com/oidc/token}|g" \
         -e "s|NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT_PLACEHOLDER|${NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT:-https://idp.example.com/oidc/userinfo}|g" \
         -e "s|NEXT_PUBLIC_APP_OIDC_METADATA_END_SESSION_ENDPOINT_PLACEHOLDER|${NEXT_PUBLIC_APP_OIDC_METADATA_END_SESSION_ENDPOINT:-https://idp.example.com/oidc/logout}|g" \
         -e "s|AUTH_SECRET_PLACEHOLDER|${AUTH_SECRET:-}|g" \
         -e "s|SECRET_PLACEHOLDER|${SECRET:-}|g" \
         -e "s|AUTH_TRUST_HOST_PLACEHOLDER|${AUTH_TRUST_HOST:-true}|g" "$file"
done

# Process OpenAPI files specifically (they contain placeholders)
echo "Processing OpenAPI files..."
for file in openapi/**/*.js openapi/**/*.ts;
do
  if [ -f "$file" ]; then
    echo "Processing OpenAPI file: $(basename "$file") ..."
    sed -i -e "s|NEXT_PUBLIC_API_URL_PLACEHOLDER|${NEXT_PUBLIC_API_URL:-https://api.example.com}|g" "$file"
  fi
done

# Update environment variables to real values (not just placeholders in files)
echo "=== UPDATING ENVIRONMENT VARIABLES ==="
export NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID="${NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID:-9016cb62-acb6-4b73-b7af-93b773c6fc22}"
export NEXT_PUBLIC_AUTH_OIDC_ISSUER="${NEXT_PUBLIC_AUTH_OIDC_ISSUER:-https://id.muni.cz/oidc/}"
export NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER="${NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER:-https://id.muni.cz}"
export NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT="${NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT:-https://id.muni.cz/oidc/auth/authorize}"
export NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT="${NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT:-https://id.muni.cz/oidc/token}"
export NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT="${NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT:-https://id.muni.cz/oidc/userinfo}"
export NEXT_PUBLIC_APP_OIDC_SCOPE="${NEXT_PUBLIC_APP_OIDC_SCOPE:-openid profile email eduperson_entitlement offline_access}"
export NEXT_PUBLIC_APP_OIDC_METADATA_JWKS_URI="${NEXT_PUBLIC_APP_OIDC_METADATA_JWKS_URI:-https://id.muni.cz/jwk}"
export NEXT_PUBLIC_APP_OIDC_METADATA_END_SESSION_ENDPOINT="${NEXT_PUBLIC_APP_OIDC_METADATA_END_SESSION_ENDPOINT:-https://id.muni.cz/oidc/endsession}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://api.devel.dareg.biodata.ceitec.cz/api/v1/}"
export APP_BASE_URL="${APP_BASE_URL:-http://localhost:5000}"
export APP_OIDC_REDIRECT_URL="${APP_OIDC_REDIRECT_URL:-auth}"
export APP_BASE_API_URL="${APP_BASE_API_URL:-https://api.devel.dareg.biodata.ceitec.cz/api/v1/}"
export APP_BASE_ONEZONE_URL="${APP_BASE_ONEZONE_URL:-https://ip-147-251-21-190.flt.cloud.muni.cz/ozw/onezone/}"
export APP_BASE_ONEZONE_PRETTY_URL="${APP_BASE_ONEZONE_PRETTY_URL:-https://onedata.e-infra.cz/}"
export PORT="${PORT:-5000}"
export APP_VERSION="${APP_VERSION:-test-version}"
export APP_VERSION_DATE="${APP_VERSION_DATE:-2024-01-01}"
export APP_ENVIRONMENT="${APP_ENVIRONMENT:-development}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-http://localhost:5000}"
export AUTH_SECRET="${AUTH_SECRET:-}"
export SECRET="${SECRET:-test-secret}"
export AUTH_TRUST_HOST="${AUTH_TRUST_HOST:-true}"
echo "Environment variables updated to real values"

# Verify environment variables are now set correctly
echo "=== VERIFYING ENVIRONMENT VARIABLES ==="
echo "NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID: $NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID"
echo "NEXT_PUBLIC_AUTH_OIDC_ISSUER: $NEXT_PUBLIC_AUTH_OIDC_ISSUER"
echo "NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER: $NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER"
echo "=== END ENVIRONMENT VERIFICATION ==="

# Verify replacements worked
echo "=== VERIFICATION ==="
echo "Checking if placeholders were replaced..."
if grep -r "PLACEHOLDER" .next/ 2>/dev/null; then
  echo "⚠️  Some placeholders still exist!"
  echo "Remaining placeholders:"
  grep -r "PLACEHOLDER" .next/ 2>/dev/null | head -5
else
  echo "✅  All placeholders replaced successfully"
fi
echo "=== END VERIFICATION ==="

echo "Starting Next.js server..."
exec node server.js