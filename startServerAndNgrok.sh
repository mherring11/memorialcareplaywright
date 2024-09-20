#!/bin/bash

echo "Starting Node.js server..."
node server.js &

SERVER_PID=$!

sleep 5

echo "Starting ngrok..."
ngrok http 3000 > /dev/null &

sleep 5

NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*' | head -1)

echo "Public URL for testing: $NGROK_URL"

read -p "Press [Enter] key to stop the server and ngrok..."

kill $SERVER_PID
pkill ngrok
