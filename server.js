// Import required modules
const express = require('express'); // Web framework for Node.js to create server and handle HTTP requests
const { exec } = require('child_process'); // To execute shell commands
const path = require('path'); // For handling and transforming file paths
const fs = require('fs'); // File system module to interact with the file system

// Create an instance of the Express app
const app = express();

// Define the port the server will run on, using environment variable or defaulting to 3000
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define a simple route for the root URL, responding with a status and message to confirm the server is running
app.get('/', (req, res) => {
  res.status(200).send('Server is up and running!');
});

// Define the POST route '/run-test' to execute a test
app.post('/run-test', (req, res) => {
  // Extract the test name from the request body
  const testName = req.body.testName;

  // If the test name is not provided, send a 400 error response
  if (!testName) {
    return res.status(400).send({ error: 'Test name is required' });
  }

  // Path to the shell script that will run the test
  const scriptPath = path.join(__dirname, 'runTestAndCapture.sh');

  // Set permissions on the shell script to be executable
  fs.chmodSync(scriptPath, '755'); // '755' means read and execute permissions for everyone

  // Log the script and test being executed
  console.log(`Executing script: ${scriptPath} with test: ${testName}`);

  // Define a log file to record test run outputs
  const logFile = path.join(__dirname, 'test-log.txt');

  // Append test start time and test name to the log file
  fs.appendFileSync(logFile, `\n\n--- Running test: ${testName} at ${new Date()} ---\n`);

  // Use exec() to run the shell script, passing the test name as an argument
  exec(`bash ${scriptPath} ${testName}`, (error, stdout, stderr) => {
    // Initialize an empty response message
    let responseMessage = '';

    // Handle error case: if an error occurs during script execution
    if (error) {
      console.error(`Error executing script: ${error.message}`); // Log the error to the console
      fs.appendFileSync(logFile, `Error: ${error.message}\n`); // Append the error to the log file
      responseMessage += `Error: ${error.message}\n`; // Add error message to the response
      // Send a 500 error response with details about the failure
      return res.status(500).send({ error: `Failed to execute test ${testName}`, details: error.message });
    }

    // Handle standard output (stdout): append output to log and response message
    if (stdout) {
      console.log(`stdout: ${stdout}`); // Log stdout to the console
      fs.appendFileSync(logFile, `stdout: ${stdout}\n`); // Append stdout to the log file
      responseMessage += `stdout: ${stdout}\n`; // Add stdout to the response message
    }

    // Handle standard error (stderr): append stderr to log and response message
    if (stderr) {
      console.error(`stderr: ${stderr}`); // Log stderr to the console
      fs.appendFileSync(logFile, `stderr: ${stderr}\n`); // Append stderr to the log file
      responseMessage += `stderr: ${stderr}\n`; // Add stderr to the response message
    }

    // Send a successful response including the test result output
    res.send(`Test ${testName} executed successfully.\n\nOutput: ${responseMessage}`);
  });
});

// Start the server, listening on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});