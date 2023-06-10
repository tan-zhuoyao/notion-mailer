const { updateStatus } = require('./notion');

const processMail = (mails, mailContacts, notion, transporter) => {
  for (const email of mails) {
    const { id, subject, body, recipients } = email;
    const recipientEmails = recipients.map(e => mailContacts[e].email).join(", ");
    console.log("Sending to: " + recipientEmails);
    sendMail(notion, transporter, recipientEmails, id, subject, body);
  }
}

const sendMail = (notion, transporter, recipients, pageId, subject, body) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: recipients,
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      updateStatus(notion, pageId, "Failed")
    } else {
      console.log('Email sent: ' + info.response);
      updateStatus(notion, pageId, "Done");
    }
  });
}

module.exports = { processMail, sendMail };