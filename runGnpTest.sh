#!/bin/bash

GNP_TEST_FILES=(
  "gnpHeaderFooterDesktop.spec.js"
  "gnpHeaderFooterMobile.spec.js"
  "gnpLocationsDesktop.spec.js"
  "gnpLocationsMobile.spec.js"
  "providerGnpDesktop.spec.js"
  "providerGnpMobile.spec.js"
)

FAILED_TESTS=()

send_failure_email() {
  echo "Some tests failed. Sending email notification..."
  node sendEmail.js "FAILURE"
}

run_test_and_capture() {
  local test_file=$1
  echo "Running test: $test_file"
  
  if ! npx playwright test "tests/$test_file" --reporter=html --output=results/${test_file}.html; then
    echo "Test failed: $test_file"
    FAILED_TESTS+=("$test_file")
  else
    echo "Test passed: $test_file"
  fi
}

for TEST_FILE in "${GNP_TEST_FILES[@]}"; do
  run_test_and_capture "$TEST_FILE"
done

if [ ${#FAILED_TESTS[@]} -ne 0 ]; then
  echo "Failed tests: ${FAILED_TESTS[@]}"
  send_failure_email
else
  echo "All tests passed successfully. Sending email notification..."
  node sendEmail.js "SUCCESS"
fi
