#!/bin/sh
# WHY: Startup script with debug for Coolify healthcheck troubleshooting
# Starts the server, waits, then tests the health endpoint.

echo "=== ECOM-AI Startup ==="
echo "HOSTNAME: $HOSTNAME"
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo 'YES' || echo 'NO')"
echo ""

# Start server in background
HOSTNAME=0.0.0.0 node server.js &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 3

# Test health endpoint
echo "Testing health endpoint..."
for i in 1 2 3 4 5; do
  RESPONSE=$(wget -q -O- http://localhost:3000/api/health 2>&1)
  if [ $? -eq 0 ]; then
    echo "Health check PASSED: $RESPONSE"
    break
  else
    echo "Health check attempt $i failed, retrying in 2s..."
    sleep 2
  fi
done

# Check if server process is still running
if kill -0 $SERVER_PID 2>/dev/null; then
  echo "Server is running (PID: $SERVER_PID)"
else
  echo "ERROR: Server process has died!"
  exit 1
fi

# Keep container alive
wait $SERVER_PID
