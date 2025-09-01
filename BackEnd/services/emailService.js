import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// La fonction accepte maintenant le destinataire en premier paramètre
export const sendAlertEmail = async (recipient, subject, htmlContent) => {
    const mailOptions = {
        from: `"Système de Gestion Telecom" <${process.env.EMAIL_USER}>`,
        to: recipient, 
        subject: subject,
        html: htmlContent,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", recipient);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};