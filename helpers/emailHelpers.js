const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
    
      user: process.env.mail_id,
      pass: process.env.pass_id
    },
  });



module.exports={
    transporter
}