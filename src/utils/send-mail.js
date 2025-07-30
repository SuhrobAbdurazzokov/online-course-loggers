import { createTransport } from "nodemailer";
import config from "../config/index.js";

export const sendOtpToMail = async (mail, otp) => {
    const transporter = createTransport({
        port: config.MAIL.PORT,
        host: config.MAIL.HOST,
        auth: {
            user: config.MAIL.MAIL,
            pass: config.MAIL.PASS,
        },
        secure: false,
    });

    const mailOptions = {
        from: config.MAIL.USER,
        to: mail,
        subject: "n23 marketplace",
        text: otp,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
};
