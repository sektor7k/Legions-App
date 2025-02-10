import nodemailer from 'nodemailer';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Create a hashed token based on the user ID.
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update the user's record with the appropriate token and expiry.
    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyExpire: Date.now() + 3600000, // 1 hour expiry
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpire: Date.now() + 3600000, // 1 hour expiry
      });
    }

    // Create a Nodemailer transporter using Gmail SMTP. 
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD, // Gerçek şifrenizi veya uygulama şifrenizi kullanın.
      },
    });

    // Common header HTML with logo on the left.
    const headerHTML = `
      <div class="header">
        <div class="logo">
          <img src="https://ooebgkzgto.ufs.sh/f/pc2uFj4UDvXVuHKpEYBLS5f0rJCxs2kvt6BH7MYuDIwe8Qah" alt="Logo" />
        </div>
        <div class="title">
          <h1>Castrum Legions</h1>
        </div>
      </div>
    `;

    // Common footer HTML.
    const footerHTML = `
      <div class="footer">
        &copy; ${new Date().getFullYear()} Castrum Legions. All rights reserved.
      </div>
    `;

    // Common CSS styles.
    const commonStyle = `
      <style>
        body {
          background-color: #f0f0f0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #000000;
          padding: 20px;
          display: flex;
          align-items: center;
        }
        .logo img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
        .title h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          color: #555555;
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          background-color: #000000;
          color: #ffffff;
          text-decoration: none;
          padding: 15px 25px;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #999999;
          background-color: #f0f0f0;
        }
        a {
          color: #007BFF;
        }
      </style>
    `;

    // Verify email template (English content).
    const verifyTemplate = `
      <html>
        <head>
          <meta charset="UTF-8" />
          ${commonStyle}
        </head>
        <body>
          <div class="container">
            ${headerHTML}
            <div class="content">
              <p>Hello,</p>
              <p>
                Thank you for signing up with Castrum Legions! To activate your account,
                please verify your email address by clicking the button below.
              </p>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/verifyemail?token=${hashedToken}" class="button">
                  Verify Email
                </a>
              </p>
              <p>
                If the button does not work, please copy and paste the following URL into your browser:
              </p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/verifyemail?token=${hashedToken}">
                  ${process.env.NEXT_PUBLIC_APP_URL}/verifyemail?token=${hashedToken}
                </a>
              </p>
              <p>Thank you,<br/>The Castrum Legions Team</p>
            </div>
            ${footerHTML}
          </div>
        </body>
      </html>
    `;

    // Password reset template (English content).
    const resetTemplate = `
      <html>
        <head>
          <meta charset="UTF-8" />
          ${commonStyle}
        </head>
        <body>
          <div class="container">
            ${headerHTML}
            <div class="content">
              <p>Hello,</p>
              <p>
                We received a request to reset the password for your Castrum Legions account.
                Click the button below to reset your password.
              </p>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/resetpassword?token=${hashedToken}" class="button">
                  Reset Password
                </a>
              </p>
              <p>
                If you did not request a password reset, please ignore this email.
              </p>
              <p>
                If the button does not work, please copy and paste the following URL into your browser:
              </p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/resetpassword?token=${hashedToken}">
                  ${process.env.NEXT_PUBLIC_APP_URL}/resetpassword?token=${hashedToken}
                </a>
              </p>
              <p>Thank you,<br/>The Castrum Legions Team</p>
            </div>
            ${footerHTML}
          </div>
        </body>
      </html>
    `;

    // Define mail options.
    const mailOptions = {
      from: {
        address: 'support@castrumlegions.com',
        name: 'Castrum Legions',
      },
      to: {
        address: email,
        name: 'User',
      },
      subject:
        emailType === 'VERIFY'
          ? 'Please Verify Your Email Address'
          : 'Password Reset Request',
      text:
        emailType === 'VERIFY'
          ? 'To activate your account, please verify your email address by clicking the provided link.'
          : 'We received a request to reset your password. Please check your email for further instructions.',
      html: emailType === 'VERIFY' ? verifyTemplate : resetTemplate,
    };

    // Send the email.
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.error('Error sending email:', error.message);
    throw new Error(error.message);
  }
};
