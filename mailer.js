const { updateStatus } = require('./notion');
const schedule = require('node-schedule');

const processMail = (mails, mailContacts, notion, transporter, scheduler) => {
  for (const email of mails) {
    const { id, subject, body, recipients, date } = email;
    if (scheduler.containsJob(id)) {
      if (date) {
        console.log(id + " exists, schedule to " + date);
        scheduler.rescheduleJob(id, new Date(date));
      } else {
        console.log(id + ": deleting scheduled job as no date input");
        scheduler.deleteJob(id);
      }
      continue;
    }
    const recipientEmails = recipients.map(e => mailContacts[e].email).join(", ");
    if (date) {
      console.log("Scheduling mail to: " + recipientEmails);
      const scheduledDate = new Date(date);
      let job = schedule.scheduleJob(scheduledDate, () => {
        sendMail(notion, transporter, recipientEmails, id, subject, body, scheduler);
      })
      if (job) scheduler.addJob(id, job);
    } else {
      console.log("Sending to: " + recipientEmails);
      sendMail(notion, transporter, recipientEmails, id, subject, body);
    }
  }
}

const sendMail = (notion, transporter, recipients, pageId, subject, body, scheduler) => {
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
    if (scheduler) scheduler.deleteJob(pageId);
  });
}

module.exports = { processMail, sendMail };