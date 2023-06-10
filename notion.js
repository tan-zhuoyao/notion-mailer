const getNotionDB = async (notion) => {
  console.log("Getting notion database details...");

  // For getting filter_properties
  const res = await notion.databases.retrieve({
    database_id: process.env.MAILING_CONTENT_DATABASE_ID
  });
  console.log(res)
  return res;
}

const getMailContent = async (notion) => {
  console.log("Getting mail content...");
  const res = await notion.databases.query({
    database_id: process.env.MAILING_CONTENT_DATABASE_ID,
    filter_properties: ["title", "YM%3FS", "T%5DIG", "%3C~xq", "vUpz"]
  });

  const { results } = res;

  let data = [];

  for (const result of results) {
    const { id } = result;
    const { Subject, Status, Body, Recipients, Attachments } = result.properties;
    const relations = Recipients.relation;
    let ids = [];
    for (const relation of relations) {
      ids.push(relation.id);
    }
    data.push({
      'id': id,
      "subject": Subject.title[0].plain_text,
      "body": Body.rich_text[0].plain_text,
      "recipients": ids,
      "attachments": Attachments.files,
      "status": Status.status.name,
    })
  }

  return data;
}

const getMailContacts = async (notion) => {
  console.log("Getting mail contacts...");
  const res = await notion.databases.query({
    database_id: process.env.MAILING_CONTACTS_DATABASE_ID,
    filter_properties: ["title", "R%7DM%5B"]
  });

  const { results } = res;
  let data = {};
  for (const result of results) {
    const { id, properties } = result;
    const { Name, Email } = properties;
    data[id] = {
      "name": Name.title[0].plain_text,
      "email": Email.email
    }
  }
  return data;
}

const updateStatusToDone = (notion, id) => {
  console.log("Updating " + id + " to done on notion...");
  notion.pages.update({
    page_id: id,
    properties: {
      Status: {
        status: {
          name: "Done"
        }
      }
    },
  });
  // TODO: error handling
}

module.exports = { getNotionDB, getMailContent, getMailContacts, updateStatusToDone };