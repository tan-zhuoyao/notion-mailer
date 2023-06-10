const sendMail = (transporter, recipients, subject, body) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: recipients,
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // update notion to done
    }
  });
}

module.exports = { sendMail };