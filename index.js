require('dotenv').config();
const { App } = require('@slack/bolt');
// Airtable
const at = require('./data/airtable');

/*------------------
  CREATE BOLT APP
------------------*/
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const port = process.env.PORT || 3000;

/*------------------
  APP HOME OPENED
------------------*/
require('./events/app-home-opened')(app, at);

/*------------------
    APP MENTION
------------------*/
require('./events/app-mention')(app);

/*------------------
       BOT DM
------------------*/
require('./events/message-im')(app, at);

/*------------------
     START APP
------------------*/
(async () => {
  await app.start(port);
  console.log(`⚡️ donatebot is running on ${port}!`);
})();
