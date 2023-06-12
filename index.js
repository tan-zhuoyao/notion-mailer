require('dotenv').config();

var nodemailer = require('nodemailer');

const { Client } = require("@notionhq/client");
const { Scheduler } = require("./scheduler");
const { getNotionDB, getMailContent, getMailContacts  } = require('./notion');
const { processMail } = require('./mailer');

// Setup Notion client
const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY,
})

const poll = async (notion, transporter, scheduler) => {
  // console.log(scheduler.getJobs());
  const mailContent = await getMailContent(notion);
  // console.log(mailContent);
  const mailContacts = await getMailContacts(notion);
  // console.log(mailContacts);
  
  const readyToPublish = mailContent.filter(mail => 
    mail.status === 'Ready to Publish');
  if (readyToPublish.length === 0) {
    console.log("No mail to send");
  } else {
    console.log("Processing and sending mail...");
    processMail(readyToPublish, mailContacts, notion, transporter, scheduler);
  }
  
  console.log("Done polling process.");
  
  setTimeout(() => poll(notion, transporter, scheduler), 1000 * 60);
}

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PW
  }
});

const scheduler = new Scheduler();

poll(notion, transporter, scheduler);
// getNotionDB(notion);

