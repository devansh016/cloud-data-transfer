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
  const text = `Hi there, ${senderName} has shared a file with you. You can download it from ${fileUrl} \n  \n Thanks, \n Cloud Data Transfer`;

  let info = await transporter.sendMail({
    from: `Cloud Data Transfer <${process.env.email_user}>`,
    to: emailReceiver,
    subject: senderName + " shared a file with you ",
    text: text,
  });
  console.log("Message sent: %s", info.messageId);
  console.log(info);
}

module.exports = {
  sendFileSharingEmail,
};
