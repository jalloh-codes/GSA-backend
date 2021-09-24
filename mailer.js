"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "blessmuss@gmail.com", // generated ethereal user
      pass: "NakryOutLaw@1", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"GSA PORTAL 🇬🇳 " <blessmuss@gmail.com>', // sender address
    to: "zsbwybxlqywkgkttti@mrvpm.net", // list of receivers
    subject: "GSA PORTAL 🇬🇳", // Subject line
    text: "Hello New User 🤗", // plain text body
    html: `<b>Hello user?</b>
            <div> 
                <p> Pleace verify your email addredd</p>
            </div>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
