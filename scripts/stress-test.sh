#!/bin/bash

# Configuration
GATEWAY_URL="http://localhost:8010/api/v1/orders"
AUTH_URL="http://localhost:8000/api/login/oauth/access_token"
CLIENT_ID="TU_CLIENT_ID"
CLIENT_SECRET="TU_CLIENT_SECRET"
USERNAME="tu_usuario"
PASSWORD="tu_password"
CONCURRENCY=50

echo "--- API Stress Test (Bash) ---"

# 1. Get Token
echo "Obtaining access token..."
TOKEN_RESPONSE=$(curl -s -X POST "$AUTH_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "username=$USERNAME" \
  -d "password=$PASSWORD" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  -d "scope=openid profile email")

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -oP '(?<="access_token":")[^"]*')

if [ -z "$TOKEN" ]; then
    echo "Error: Could not obtain token. Response was:"
    echo "$TOKEN_RESPONSE"
    exit 1
fi

echo "Token obtained successfully."
echo "Starting $CONCURRENCY simultaneous requests to $GATEWAY_URL..."

# 2. Run simultaneous requests
for i in $(seq 1 $CONCURRENCY)
do
    curl -X POST "$GATEWAY_URL" \
      -s -o /dev/null -w "Request #$i: %{http_code}\n" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "items": [
          {"productId": "prod-123", "quantity": 1}
        ],
        "shippingAddress": {
          "street": "123 Test St",
          "city": "Test City",
          "state": "TS",
          "zipCode": "12345",
          "country": "Testerland",
          "recipientName": "Test User",
          "recipientPhone": "+1234567890"
        },
        "paymentMethod": "Credit Card"
      }' &
done

# Wait for all background processes to finish
wait

echo "--- Test Completed ---"
