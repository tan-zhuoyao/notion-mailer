# Notion Mailer 📬
## Description
A Notion integration tool to automate and manage email workflows. It allows Notion users to send emails instantly or
schedule it for a later date, all within Notion itself.

## Prerequisites
1. A Notion account
2. A Notion page with the same databases<br/>
You can duplicate this page into your workspace:
https://deeply-wire-8e9.notion.site/Notion-Mailer-Template-7b1080e1b60f4b129e0d20536ba97c94
4. A Notion private integration that has access to your workspace<br/>
Reference: https://developers.notion.com/docs/create-a-notion-integration


## How to setup
1. In root directory, add a .env file containing the following environment variables:
```
NOTION_SECRET_KEY={your notion integration secret key}
MAILING_CONTACTS_DATABASE_ID={database ID of mailing contacts database}
MAILING_CONTENT_DATABASE_ID={database ID of mailing content database}
EMAIL_PW={email password for the sender email account}
EMAIL_SENDER={sender email address}
EMAIL_PROVIDER={email provider e.g. gmail}
```
- To create an application specific `EMAIL_PW`, refer to https://support.google.com/mail/answer/185833?hl=en

2. Run `npm install` to install all dependencies
3. Run `node index.js` to start the Node server to poll for Notion database updates
4. You can also choose to deploy the server on your preferred cloud provider

## Future Plans
- I would be looking into deploying this application and making the Notion integration I created public to turn this project into a SaaS
- Future integrations with other platforms like TikTok, LinkedIn for scheduling of various posts
- Write tests

## How to contribute
Feel free to open PRs to contribute to this repository! As I am still new to open source development, I would love to get in touch with other developers too!<br/>
Alternatively, I am contactable at tanzhuoyao@gmail.com
