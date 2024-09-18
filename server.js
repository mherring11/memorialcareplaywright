const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.get('/run-test/:testName', (req, res) => {
  const testName = req.params.testName;

  const scriptPath = path.join(__dirname, 'runTestAndCapture.sh');
  
  console.log(`Executing script: ${scriptPath} with test: ${testName}`);

  const logFile = path.join(__dirname, 'test-log.txt');
  fs.appendFileSync(logFile, `\n\n--- Running test: ${testName} at ${new Date()} ---\n`);

  exec(`bash ${scriptPath} ${testName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      fs.appendFileSync(logFile, `Error: ${error.message}\n`);
      return res.status(500).send(`Failed to trigger test. Error: ${error.message}`);
    }

    if (stdout) {
      console.log(`stdout: ${stdout}`);
      fs.appendFileSync(logFile, `stdout: ${stdout}\n`);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      fs.appendFileSync(logFile, `stderr: ${stderr}\n`);
      return res.status(500).send(`Test launched with errors. stderr: ${stderr}`);
    }

    res.send(`Test script for ${testName} launched successfully.\nstdout: ${stdout}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
