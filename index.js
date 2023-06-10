require('dotenv').config();

var nodemailer = require('nodemailer');

const { Client } = require("@notionhq/client");
const { getNotionDB, getMailContent, getMailContacts } = require('./notion');
const { sendMail } = require('./mailer');

// Setup Notion client
const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY,
})

const poll = async (notion, transporter) => {
  const mailContent = await getMailContent(notion);
  console.log(mailContent);
  const mailContacts = await getMailContacts(notion);
  console.log(mailContacts);
  sendMail(transporter);
  
  setInterval(() => poll(notion, transporter), 1000 * 60);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tanzhuoyao@gmail.com',
    pass: process.env.EMAIL_PW
  }
});

poll(notion, transporter);





