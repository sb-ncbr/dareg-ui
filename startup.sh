#!/bin/sh

# Startup script for DAREG UI Next.js application
# This script fetches environment variables from Kubernetes ConfigMap
# and replaces placeholder values in server.js before starting the application

set -e

# Default values
CONFIGMAP_NAME="${CONFIGMAP_NAME:dev-config}"
NAMESPACE="${NAMESPACE:-ceitec-dareg-ns}"
SERVER_FILE="${SERVER_FILE:-server.js}"

echo "Starting DAREG UI application..."
echo "ConfigMap: $CONFIGMAP_NAME"
echo "Namespace: $NAMESPACE"
echo "Server file: $SERVER_FILE"

# Function to get value from ConfigMap
get_configmap_value() {
    local key="$1"
    local default_value="$2"
    
    echo "Attempting to get key '$key' from ConfigMap '$CONFIGMAP_NAME' in namespace '$NAMESPACE'"
    
    # Handle special case for PORT (it's a separate key)
    if [ "$key" = "PORT" ]; then
        local value=$(kubectl get configmap "$CONFIGMAP_NAME" -n "$NAMESPACE" -o jsonpath="{.data.PORT}" 2>/dev/null || echo "")
        if [ -n "$value" ]; then
            echo "Successfully retrieved PORT: '$value'"
            echo "$value"
        else
            echo "Failed to retrieve PORT, using default: '$default_value'"
            echo "$default_value"
        fi
        return
    fi
    
    # For other variables, extract from .env content
    local env_content=$(kubectl get configmap "$CONFIGMAP_NAME" -n "$NAMESPACE" -o jsonpath="{.data['.env']}" 2>/dev/null || echo "")
    
    if [ -n "$env_content" ]; then
        # Extract the specific key from the .env content
        local value=$(echo "$env_content" | grep "^${key}=" | cut -d'=' -f2- | tr -d '\n')
        
        if [ -n "$value" ]; then
            echo "Successfully retrieved '$key': '$value'"
            echo "$value"
        else
            echo "Key '$key' not found in .env, using default: '$default_value'"
            echo "$default_value"
        fi
    else
        echo "Failed to retrieve .env content, using default for '$key': '$default_value'"
        echo "$default_value"
    fi
}

# Function to replace placeholder in server.js
replace_placeholder() {
    local placeholder="$1"
    local value="$2"
    
    # Escape special characters in value for sed
    local escaped_value=$(echo "$value" | sed 's/[[\.*^$()+?{|]/\\&/g')
    
    # Replace placeholder with actual value
    sed -i "s|$placeholder|$escaped_value|g" "$SERVER_FILE"
    echo "Replaced $placeholder with actual value"
}

# Check if server.js exists
if [ ! -f "$SERVER_FILE" ]; then
    echo "Error: $SERVER_FILE not found!"
    exit 1
fi

# Get environment variables from ConfigMap and replace placeholders
echo "Fetching environment variables from ConfigMap..."

# OIDC Authentication Variables
NEXT_PUBLIC_AUTH_OIDC_ISSUER=$(get_configmap_value "NEXT_PUBLIC_AUTH_OIDC_ISSUER" "PLACEHOLDER_OIDC_ISSUER")
NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID=$(get_configmap_value "NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID" "PLACEHOLDER_OIDC_CLIENT_ID")
NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER=$(get_configmap_value "NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER" "PLACEHOLDER_OIDC_METADATA_ISSUER")
NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT=$(get_configmap_value "NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT" "PLACEHOLDER_OIDC_AUTHORIZATION_ENDPOINT")
NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT=$(get_configmap_value "NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT" "PLACEHOLDER_OIDC_TOKEN_ENDPOINT")
NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT=$(get_configmap_value "NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT" "PLACEHOLDER_OIDC_USERINFO_ENDPOINT")
NEXT_PUBLIC_APP_OIDC_SCOPE=$(get_configmap_value "NEXT_PUBLIC_APP_OIDC_SCOPE" "PLACEHOLDER_OIDC_SCOPE")
AUTH_SECRET=$(get_configmap_value "AUTH_SECRET" "PLACEHOLDER_AUTH_SECRET")
AUTH_TRUST_HOST=$(get_configmap_value "AUTH_TRUST_HOST" "PLACEHOLDER_AUTH_TRUST_HOST")

# Application Environment Variables
NEXT_PUBLIC_API_URL=$(get_configmap_value "NEXT_PUBLIC_API_URL" "https://api.dareg.biodata.ceitec.cz")
NEXT_PUBLIC_APP_NAME=$(get_configmap_value "NEXT_PUBLIC_APP_NAME" "DAREG UI")
NEXT_PUBLIC_APP_VERSION=$(get_configmap_value "NEXT_PUBLIC_APP_VERSION" "unknown")
NEXT_PUBLIC_APP_ENVIRONMENT=$(get_configmap_value "NEXT_PUBLIC_APP_ENVIRONMENT" "production")

echo "Replacing placeholders in $SERVER_FILE..."

# Replace OIDC placeholders
replace_placeholder "PLACEHOLDER_OIDC_ISSUER" "$NEXT_PUBLIC_AUTH_OIDC_ISSUER"
replace_placeholder "PLACEHOLDER_OIDC_CLIENT_ID" "$NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID"
replace_placeholder "PLACEHOLDER_OIDC_METADATA_ISSUER" "$NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER"
replace_placeholder "PLACEHOLDER_OIDC_AUTHORIZATION_ENDPOINT" "$NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT"
replace_placeholder "PLACEHOLDER_OIDC_TOKEN_ENDPOINT" "$NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT"
replace_placeholder "PLACEHOLDER_OIDC_USERINFO_ENDPOINT" "$NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT"
replace_placeholder "PLACEHOLDER_OIDC_SCOPE" "$NEXT_PUBLIC_APP_OIDC_SCOPE"
replace_placeholder "PLACEHOLDER_AUTH_SECRET" "$AUTH_SECRET"
replace_placeholder "PLACEHOLDER_AUTH_TRUST_HOST" "$AUTH_TRUST_HOST"

# Set environment variables for the application
export NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL"
export NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME"
export NEXT_PUBLIC_APP_VERSION="$NEXT_PUBLIC_APP_VERSION"
export NEXT_PUBLIC_APP_ENVIRONMENT="$NEXT_PUBLIC_APP_ENVIRONMENT"
export NEXT_PUBLIC_AUTH_OIDC_ISSUER="$NEXT_PUBLIC_AUTH_OIDC_ISSUER"
export NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID="$NEXT_PUBLIC_AUTH_OIDC_CLIENT_ID"
export NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER="$NEXT_PUBLIC_APP_OIDC_METADATA_ISSUER"
export NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT="$NEXT_PUBLIC_APP_OIDC_METADATA_AUTHORIZATION_ENDPOINT"
export NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT="$NEXT_PUBLIC_APP_OIDC_METADATA_TOKEN_ENDPOINT"
export NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT="$NEXT_PUBLIC_APP_OIDC_METADATA_USERINFO_ENDPOINT"
export NEXT_PUBLIC_APP_OIDC_SCOPE="$NEXT_PUBLIC_APP_OIDC_SCOPE"
export AUTH_SECRET="$AUTH_SECRET"
export AUTH_TRUST_HOST="$AUTH_TRUST_HOST"

echo "Environment variables set successfully!"
echo "Starting Next.js application on port 5000..."

# Start the application
exec node "$SERVER_FILE"
