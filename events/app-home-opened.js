/*------------------
  APP HOME OPENED
------------------*/

const appHomeOpened = async (app, at) => {
  /*----
    EVENT: app-home-opened
  ----*/
  app.event('app_home_opened', async ({ event, context }) => {
    // Publish this user's home view
    try {
      const showHomeView = await app.client.views.publish({
        token: context.botToken,
        user_id: event.user,
        view: {
          "type": "home",
          "blocks": []
        }
      });
    }
    catch (err) {
      console.error(err);
    }
  });
}

module.exports = appHomeOpened;
