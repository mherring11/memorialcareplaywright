const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.status(200).send('Server is up and running!');
});

app.post('/run-test', (req, res) => {
  const testName = req.body.testName;

  if (!testName) {
    return res.status(400).send({ error: 'Test name is required' });
  }

  const scriptPath = path.join(__dirname, 'runTestAndCapture.sh');

  fs.chmodSync(scriptPath, '755');

  console.log(`Executing script: ${scriptPath} with test: ${testName}`);

  const logFile = path.join(__dirname, 'test-log.txt');
  fs.appendFileSync(logFile, `\n\n--- Running test: ${testName} at ${new Date()} ---\n`);

  exec(`bash ${scriptPath} ${testName}`, (error, stdout, stderr) => {
    let responseMessage = '';

    if (error) {
      console.error(`Error executing script: ${error.message}`);
      fs.appendFileSync(logFile, `Error: ${error.message}\n`);
      responseMessage += `Error: ${error.message}\n`;
      return res.status(500).send({ error: `Failed to execute test ${testName}`, details: error.message });
    }

    if (stdout) {
      console.log(`stdout: ${stdout}`);
      fs.appendFileSync(logFile, `stdout: ${stdout}\n`);
      responseMessage += `stdout: ${stdout}\n`;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      fs.appendFileSync(logFile, `stderr: ${stderr}\n`);
      responseMessage += `stderr: ${stderr}\n`;
    }

    res.send(`Test ${testName} executed successfully.\n\nOutput: ${responseMessage}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
