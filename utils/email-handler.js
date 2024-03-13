const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendFileSharingEmail({ senderName, fileUrl, emailReceiver }) {
  let transporter = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_port,
    auth: {
      user: process.env.email_user,
      pass: process.env.email_pass,
    },
    tls: { rejectUnauthorized: false },
  });

  const html = `
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h1 style="font-family: 'Arial', sans-serif; color: #333333; margin-bottom: 20px;">📁 File Shared Notification 📁</h1>
      <p style="font-family: 'Arial', sans-serif; color: #666666; font-size: 16px;">Hi there,</p>
      <p style="font-family: 'Arial', sans-serif; color: #666666; font-size: 16px;">${senderName} has shared a file with you.</p>
      <p style="font-family: 'Arial', sans-serif; color: #666666; font-size: 16px;">You can download it <a href="${fileUrl}" style="color: #007bff; text-decoration: none;">here</a>.</p>
      <br>
      <p style="font-family: 'Arial', sans-serif; color: #666666; font-size: 16px;">Best regards,</p>
      <p style="font-family: 'Arial', sans-serif; color: #666666; font-size: 16px;">Cloud Data Transfer Team</p>
    </div>
  </div>
  `;

  let info = await transporter.sendMail({
    from: `Cloud Data Transfer <${process.env.email_user}>`,
    to: emailReceiver,
    subject: `${senderName} shared a file with you`,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log(info);
}

module.exports = {
  sendFileSharingEmail,
};
