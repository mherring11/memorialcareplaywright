#!/bin/bash

echo "Starting runTestAndCapture.sh script..."

echo "Running Playwright test: $1"

if [ $# -eq 0 ]; then
  echo "Please provide at least one test file to run (e.g., gnpHeaderFooter.spec.js)"
  exit 1
fi

for TEST_FILE in "$@"
do
  echo "Test file passed: $TEST_FILE"
  export TEST_FILE=$TEST_FILE
  OUTPUT_DIR=$(echo "$TEST_FILE" | sed 's/.spec.js//g')

  echo "Generating output directory: $OUTPUT_DIR"

  echo "Running test: $TEST_FILE"
  if npx playwright test tests/$TEST_FILE --reporter=html --output=results/$OUTPUT_DIR.html; then
    echo "Test passed."
    TEST_RESULT="SUCCESS"
  else
    echo "Test failed."
    TEST_RESULT="FAILURE"
  fi

  echo "Opening report..."
  npx playwright show-report &

  sleep 5

  echo "Capturing screenshot..."
  node captureReportScreenshot.js $TEST_FILE

  echo "Closing report viewer..."
  pkill -f "npx playwright show-report"
done

echo "Zipping results..."
zip -r results/testResultsScreenshot.zip results/testResultsScreenshot/

echo "Sending email with result: $TEST_RESULT"
node sendEmail.js $TEST_RESULT

echo "Script finished."
