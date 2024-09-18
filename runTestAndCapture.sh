#!/bin/bash


echo "Running Playwright test: $1"

if [ $# -eq 0 ]; then
  echo "Please provide at least one test file to run (e.g., gnpHeaderFooter.spec.js)"
  exit 1
fi

for TEST_FILE in "$@"
do
  export TEST_FILE=$TEST_FILE
  OUTPUT_DIR=$(echo "$TEST_FILE" | sed 's/.spec.js//g')

  echo "Running test: $TEST_FILE"
  
  npx playwright test tests/$TEST_FILE --reporter=html --output=results/$OUTPUT_DIR.html

  npx playwright show-report &

  sleep 5

  node captureReportScreenshot.js $TEST_FILE

  pkill -f "npx playwright show-report"
done

zip -r results/testResultsScreenshot.zip results/testResultsScreenshot/

node sendEmail.js
