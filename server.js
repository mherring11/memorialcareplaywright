const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.get('/run-test/:testName', (req, res) => {
  const testName = req.params.testName;
  const scriptPath = `/Users/mherring/projects/playwrightmemorialcare/memorialcareplaywright/runTestAndCapture.sh ${testName}`;

  exec(`nohup ${scriptPath} > /dev/null 2>&1 &`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return res.status(500).send('Failed to trigger test.');
    }
    res.send(`Test script for ${testName} launched successfully.`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
