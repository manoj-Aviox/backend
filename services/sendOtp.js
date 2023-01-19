import nodemailer from "nodemailer";

const sendOtp = async (userEmail, otp) => {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"${process.env.NAME}"
     ${process.env.EMAIL}`,
    to: "manojkushwah1066@gmail.com",
    subject: "Reset Password",
    html: `<div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to the club.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">
          Pleas enter the sign up OTP to get started
        </p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">
          ${otp}
        </h1>
      </div>`,
  });
};

export default sendOtp;
