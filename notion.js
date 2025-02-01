const getNotionDB = async (notion) => {
  console.log("Getting notion database details...");

  // For getting filter_properties
  const res = await notion.databases.retrieve({
    database_id: process.env.MAILING_CONTENT_DATABASE_ID
  });
  // Headers of database has to be of the following for this to work
  const { Attachments, Recipients, Body, Status, Subject} = res.properties;
  const Date = res.properties['Date Scheduled'];
  if (!Attachments || !Recipients || !Body || !Status || !Subject || !Date) return;
  let data = [Attachments, Recipients, Body, Status, Subject, Date];
  data = data.map(e => e.id);
  return data;
}

const getMailContent = async (notion) => {
  console.log("Getting mail content...");
  const filterId = await getNotionDB(notion);
  // console.log(filterId);
  const res = await notion.databases.query({
    database_id: process.env.MAILING_CONTENT_DATABASE_ID,
    // dynamically get ID
    filter_properties: filterId,
  });

  const { results } = res;

  let data = [];

  for (const result of results) {
    const { id } = result;
    const { Subject, Status, Body, Recipients, Attachments } = result.properties;
    const Date = result.properties["Date Scheduled"].date;
    if (Subject.title.length === 0 || Body.rich_text.length === 0 || Recipients.relation.length === 0) {
      continue;
    }
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
      "date": Date ? Date.start : null,
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
    if (Name.title.length === 0 || !Email.email) {
      continue;
    }
    data[id] = {
      "name": Name.title[0].plain_text,
      "email": Email.email
    }
  }
  return data;
}

const updateStatus = (notion, id, status) => {
  console.log("Updating " + id + " to " + status + " on notion...");
  notion.pages.update({
    page_id: id,
    properties: {
      Status: {
        status: {
          name: status
        }
      }
    },
  });
}

export { getNotionDB, getMailContent, getMailContacts, updateStatus };