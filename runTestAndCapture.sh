#!/bin/bash

# Start of the script
echo "Starting runTestAndCapture.sh script..."

# Check if at least one test file is provided as an argument.
# If no test files are passed, exit with an error message.
if [ $# -eq 0 ]; then
  echo "Please provide at least one test file to run (e.g., gnpHeaderFooter.spec.js)"
  exit 1
fi

# Initialize an array to track failed tests and set the default test result to "SUCCESS".
FAILED_TESTS=()
TEST_RESULT="SUCCESS"

# Maximum number of retries for flaky tests.
MAX_RETRIES=3

# Function to check if a specific port is in use and kill the process occupying it.
# This prevents conflicts when trying to open a new Playwright report server.
check_and_kill_port() {
  local port=$1
  if lsof -i:$port &> /dev/null; then
    echo "Port $port is in use. Attempting to free it."
    fuser -k $port/tcp
  fi
}

# Function to run a specific test file and capture results, including screenshots.
# Arguments:
#   $1: Test file name
run_test_and_capture() {
  local test_file=$1
  local output_dir=$(echo "$test_file" | sed 's/.spec.js//g') # Create an output directory name from the test file name
  local port=9323
  local unique_port=$((port + RANDOM % 1000)) # Generate a random port to avoid conflicts during concurrent executions.
  
  local retry_count=0

  # Retry loop to handle flaky tests. Retries up to MAX_RETRIES times.
  while [ $retry_count -lt $MAX_RETRIES ]; do
    echo "Running test: $test_file using port: $unique_port (Attempt: $((retry_count + 1)))"

    # Check if the unique port is in use and kill the process if necessary.
    check_and_kill_port $unique_port

    # Run the Playwright test with the specified parameters.
    # The '|| true' ensures the script doesn't exit on failure and continues.
    if npx playwright test tests/$test_file --reporter=html --output=results/$output_dir --timeout=120000 --retries=0 || true; then
      echo "Test finished: $test_file"
    fi

    # Check if the last command (test execution) was successful.
    if [ $? -eq 0 ]; then
      echo "Test passed: $test_file"
      break
    else
      echo "Test failed: $test_file (Attempt: $((retry_count + 1)))"
      retry_count=$((retry_count + 1))
      # If maximum retries are reached, mark the test as failed.
      if [ $retry_count -ge $MAX_RETRIES ]; then
        FAILED_TESTS+=("$test_file")
        TEST_RESULT="FAILURE"
      fi
    fi
  done

  # Capture a screenshot for the test report using a custom script.
  echo "Capturing screenshot for $test_file..."
  node captureReportScreenshot.js $test_file $unique_port || true

  # Open the HTML report to ensure it was generated and to take the screenshot.
  npx playwright show-report --port=$unique_port &
  sleep 5 # Allow some time for the report to open before closing it.
  
  # Close the report viewer.
  pkill -f "npx playwright show-report"
}

# Iterate over all the provided test files passed as arguments to the script.
for TEST_FILE in "$@"; do
  echo "Test file passed: $TEST_FILE"
  # Run each test file and capture its result.
  run_test_and_capture "$TEST_FILE"
done

# Check if any tests failed and send an email notification accordingly.
if [ ${#FAILED_TESTS[@]} -ne 0 ]; then
  echo "Failed tests: ${FAILED_TESTS[@]}"
  echo "Sending failure email notification..."
  node sendEmail.js "FAILURE" # Send an email with failure notification.
else
  echo "All tests passed successfully. Sending success email notification..."
  node sendEmail.js "SUCCESS" # Send an email with success notification.
fi

# Compress the results directory to include all test results and screenshots.
echo "Zipping results..."
zip -r results/testResultsScreenshot.zip results/testResultsScreenshot/

echo "Script finished."
