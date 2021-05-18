import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "b35olhdt4olix6nd@ethereal.email", // generated ethereal user
      pass: "3cjAKZWNcc4WJSG4W6", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Cesar Foo 👻" <foo@example.com>', // sender address
    to,
    subject: "Change Password ✔", // Subject line
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
