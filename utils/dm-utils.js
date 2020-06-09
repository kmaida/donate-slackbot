const utils = require('./utils');

/*------------------
      DM UTILS
------------------*/

const dmUtils = {
  /*---
    Parse bot DM event payload
    @Param: event (event object)
    @Param: Slack app
    @Return: parsed donation payload || boolean
  ---*/
  async parseBotDM(event, app) {
    // Fetch user's name from their Slack ID
    const getName = await dmUtils.getUserName(event.user, app);
    // E.g., "Act Blue $30 Thank you for matching my donation!"
    const regex = /^([a-zA-Z0-9\-\s]+) \$([0-9.,]+?) (.*)$/g;
    // Add a space to match regex in case "notes" are missing
    const prepText = event.text.trim() + ' ';
    // If command matches regex, that means it can be parsed into an object
    const canParse = new RegExp(regex).test(prepText);

    // If command is parseable and has file attachment, return payload
    if (canParse && event.files && event.files.length) {
      // Use regex to get match groups from command text
      const textArray = [...prepText.matchAll(new RegExp(regex))][0];
      // Coerce donation amount into a number
      const donation = textArray[2].replace(',', '') * 1;
      // Get string containing comma-separated links to uploaded receipt files
      const receipts = await dmUtils.getReceipts(event.files, app);
      // Create data payload for Airtable
      const payload = {
        name: getName,
        date: dmUtils.parseSlackTs(event.ts),
        organization: textArray[1],
        donation: donation,
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
      // Make files public so they can be inserted into Airtable
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
    Convert Slack timestamp into ISO date
    @Param: Slack string timestamp (e.g., '1591547570.002300')
    @Return: ISO date string (YYYY-MM-DD)
  ---*/
  parseSlackTs(timeStr) {
    const timestamp = timeStr.substring(0, timeStr.length-3).replace('.', '') * 1;
    const isoDate = new Date(timestamp).toISOString().split('T')[0];
    return isoDate;
  },
  /*---
    Get Slack user's name from profile info
    @Param: user's Slack ID
    @Return: user's normalized real name
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
