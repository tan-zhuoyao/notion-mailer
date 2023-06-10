require('dotenv').config();
const { Client } = require("@notionhq/client");
const { getNotionDB, getMailContent, getMailContacts } = require('./notion');

// Setup Notion client
const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY,
})

const pollNotion = async (notion) => {
  const mailContent = await getMailContent(notion);
  console.log(mailContent);
  const mailContacts = await getMailContacts(notion);
  console.log(mailContacts);
  
  
  setInterval(() => pollNotion(notion), 1000 * 60);
}

pollNotion(notion);
// getNotionDB(notion);
// getMailContacts(notion);



