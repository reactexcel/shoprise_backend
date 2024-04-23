import * as nodemailer from 'nodemailer';

export const mailSender = async (
  senderEmail: string,
  recieverEmail: string,
  message: string,
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const mailOptions = {
    from: `"shop-rise" <${senderEmail}>`,
    to: recieverEmail,
    subject: 'Message',
    html: `<div>
  
               <p>Hello, ${message}</p>
               
            </div>`,
  };
  await transporter.sendMail(mailOptions);
};
