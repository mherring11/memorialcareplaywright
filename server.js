const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).send('Server is up and running!');
});

app.get('/run-test/:testName', (req, res) => {
    const testName = req.params.testName;
    const scriptPath = path.join(__dirname, 'runTestAndCapture.sh');
  
    console.log(`Executing script: ${scriptPath} with test: ${testName}`);

    const logFile = path.join(__dirname, 'test-log.txt');
    fs.appendFileSync(logFile, `\n\n--- Running test: ${testName} at ${new Date()} ---\n`);
  
    exec(`bash ${scriptPath} ${testName}`, (error, stdout, stderr) => {
      let responseMessage = '';

      if (error) {
        console.error(`Error executing script: ${error.message}`);
        fs.appendFileSync(logFile, `Error: ${error.message}\n`);
        responseMessage += `Error: ${error.message}\n`;
        return res.status(500).send('Failed to trigger test.');
      }
  
      if (stdout) {
        console.log(`stdout: ${stdout}`);
        fs.appendFileSync(logFile, `stdout: ${stdout}\n`);
        responseMessage += `stdout: ${stdout}\n`;
      } else {
        fs.appendFileSync(logFile, "No stdout output\n");
        responseMessage += 'No stdout output\n';
      }
  
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        fs.appendFileSync(logFile, `stderr: ${stderr}\n`);
        responseMessage += `stderr: ${stderr}\n`;
      } else {
        fs.appendFileSync(logFile, "No stderr output\n");
        responseMessage += 'No stderr output\n';
      }
      res.send(`Test script for ${testName} launched successfully.\n\nOutput: ${responseMessage}`);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
