#!/bin/bash

# Configuration
CASDOOR_URL=${1:-"http://localhost:8000"}
UPDATE_CONFIG=false

# Simple argument parsing
for arg in "$@"; do
    if [ "$arg" == "--update-config" ] || [ "$arg" == "-UpdateConfig" ]; then
        UPDATE_CONFIG=true
    fi
done

echo "Fetching certificates from $CASDOOR_URL/.well-known/jwks..."

# Fetch certificates using curl
RESPONSE=$(curl -s "$CASDOOR_URL/.well-known/jwks")

# Extract RS256 certificate using Node (standard in this repo)
PUBLIC_KEY=$(node -e "
    const data = $RESPONSE;
    if (!data.keys) {
        console.error('Invalid JWKS response');
        process.exit(1);
    }
    const key = data.keys.find(k => k.kty === 'RSA' && k.use === 'sig' && k.x5c);
    if (!key) {
        console.error('No suitable RSA key found in JWKS');
        process.exit(1);
    }
    const cert = key.x5c[0];
    const pem = '-----BEGIN PUBLIC KEY-----\n' + 
                cert.match(/.{1,64}/g).join('\n') + 
                '\n-----END PUBLIC KEY-----';
    console.log(pem);
")

if [ $? -ne 0 ]; then
    echo "Error processing JWKS or no RSA key found."
    exit 1
fi

echo -e "\033[0;32m--- CASDOOR PUBLIC KEY (RS256) ---\033[0m"
echo "$PUBLIC_KEY"
echo -e "\033[0;32m----------------------------------\033[0m"

if [ "$UPDATE_CONFIG" = true ]; then
    CONFIG_FILE="kong/config.yml"
    if [ -f "$CONFIG_FILE" ]; then
        echo "Updating $CONFIG_FILE..."
        
        # Prepare the key with indentation for YAML
        INDENTED_KEY=$(echo "$PUBLIC_KEY" | sed 's/^/    /')
        
        # Use sed to replace the rsa_public_key block
        # This is a bit complex in bash/sed, we'll use a python one-liner for safety with multi-line regex
        python3 -c "
import re, sys
path = '$CONFIG_FILE'
with open(path, 'r') as f: content = f.read()
new_key = \"\"\"$INDENTED_KEY\"\"\"
pattern = r'(rsa_public_key:\s*\|)\n(\s+-----BEGIN PUBLIC KEY-----[\s\S]+?-----END PUBLIC KEY-----)'
updated = re.sub(pattern, r'\1\n' + new_key, content)
with open(path, 'w') as f: f.write(updated)
"
        echo "Configuration updated successfully."
    else
        echo "Error: $CONFIG_FILE not found."
    fi
fi

