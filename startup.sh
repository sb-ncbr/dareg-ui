#!/bin/bash

echo "Replacing env constants in Next.js build files"

for file in .next/**/*.js;
do
  echo "Processing $file ..."
  
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

echo "Starting Next.js server..."
exec node server.js