require('dotenv').config();

var nodemailer = require('nodemailer');

const { Client } = require("@notionhq/client");
const { getMailContent, getMailContacts  } = require('./notion');
const { processMail } = require('./mailer');

// Setup Notion client
const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY,
})

const poll = async (notion, transporter) => {
  const mailContent = await getMailContent(notion);
  // console.log(mailContent);
  const mailContacts = await getMailContacts(notion);
  // console.log(mailContacts);
  
  const readyToPublish = mailContent.filter(mail => 
    mail.status === 'Ready to Publish');
  processMail(readyToPublish, mailContacts, notion, transporter);
  
  setInterval(() => poll(notion, transporter), 1000 * 60);
}

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PW
  }
});

poll(notion, transporter);





