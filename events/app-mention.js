/*------------------
    APP MENTION
------------------*/

const appMention = (app) => {
  app.event('app_mention', async ({ event, context }) => {
    try {
      const result = await app.client.chat.postEphemeral({
          token: context.botToken,
          channel: event.channel,
          user: event.user,
          text: `:wave: Hi there! If you'd like to submit a donation, go to my *<slack://app?team=${process.env.SLACK_TEAM_ID}&id=${process.env.SLACK_APP_ID}&tab=messages|App Messages>* and talk to me there! Your donation information is confidential and I value your privacy, so let's chat 1:1 :simple_smile:`
        });
    }
    catch (err) {
      console.error(err);
    }
  });
};

module.exports = appMention;
