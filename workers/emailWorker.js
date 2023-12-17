const { isMainThread, parentPort } = require("worker_threads");
const nodemailer = require("nodemailer");

if (!isMainThread) {
  parentPort.on("message", async ({ email, confirmationCode }) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.AUTH_USER,
          pass: process.env.AUTH_PASS,
        },
      });

      const mailOption = {
        from: process.env.AUTH_USER, // sender address
        to: email, // list of receivers
        subject: "Confirmation Code",
        html: `
            <html>
          <head>
            <style>
              /* CSS styles for your email content */
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
              }
              .container {
                width: 80%;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #007bff;
              }
              p {
                font-size: 16px;
              }
      
            </style>
          </head>
          <body>
            <div class="container">
                <h1>Welcome to बिक्रि डट कम !</h1>
              <p>This is your email confirmation code to get started.</p>
              <p>CODE NUMBER : ${confirmationCode}</p>
            </div>
          </body>
        </html>
            `,
      };

      await transporter.sendMail(mailOption);
      // Send email
      parentPort.postMessage({
        status: "success",
        message: "Email sent successfully",
      });
    } catch (error) {
      parentPort.postMessage({
        status: "error",
        message: "Failed to send email",
      });
    }
  });
}
