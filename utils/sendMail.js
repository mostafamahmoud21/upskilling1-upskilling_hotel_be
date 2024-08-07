const nodemailer = require('nodemailer');

const sendMail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    });

    console.log('Message sent:', info.messageId);
};

module.exports = { sendMail };
