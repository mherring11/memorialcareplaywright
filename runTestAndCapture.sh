#!/bin/bash

npx playwright test tests/gnpHeaderFooter.spec.js --reporter=html --output=results/gnpHeaderFooter.html

npx playwright show-report &

sleep 5

node captureReportScreenshot.js gnpHeaderFooter.spec.js

pkill -f "npx playwright show-report"
