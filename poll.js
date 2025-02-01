import { getMailContent, getMailContacts } from './notion.js';
import { processMail } from './mailer.js';

const poll = async (notion, transporter, scheduler) => {
  // console.log(scheduler.getJobs());
  const mailContent = await getMailContent(notion);
  // console.log(mailContent);
  const mailContacts = await getMailContacts(notion);
  // console.log(mailContacts);
  const filteredMail = mailContent.filter(mail =>
    mail.status === 'Ready to Publish' || (mail.status === 'Scheduled' && !!mail.date));
  if (filteredMail.length === 0) {
    console.log("No mail to send");
  } else {
    console.log("Processing and sending mail...");
    processMail(filteredMail, mailContacts, notion, transporter, scheduler);
  }
  console.log("Done polling process.");

  setTimeout(() => poll(notion, transporter, scheduler), 1000 * 30);
}

export default poll;