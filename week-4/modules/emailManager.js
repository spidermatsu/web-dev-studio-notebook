const nodemailer = require("nodemailer");

// Email sending function (requires Gmail setup in .env)
function sendEmail(email, magicLink) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail
            pass: process.env.EMAIL_PASS  // App password
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Magic Link",
        text: `Click this link to access: ${magicLink} (Expires in 24 hours)`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.error("Error sending email:", err);
        }
        console.log(`Email sent to ${email}: ${info.response}`);
    });
}

module.exports = { sendEmail }