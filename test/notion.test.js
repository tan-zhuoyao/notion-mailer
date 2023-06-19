require('dotenv').config();

const { getNotionMailingContentDBId, getMailContent, getMailContacts, updateStatus } = require("../notion");
const { Client, APIResponseError } = require("@notionhq/client");

let notion = undefined;

beforeEach(() => {
  notion = new Client({
    auth: process.env.NOTION_SECRET_KEY,
  })
});

test("Get invalid Notion Database", async () => {
  const invalidId = "invalid_id";
  await expect(getNotionMailingContentDBId(notion, invalidId))
    .rejects
    .toThrow(APIResponseError);
})

test("Get valid Notion Database: Mailing Content", async () => {
  const res = await getNotionMailingContentDBId(notion, process.env.MAILING_CONTENT_DATABASE_ID);
  expect(res.length).toBe(6);
})

test("Get wrong Notion Database: Mailing Contacts", async () => {
  const res = await getNotionMailingContentDBId(notion, process.env.MAILING_CONTACTS_DATABASE_ID);
  expect(res).toBe(undefined);
})