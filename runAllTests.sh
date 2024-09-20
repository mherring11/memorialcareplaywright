#!/bin/bash

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
  "memorialcareSearchDesktop.spec.js"
  "memorialcareSearchMobile.spec.js"
  "memorialcareServicesDesktop.spec.js"
  "memorialcareServicesMobile.spec.js"
  "providerGnpDesktop.spec.js"
  "providerGnpMobile.spec.js"
  "providerMainFormDesktop.spec.js"
  "providerMainFormMobile.spec.js"
  "providerSearchDesktop.spec.js"
  "providerSearchMobile.spec.js"
)

# Array to store failed test results
FAILED_TESTS=()

# Function to send email with failure results
send_failure_email() {
  echo "Some tests failed. Sending email notification..."
  node sendEmail.js
}

# Function to run each test and capture failures
run_test_and_capture() {
  local test_file=$1
  echo "Running test: $test_file"
  
  # Run the test with npx playwright directly and continue even if it fails
  if ! npx playwright test "tests/$test_file" --reporter=html --output=results/${test_file}.html; then
    echo "Test failed: $test_file"
    FAILED_TESTS+=("$test_file")
  else
    echo "Test passed: $test_file"
  fi
}

# Loop through all test files and run them individually
for TEST_FILE in "${TEST_FILES[@]}"; do
  run_test_and_capture "$TEST_FILE" || true # Ensures script continues even if this particular test fails
done

# Check if any tests failed
if [ ${#FAILED_TESTS[@]} -ne 0 ]; then
  echo "Failed tests: ${FAILED_TESTS[@]}"
  send_failure_email
else
  echo "All tests passed successfully. Sending email notification..."
  node sendEmail.js
fi
