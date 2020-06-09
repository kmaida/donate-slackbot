/*------------------
Add Charitable Cause
 Command & Shortcut
------------------*/

const modalCause = (app) => {
  const openCauseModal = async ({ ack, body, context }) => {
    await ack();
    try {
      const result = await app.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'add_cause',
          title: {
            type: 'plain_text',
            text: 'Add a Charitable Cause'
          },
          blocks: [
            {
              "type": "input",
              "block_id": "organization",
              "element": {
                "type": "plain_text_input",
                "action_id": "a_organization",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Charity Name"
                }
              },
              "label": {
                "type": "plain_text",
                "text": "Organization:"
              }
            },
            {
              "type": "input",
              "block_id": "url",
              "element": {
                "type": "plain_text_input",
                "action_id": "a_url",
                "placeholder": {
                  "type": "plain_text",
                  "text": "https://..."
                }
              },
              "label": {
                "type": "plain_text",
                "text": "Organization URL:"
              }
            },
            {
              "type": "input",
              "block_id": "description",
              "element": {
                "type": "plain_text_input",
                "action_id": "a_description",
                "multiline": true,
                "placeholder": {
                  "type": "plain_text",
                  "text": "Briefly describe this charity's purpose."
                }
              },
              "label": {
                "type": "plain_text",
                "text": "Description:"
              },
              "optional": true
            }
          ],
          submit: {
            type: 'plain_text',
            text: 'Save Cause'
          }
        }
      });
    }
    catch (err) {
      console.error(err);
    }
  };
  // Command /donation-cause
  app.command('/donation-cause', openCauseModal);
  // Global shortcut to add a cause
  app.shortcut('add_cause', openCauseModal);
};

module.exports = modalCause;
