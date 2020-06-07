/*------------------
       UTILS
------------------*/

const utils = {
  /*---
    Parse bot DM event payload
    @Param: event (event object)
    @Return: parsed donation payload
  ---*/
  async parseBotDM(event, app) {
    const name = await utils.getUserName(event.user, app);
    const payload = {
      name: name,
      date: utils.parseSlackTs(event.ts),
      organization: undefined,
      amount: undefined,
      notes: undefined,
      receipt: utils.getAttachments(event.files),
      slackID: event.user
    };
    return payload;
  },
  /*---
    Get file attachments for Airtable insertion
    @Param: array of file objects
    @Return: array of Airtable-friendly attachments
  ---*/
  getAttachments(fileArray) {
    const attachments = [];
    // https://airtable.com/appr4NMteSocmLLLR/api/docs#javascript/table:donations:create
    fileArray.forEach((fileObj) => {
      urlArr.push({ url: fileObj.url_private });
    });
    return attachments;
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
      return userInfo.real_name_normalized;
    }
    catch (err) {
      console.error(err);
    }
  }
};

module.exports = utils;
