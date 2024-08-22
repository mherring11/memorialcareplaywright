const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const filePath = path.join(__dirname, 'results', 'index.html');

async function sendEmail() {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'playwright021224@gmail.com',
            pass: 'Playwright24!'
        }
    });

    if (fs.existsSync(filePath)) {
        const stats = fs.lstatSync(filePath);
        console.log(`File found: ${filePath}`);
        console.log(`Is file: ${stats.isFile()}`);
        console.log(`Is directory: ${stats.isDirectory()}`);

        if (stats.isFile()) {
            let reportHTML = fs.readFileSync(filePath, 'utf-8');

            let mailOptions = {
                from: 'playwright021224@gmail.com',
                to: 'm.herring11@yahoo.com',
                subject: 'Playwright Test Report',
                html: '<h1>Playwright Test Report</h1><p>Please find the attached test report.</p>',
                attachments: [
                    {
                        filename: 'report.html',
                        content: reportHTML,
                        contentType: 'text/html'
                    }
                ]
            };

            try {
                let info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
            } catch (error) {
                console.log('Error sending email: ', error);
            }
        } else {
            console.log('The path exists but it is not a file.');
        }
    } else {
        console.log('The file does not exist.');
    }
}

sendEmail();
