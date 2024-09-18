const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.get('/run-test/:testName', (req, res) => {
  const testName = req.params.testName;
  const scriptPath = `/path/to/your/scripts/runTestAndCapture.sh ${testName}`;

  exec(`nohup ${scriptPath} > nohup.out 2> nohup.err &`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return res.status(500).send('Failed to trigger test.');
    }
    const fs = require('fs');
    const output = fs.readFileSync('nohup.out', 'utf8');
    const errorLog = fs.readFileSync('nohup.err', 'utf8');
    
    res.send(`Test script for ${testName} launched successfully.\nOutput Logs: ${output}\nError Logs: ${errorLog}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
