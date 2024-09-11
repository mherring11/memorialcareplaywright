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

./runTestAndCapture.sh "${TEST_FILES[@]}"
