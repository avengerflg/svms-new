#!/bin/bash

echo "Testing School Visiting System Authentication API"
echo "================================================="

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s http://localhost:5000/api/health | jq .

echo -e "\n2. Testing login with admin credentials..."
response=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@school.com", "password": "admin123"}')

echo "$response" | jq .

# Extract token for further testing
token=$(echo "$response" | jq -r '.data.token')

if [ "$token" != "null" ] && [ "$token" != "" ]; then
  echo -e "\n3. Testing profile endpoint with token..."
  curl -s -X GET http://localhost:5000/api/auth/profile \
    -H "Authorization: Bearer $token" | jq .
  
  echo -e "\n4. Testing admin dashboard..."
  curl -s -X GET http://localhost:5000/api/dashboard/admin \
    -H "Authorization: Bearer $token" | jq .
else
  echo "Login failed, cannot test protected endpoints"
fi