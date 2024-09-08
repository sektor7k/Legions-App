import nodemailer from 'nodemailer';
import User from '@/models/User';
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {

    //create a hased token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId,
        { verifyToken: hashedToken, verifyExpire: Date.now() + 3600000 })
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId,
        { forgotPasswordToken: hashedToken, forgotPasswordExpire: Date.now() + 3600000 })
    }
    
    var transport = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "api",
        pass: "ae6401ff1428345a2eaced42758d81e2"
      }
    });
    
    const mailOptions = {
      from: {
        address: 'smtp.mailtrap.live', // Kendi domaininize ait bir e-posta adresi
        name: 'Your Application'
      },
      to: {
        address: email,
        name: 'User'
      },
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      text: "Hello world?",
      html: emailType === "VERIFY" ?
        `<html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f9;
                  color: #333;
                  padding: 20px;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 10px 0;
                  background-color: #4CAF50;
                  color: white;
                  border-radius: 5px;
                  text-decoration: none;
                }
                .button:hover {
                  background-color: #45a049;
                }
                .content {
                  background-color: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
              </style>
            </head>
            <body>
              <div class="content">
                <h1>Welcome to Our Service!</h1>
                <p>Thank you for signing up. Please complete your registration process.</p>
                <p>Click the button below to verify your email:</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/verifyemail?token=${hashedToken}" class="button">
                  Verify Email
                </a>
                <p>If the button doesn't work, please copy and paste the link below into your browser:</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/verifyemail?token=${hashedToken}">${process.env.NEXT_PUBLIC_APP_URL}/verifyemail?token=${hashedToken}</a></p>
              </div>
            </body>
            </html>
            `:
        `<html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; padding: 20px; }
        .button { display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #007BFF; color: white; border-radius: 5px; text-decoration: none; }
        .button:hover { background-color: #0069D9; }
        .content { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
      </style>
    </head>
    <body>
      <div class="content">
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password. Please click the button below to proceed:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/resetpassword?token=${hashedToken}" class="button">Reset Password</a>
        <p>If the button doesn't work, please copy and paste the link below into your browser:</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/resetpassword?token=${hashedToken}">${process.env.NEXT_PUBLIC_APP_URL}/resetpassword?token=${hashedToken}</a></p>
      </div>
    </body>
  </html>`
    }

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;

  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
}