const utils = require('./utils');

/*------------------
      DM UTILS
------------------*/

const dmUtils = {
  /*---
    Parse bot DM event payload
    @Param: event (event object)
    @Return: parsed donation payload
  ---*/
  async parseBotDM(event, app) {
    const getName = await dmUtils.getUserName(event.user, app);
    const regex = /^([a-zA-Z0-9\-\s]+) \$([0-9.,]+?) (.*)$/g;
    const prepText = event.text.trim() + ' '; // Add a space to match regex

    // If command can be parsed, verify the parsed message
    const canParse = new RegExp(regex).test(prepText);
    if (canParse && event.files && event.files.length) {
      const textArray = [...prepText.matchAll(new RegExp(regex))][0];
      const receipts = await dmUtils.getReceipts(event.files, app);
      // Create data payload for Airtable
      const payload = {
        name: getName,
        date: dmUtils.parseSlackTs(event.ts),
        organization: textArray[1],
        amount: textArray[2],
        notes: textArray[3],
        receipt: receipts,
        slackID: event.user
      };
      return payload;
    }
    // If command cannot be parsed or receipt is missing, return false
    else {
      return false;
    }
  },
  /*---
    Get receipts for Airtable insertion
    @Param: array of file objects
    @Param: Slack app
    @Return: string of receipt URLs
  ---*/
  async getReceipts(fileArray, app) {
    let attachments = [];
    await utils.asyncForEach(fileArray, async (item) => {
      const getFile = await app.client.files.sharedPublicURL({
        token: process.env.SLACK_OAUTH_TOKEN, 
        file: item.id
      });
      const permalink = getFile.file.permalink_public;
      const attachmentItem = permalink;
      attachments.push(attachmentItem);
    });
    return attachments.join(', ');
  },
  /*---
    Get file attachments for Airtable insertion
    @Param: Slack string timestamp (e.g., '1591547570.002300')
    @Return: ISO date
  ---*/
  parseSlackTs(timeStr) {
    const timestamp = timeStr.substring(0, timeStr.length-3).replace('.', '') * 1;
    const isoDate = new Date(timestamp).toISOString().split('T')[0];
    return isoDate;
  },
  /*---
    Get Slack user's name from profile info
    @Param: User ID
    @Return: User's name
  ---*/
  async getUserName(userID, app) {
    try {
      const userInfo = await app.client.users.info({
        token: process.env.SLACK_BOT_TOKEN,
        user: userID
      });
      return userInfo.user.profile.real_name_normalized;
    }
    catch (err) {
      console.error(err);
    }
  }
};

module.exports = dmUtils;
