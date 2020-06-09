require('dotenv').config();
const { App } = require('@slack/bolt');
// Airtable
const at = require('./data/at-donations');
const atCauses = require('./data/at-causes');

/*------------------
  CREATE BOLT APP
------------------*/
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const port = process.env.PORT || 3000;

/*------------------
    ADD A CAUSE
------------------*/
require('./ix/modal-cause')(app);
require('./ix/view-submit-cause')(app, atCauses);

/*------------------
  APP HOME OPENED
------------------*/
require('./events/app-home-opened')(app, atCauses);

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
