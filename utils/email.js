import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, url) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `<p>Please verify your email by clicking the link: <a href="${url}">Verify Email</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {}
};

export default sendEmail;
