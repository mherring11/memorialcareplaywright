#!/bin/bash

# Array of test files to run
GNP_TEST_FILES=(
  "gnpHeaderFooterDesktop.spec.js"
  "gnpHeaderFooterMobile.spec.js"
  "gnpLocationsDesktop.spec.js"
  "gnpLocationsMobile.spec.js"
  "providerGnpDesktop.spec.js"
  "providerGnpMobile.spec.js"
)

FAILED_TESTS=()
TEST_RESULT="SUCCESS"

# Number of retries for flaky tests
MAX_RETRIES=3

# Function to check and kill process on the given port
check_and_kill_port() {
  local port=$1
  if lsof -i:$port &> /dev/null; then
    echo "Port $port is in use. Attempting to free it."
    fuser -k $port/ttcp
  fi
}

run_test_and_capture() {
  local test_file=$1
  local output_dir="${test_file}_results"
  local port=9323
  local unique_port=$((port + RANDOM % 1000))

  local retry_count=0

  while [ $retry_count -lt $MAX_RETRIES ]; do
    echo "Running test: $test_file using port: $unique_port (Attempt: $((retry_count + 1)))"

    # Ensure the port is not in use
    check_and_kill_port $unique_port

    # Run the test
    if npx playwright test "tests/$test_file" --reporter=html --output=results/$output_dir --timeout=120000 --retries=0 || true; then
      echo "Test finished: $test_file"
    fi

    # Check if the test passed
    if [ $? -eq 0 ]; then
      echo "Test passed: $test_file"
      break
    else
      echo "Test failed: $test_file (Attempt: $((retry_count + 1)))"
      retry_count=$((retry_count + 1))
      if [ $retry_count -ge $MAX_RETRIES ]; then
        FAILED_TESTS+=("$test_file")
        TEST_RESULT="FAILURE"
      fi
    fi
  done

  echo "Capturing screenshot for $test_file..."
  node captureReportScreenshot.js $test_file $unique_port || true

  # Open and close the report to capture the screenshot
  npx playwright show-report --port=$unique_port &
  sleep 5
  pkill -f "npx playwright show-report"
}

# Run all tests in the list
for TEST_FILE in "${GNP_TEST_FILES[@]}"; do
  run_test_and_capture "$TEST_FILE"
done

# If there are failed tests, send a failure email
if [ ${#FAILED_TESTS[@]} -ne 0 ]; then
  echo "Failed tests: ${FAILED_TESTS[@]}"
  echo "Sending failure email notification..."
  node sendEmail.js "FAILURE"
else
  echo "All tests passed successfully. Sending success email notification..."
  node sendEmail.js "SUCCESS"
fi

echo "Script finished."
