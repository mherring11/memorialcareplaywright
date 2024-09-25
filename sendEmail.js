const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const testResult = process.argv[2]; 

async function sendEmail() {
    let transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
          user: 'm.herring11@yahoo.com', 
          pass: 'imtifprmzfhyveow'  
        }
    });

    const screenshotDir = path.join(__dirname, 'results', 'testResultsScreenshot');
    const files = fs.readdirSync(screenshotDir).map(file => ({
        filename: file,
        path: path.join(screenshotDir, file)
    }));

    let mailOptions = {
        from: 'm.herring11@yahoo.com',
        to: 'mherring@clickherelabs.com', 
        subject: `Playwright Test Result: ${testResult}`,
        text: `Attached are the screenshots from the latest Playwright test. The test result is: ${testResult}.`,
        attachments: files
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log('Error sending email: ', error);
    }
}

sendEmail();
