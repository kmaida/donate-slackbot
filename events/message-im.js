const utils = require('./../utils');

/*------------------
       BOT DM
------------------*/

const botDM = (app) => {
  app.event('message', async ({ event, context }) => {
    console.log('message.im', event, context);
    try {
      const sendMsg = await app.client.chat.postMessage({
        token: context.botToken,
        channel: event.channel,
        text: `:thinking_face: I'm sorry, I don't understand. Go to my *<slack://app?team=${process.env.SLACK_TEAM_ID}&id=${process.env.SLACK_APP_ID}&tab=home|App Home tab>* to find out how I work!`
      });
    }
    catch (err) {
      console.error(err);
    }
  });
};

module.exports = botDM;
