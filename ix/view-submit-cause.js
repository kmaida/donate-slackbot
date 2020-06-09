const utils = require('./../utils/utils');

/*------------------
 VIEW SUBMIT CAUSE
------------------*/

const submitCause = (app, atCauses) => {
  // Modal view submitted
  app.view('add_cause', async ({ ack, body, view, context }) => {
    const bc = {
      userID: body.user.id,
      userMention: `<@${body.user.id}>`,
      botToken: context.botToken,
      botID: context.botUserId
    };
    const homeParams = view.private_metadata ? JSON.parse(view.private_metadata) : {};
    const payload = view.state.values;
    // Capture data from modal interactions
    const data = {
      organization: payload.organization.a_organization.value,
      url: payload.url.a_url.value,
      description: payload.description.a_description.value || ''
    };
    // Validate form fields and handle errors
    // https://api.slack.com/surfaces/modals/using#displaying_errors#displaying_errors
    let ackParams = { 
      response_action: 'errors',
      errors: {}
    };
    if (!utils.validUrl(data.url.toString())) {
      ackParams.errors.url = 'Please provide a valid URL.';
    }
    if (utils.objNotEmpty(ackParams.errors)) {
      await ack(ackParams);
      return;
    }
    await ack();

    // Save data to Airtable and output results in Slack channel
    try {
      const saveCause = await atCauses.saveCause(app, bc, data, homeParams);
    }
    catch (err) {
      errSlack(app, bc.userID, err);
    }
  });
};

module.exports = submitCause;
