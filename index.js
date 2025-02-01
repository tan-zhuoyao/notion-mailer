import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Client } from "@notionhq/client";

import Scheduler from "./scheduler.js";
import createTransporter from "./transporter.js";
import poll from './poll.js';


// Setup Notion client
const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY,
})

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

if (process.env.NODE_ENV !== "test") {
  let transporter = await createTransporter();
  const scheduler = new Scheduler();
  poll(notion, transporter, scheduler);
}
  

export default server;