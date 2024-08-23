#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide the name of the test to run (e.g., gnpHeaderFooter.spec.js)"
  exit 1
fi

TEST_FILE=$1
OUTPUT_DIR=$(echo "$TEST_FILE" | sed 's/.spec.js//g')

npx playwright test tests/$TEST_FILE --reporter=html --output=results/$OUTPUT_DIR.html

npx playwright show-report &

sleep 5

node captureReportScreenshot.js $TEST_FILE

pkill -f "npx playwright show-report"

zip -r results/testResultsScreenshot.zip results/testResultsScreenshot/

node sendEmail.js
