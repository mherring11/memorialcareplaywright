#!/bin/bash

# Print a message indicating the Node.js server is starting
echo "Starting Node.js server..."

# Start the Node.js server in the background and store its process ID (PID) in the SERVER_PID variable
node server.js &

# Save the PID of the Node.js process so it can be killed later
SERVER_PID=$!

# Sleep for 5 seconds to allow the Node.js server to fully start before continuing
sleep 5

# Print a message indicating ngrok is starting
echo "Starting ngrok..."

# Start ngrok to expose port 3000 (where the Node.js server is running) to the internet
# Redirect its output to /dev/null to suppress the logs
ngrok http 3000 > /dev/null &

# Sleep for 5 seconds to allow ngrok to establish the tunnel
sleep 5

# Use curl to query ngrok's API for the public URL and store it in the NGROK_URL variable
# Extract the first occurrence of the public URL using grep and head
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*' | head -1)

# Print the public URL to the console, allowing users to test the server via the public URL
echo "Public URL for testing: $NGROK_URL"

# Pause the script and wait for the user to press Enter to stop the server and ngrok
read -p "Press [Enter] key to stop the server and ngrok..."

# Kill the Node.js server process using the stored SERVER_PID
kill $SERVER_PID

# Kill all running ngrok processes
pkill ngrok