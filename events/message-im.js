const utils = require('./../utils');

/*------------------
       BOT DM
------------------*/

const botDM = (app) => {
  app.event('message', async ({ event, context }) => {
    // console.log('message.im', event, utils.getUserName(event.user, app));
    const parsedMsg = await utils.parseBotDM(event, app);
    console.log(parsedMsg);

    if (parsedMsg) {

    } 
    // Message couldn't be parsed into a usable command
    else {
      try {
        const sendMsg = await app.client.chat.postMessage({
          token: context.botToken,
          channel: event.channel,
          text: ":shrug: I'm sorry, I didn't understand that. Share your donation with me like this: ```[Name of organization] $[donation amount in USD] [any additional comments]```:paperclip: Make sure you also *attach a photo of your donation receipt*!"
        });
      }
      catch (err) {
        console.error(err);
      }
    }
  });
};

module.exports = botDM;
