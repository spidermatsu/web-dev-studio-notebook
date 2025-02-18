const nodemailer = require("nodemailer");

//send email
function sendEmail(email, magicLink) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, //virtua pet
            pass: process.env.EMAIL_PASS //app passwprd
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "virtual pet",
        text: `click this link to access the pet: ${process.env.URL}/pet?magicLink=${magicLink} (expires in 24 hours)`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.error("Error sending email:", err);
        }
        console.log(`Email sent to ${email}: ${info.response}`);
    });
}

module.exports = {
    sendEmail
}