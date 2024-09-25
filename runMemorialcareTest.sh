#!/bin/bash

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

BROWSERS=("Desktop Chrome" "Desktop Firefox" "Desktop Safari")

FAILED_TESTS=()

send_failure_email() {
  echo "Some tests failed. Sending email notification..."
  node sendEmail.js "FAILURE"
}

run_test_and_capture() {
  local test_file=$1
  local project=$2
  echo "Running test: $test_file on browser: $project"
  
  if ! npx playwright test "tests/$test_file" --project="$project" --reporter=html --output=results/${test_file}_${project}.html; then
    echo "Test failed: $test_file on browser: $project"
    FAILED_TESTS+=("$test_file on $project")
  else
    echo "Test passed: $test_file on browser: $project"
  fi
}

for BROWSER in "${BROWSERS[@]}"; do
  echo "Starting tests for browser: $BROWSER"
  for TEST_FILE in "${MEMORIALCARE_TEST_FILES[@]}"; do
    run_test_and_capture "$TEST_FILE" "$BROWSER"
  done
  echo "Completed tests for browser: $BROWSER"
  
  # Add delay between browser runs
  echo "Waiting for 5 seconds before starting the next browser..."
  sleep 5
done

if [ ${#FAILED_TESTS[@]} -ne 0 ]; then
  echo "Failed tests: ${FAILED_TESTS[@]}"
  send_failure_email
else
  echo "All tests passed successfully. Sending email notification..."
  node sendEmail.js "SUCCESS"
fi
