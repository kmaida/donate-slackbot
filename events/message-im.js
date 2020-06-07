const dmUtils = require('./../utils/dm-utils');

/*------------------
       BOT DM
------------------*/

const botDM = (app, at) => {
  app.event('message', async ({ event, context }) => {
    // Parse the message
    const parsedMsg = await dmUtils.parseBotDM(event, app);

    // If message is parsed properly
    if (parsedMsg) {
      // @TODO: save to Airtable (in Airtable success callback, send confirmation message to user)
      console.log(parsedMsg);
      // at.saveDonation(app, parsedMsg);
    }
    // Message couldn't be parsed OR data was missing
    else {
      try {
        const sendMsg = await app.client.chat.postMessage({
          token: context.botToken,
          channel: event.channel,
          text: ":shrug: I'm sorry, I didn't understand that. Please share your donation with me like this: ```[Name of organization] $[donation amount in USD] [any additional comments]```:paperclip: Make sure you also *attach a photo of your donation receipt*!"
        });
      }
      catch (err) {
        console.error(err);
      }
    }
  });
};

module.exports = botDM;
