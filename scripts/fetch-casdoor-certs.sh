#!/bin/bash

# Configuration
CASDOOR_URL=${1:-"http://localhost:8000"}

echo "Fetching certificates from $CASDOOR_URL..."

# Fetch certificates using curl
RESPONSE=$(curl -s "$CASDOOR_URL/api/get-certs?owner=admin&pageSize=100")

# Check if response is valid (simple check for "ok")
if [[ $RESPONSE != *"\"status\":\"ok\""* ]]; then
    echo "Error: Failed to fetch certificates or invalid response."
    echo "Response: $RESPONSE"
    exit 1
fi

# Extract RS256 certificate using jq if available, otherwise grep/sed (harder but standard envs might not have jq)
# Assuming a standard environment, we'll try a python one-liner fallback if jq isn't there, or just simple grep for the specific project structure.
# Since we are in a dev environment, let's look for the RS256 type and extract publicKey.

# Attempting to use grep/sed/awk for universal compatibility without jq
# Find the object where "type":"RS256" and then extract "publicKey"
# This is fragile with regex on JSON, but serves the immediate need without dependencies.
# A better approach for a dev tool: assume node or python is present.
# Since this is a NestJS repo, Node is present.

PUBLIC_KEY=$(node -e "
    const response = $RESPONSE;
    if (response.status !== 'ok') process.exit(1);
    const cert = response.data.find(c => c.type === 'RS256');
    if (!cert) { console.error('No RS256 cert found'); process.exit(1); }
    console.log(cert.publicKey);
")

if [ $? -ne 0 ]; then
    echo "Error processing JSON or no RS256 key found."
    exit 1
fi

echo ""
echo -e "\033[0;32m--- CASDOOR PUBLIC KEY (RS256) ---\033[0m"
echo "$PUBLIC_KEY"
echo -e "\033[0;32m----------------------------------\033[0m"
echo ""
echo -e "\033[1;33mUsage in Kong (jwt_secrets):\033[0m"
echo "rsa_public_key: |"
echo "$PUBLIC_KEY" | while IFS= read -r line; do echo "  $line"; done
