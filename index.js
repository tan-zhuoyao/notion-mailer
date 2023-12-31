require('dotenv').config();

var nodemailer = require('nodemailer');

const http = require('http');
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

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PW
  }
});

const scheduler = new Scheduler();

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

poll(notion, transporter, scheduler);
// getNotionDB(notion);

