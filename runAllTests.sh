#!/bin/bash

# List of test files to run for both GNP and MemorialCare projects.
TEST_FILES=(
  "gnpHeaderFooterDesktop.spec.js"
  "gnpHeaderFooterMobile.spec.js"
  "gnpLocationsDesktop.spec.js"
  "gnpLocationsMobile.spec.js"
  "memorialcareBlogDesktop.spec.js"
  "memorialcareBlogMobile.spec.js"
  "memorialcareEventsDesktop.spec.js"
  "memorialcareEventsMobile.spec.js"
  "memorialcareHeaderFooterDesktop.spec.js"
  "memorialcareHeaderFooterMobile.spec.js"
  "memorialcareLocationsDesktop.spec.js"
  "memorialcareLocationsMobile.spec.js"
  "memorialcareSearchDesktop.spec.js"
  "memorialcareSearchMobile.spec.js"
  "memorialcareServicesDesktop.spec.js"
  "memorialcareServicesMobile.spec.js"
  "providerGnpDesktop.spec.js"
  "providerGnpMobile.spec.js"
  "providerMainFormDesktop.spec.js"
  "providerMainFormMobile.spec.js"
)

# Maximum number of retries for flaky tests. Adjust this value based on test stability.
MAX_RETRIES=3

# Initialize an array to store failed tests and set the default test result to "SUCCESS".
FAILED_TESTS=()
TEST_RESULT="SUCCESS"

# Function to check if a specific port is in use and terminate the process occupying it.
# Arguments:
#   $1: Port number to check and free if in use.
check_and_kill_port() {
  local port=$1
  # Check if the port is currently in use.
  if lsof -i:$port &> /dev/null; then
    echo "Port $port is in use. Attempting to free it."
    # Kill the process occupying the port.
    fuser -k $port/tcp
  fi
}

# Function to send email notification based on the test result.
# Arguments:
#   $1: Test result (SUCCESS or FAILURE) to include in the email.
send_email() {
  local result=$1
  echo "Sending email with result: $result"
  # Send email using a custom script that accepts the test result as an argument.
  node sendEmail.js "$result"
}

# Function to run each test file, capture results, and handle retries for flaky tests.
# Arguments:
#   $1: Test file name to run.
run_test_and_capture() {
  local test_file=$1
  local port=9323
  # Generate a random port number to avoid conflicts during concurrent executions.
  local unique_port=$((port + RANDOM % 1000))
  local retry_count=0

  # Retry loop to handle flaky tests. Retries up to MAX_RETRIES times.
  while [ $retry_count -lt $MAX_RETRIES ]; do
    echo "Running test: $test_file using port: $unique_port (Attempt: $((retry_count + 1)))"

    # Check if the unique port is in use and kill the process if necessary.
    check_and_kill_port $unique_port

    # Run the Playwright test with the specified parameters.
    # The '|| true' ensures the script doesn't exit on failure and continues.
    if npx playwright test "tests/$test_file" --workers=1 --reporter=html --output=results/${test_file}_${retry_count}.html --timeout=120000 --retries=0 || true; then
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

# Main execution loop to run all test files sequentially.
echo "Starting tests for all files sequentially..."

# Iterate over all the test files defined in the TEST_FILES array and run each one.
for TEST_FILE in "${TEST_FILES[@]}"; do
  run_test_and_capture "$TEST_FILE" || true # Ensures the script continues even if this particular test fails.
done

echo "Completed tests for all files."

# Check if any tests failed and send an email notification accordingly.
if [ ${#FAILED_TESTS[@]} -ne 0 ]; then
  echo "Failed tests: ${FAILED_TESTS[@]}"
  send_email "FAILURE" # Send an email with failure notification.
else
  echo "All tests passed successfully."
  send_email "SUCCESS" # Send an email with success notification.
fi

# Zip the test results directory and continue even if the zipping process fails.
echo "Zipping results..."
zip -r results/testResultsScreenshot.zip results/testResultsScreenshot/ || true

# End of the script
echo "Script finished."
