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

BROWSERS=("Desktop Safari")

FAILED_TESTS=()
TEST_RESULT="SUCCESS"

run_test_and_capture() {
  local test_file=$1
  local project=$2
  local output_dir="${test_file}_${project}"
  echo "Running test: $test_file on browser: $project"
  if ! npx playwright test "tests/$test_file" --project="$project" --workers=1 --reporter=html --output=results/$output_dir.html; then
    echo "Test failed: $test_file on browser: $project"
    FAILED_TESTS+=("$test_file on $project")
    TEST_RESULT="FAILURE"
  else
    echo "Test passed: $test_file on browser: $project"
  fi
  
  echo "Capturing screenshot for $test_file on $project..."
  node captureReportScreenshot.js $test_file $project
  
  npx playwright show-report &
  sleep 5
  pkill -f "npx playwright show-report"
}

run_browser_tests() {
  local browser=$1
  for TEST_FILE in "${MEMORIALCARE_TEST_FILES[@]}"; do
    run_test_and_capture "$TEST_FILE" "$browser"
  done
}

echo "Starting tests for all browsers in parallel..."

# Run tests for all browsers in parallel
for BROWSER in "${BROWSERS[@]}"; do
  run_browser_tests "$BROWSER" &
done

# Wait for all parallel processes to complete
wait

echo "Completed tests for all browsers."

echo "Zipping results..."
zip -r results/testResultsScreenshot.zip results/testResultsScreenshot/

echo "Sending email with result: $TEST_RESULT"
node sendEmail.js $TEST_RESULT

echo "Script finished."
