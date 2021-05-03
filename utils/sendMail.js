const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(attachment,subjet) {
  // Generate test SMTP service account from ethereal.email
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "noreply@kashinloans.com", // 
      pass: "Colombia2025*", // 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Kashin Loans Service" <noreply@kashinloans.com>', // sender address
    to: "rmanotas@geotech.com.co", // list of receivers
    subject: subjet, // Subject line
    text: "Please check the attachment", // plain text body
    html: "<b>Please check the attachment</b>", // html body
    attachments: attachment ? {
        filename: attachment,
        path: attachment
      } : undefined
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = { main };