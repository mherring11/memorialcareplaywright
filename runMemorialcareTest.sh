#!/bin/bash

# Define an array containing all the test file names that need to be run.
MEMORIALCARE_TEST_FILES=(
  "memorialcareEventsDesktop.spec.js"
  "memorialcareEventsMobile.spec.js"
  "memorialcareBlogDesktop.spec.js"
  "memorialcareBlogMobile.spec.js"
  "memorialcareHeaderFooterDesktop.spec.js"
  "memorialcareHeaderFooterMobile.spec.js"
  "memorialcareLocationsDesktop.spec.js"
  "memorialcareLocationsMobile.spec.js"
  "memorialcareSearchDesktop.spec.js"
  "memorialcareSearchMobile.spec.js"
  "memorialcareServicesDesktop.spec.js"
  "memorialcareServicesMobile.spec.js"
  "providerMainFormDesktop.spec.js"
  "providerMainFormMobile.spec.js"
)

# Define the browsers to run tests against. In this case, only 'Desktop Safari' is used.
BROWSERS=("Desktop Safari")

# Initialize an array to track failed tests and a variable for overall test result.
FAILED_TESTS=()
TEST_RESULT="SUCCESS"

# Maximum number of retries for flaky tests.
MAX_RETRIES=3

# Function to check if a specific port is in use and kill the process occupying it.
# This helps to avoid conflicts when starting a new Playwright server.
check_and_kill_port() {
  local port=$1
  if lsof -i:$port &> /dev/null; then
    echo "Port $port is in use. Attempting to free it."
    fuser -k $port/tcp
  fi
}

# Function to run a specific test file and capture results.
# Arguments:
#   $1: Test file name
#   $2: Browser project name
run_test_and_capture() {
  local test_file=$1
  local project=$2
  local output_dir="${test_file}_${project}" # Output directory for results
  local port=9323
  local unique_port=$((port + RANDOM % 1000)) # Generate a random port to avoid conflicts

  local retry_count=0

  # Retry loop to handle flaky tests. Retries up to MAX_RETRIES times.
  while [ $retry_count -lt $MAX_RETRIES ]; do
    echo "Running test: $test_file on browser: $project using port: $unique_port (Attempt: $((retry_count + 1)))"

    # Free the unique port if in use.
    check_and_kill_port $unique_port

    # Run the Playwright test with the specified parameters.
    # The '|| true' ensures the script doesn't exit on failure.
    if npx playwright test "tests/$test_file" --project="$project" --workers=1 --reporter=html --output=results/$output_dir.html --timeout=120000 --retries=0 || true; then
      echo "Test finished: $test_file on browser: $project"
    fi

    # Check if the last command (test execution) was successful.
    if [ $? -eq 0 ]; then
      echo "Test passed: $test_file on browser: $project"
      break
    else
      echo "Test failed: $test_file on browser: $project (Attempt: $((retry_count + 1)))"
      retry_count=$((retry_count + 1))
      # If maximum retries are reached, mark the test as failed.
      if [ $retry_count -ge $MAX_RETRIES ]; then
        FAILED_TESTS+=("$test_file on $project")
        TEST_RESULT="FAILURE"
      fi
    fi
  done

  # Capture a screenshot for the test report.
  echo "Capturing screenshot for $test_file on $project..."
  node captureReportScreenshot.js $test_file $project $unique_port || true

  # Open the HTML report to verify it was generated correctly.
  npx playwright show-report --port=$unique_port &
  sleep 5
  # Close the report viewer after a brief pause.
  pkill -f "npx playwright show-report"
}

# Function to run tests for a specific browser.
# Arguments:
#   $1: Browser project name
run_browser_tests() {
  local browser=$1
  for TEST_FILE in "${MEMORIALCARE_TEST_FILES[@]}"; do
    run_test_and_capture "$TEST_FILE" "$browser"
  done
}

# Starting point of the script.
echo "Starting tests for all browsers sequentially..."

# Iterate over the browsers and run the tests for each.
for BROWSER in "${BROWSERS[@]}"; do
  run_browser_tests "$BROWSER"
done

echo "Completed tests for all browsers."

# Zip the results directory to compress all test results and screenshots.
echo "Zipping results..."
zip -r results/testResultsScreenshot.zip results/testResultsScreenshot/

# Send an email notification with the overall test result (either "SUCCESS" or "FAILURE").
echo "Sending email with result: $TEST_RESULT"
node sendEmail.js $TEST_RESULT

echo "Script finished."
