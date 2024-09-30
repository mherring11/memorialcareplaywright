// Import the 'nodemailer' module for sending emails
const nodemailer = require('nodemailer');

// Import 'path' and 'fs' modules for working with file and directory paths
const path = require('path');
const fs = require('fs');

// Get the test result argument passed to the script (e.g., "passed" or "failed")
const testResult = process.argv[2]; 

// Define an asynchronous function to handle sending the email
async function sendEmail() {
    // Create a transporter object using Yahoo's email service with authentication credentials
    let transporter = nodemailer.createTransport({
        service: 'yahoo', // Email provider
        auth: {
          user: 'm.herring11@yahoo.com',  // Yahoo email address
          pass: 'imtifprmzfhyveow'         // Yahoo email password or app-specific password
        }
    });

    // Define the directory where screenshots are saved
    const screenshotDir = path.join(__dirname, 'results', 'testResultsScreenshot');
    
    // Read the contents of the directory and create an array of attachments
    // Each file is added with its filename and full path to be attached to the email
    const files = fs.readdirSync(screenshotDir).map(file => ({
        filename: file,
        path: path.join(screenshotDir, file)
    }));

    // Create mail options for the email, including the recipient, subject, and attachments
    let mailOptions = {
        from: 'm.herring11@yahoo.com',  // Sender's email address
        to: 'mherring@clickherelabs.com', // Recipient's email address
        subject: `Playwright Test Result: ${testResult}`,  // Subject line that includes the test result
        text: `Attached are the screenshots from the latest Playwright test. The test result is: ${testResult}.`, // Email body
        attachments: files  // Array of screenshot attachments
    };

    try {
        // Try to send the email with the specified options
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);  // Log a success message if the email is sent
    } catch (error) {
        // Catch and log any errors that occur while sending the email
        console.log('Error sending email: ', error);
    }
}

// Call the sendEmail function to execute the email sending process
sendEmail();