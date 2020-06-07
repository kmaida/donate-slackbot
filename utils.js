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
    const getName = await utils.getUserName(event.user, app);
    const textRegex = new RegExp(/^([a-zA-Z0-9\-\s]+) \$([0-9.,]+?) (.*)$/g);
    const prepText = event.text.trim() + ' '; // Add a space to match regex
    console.log(getName);
    const textArray = [...prepText.matchAll(textRegex)][0];
    const payload = {
      name: getName,
      date: utils.parseSlackTs(event.ts),
      organization: textArray[1],
      amount: textArray[2],
      notes: textArray[3],
      receipt: event.files ? utils.getAttachments(event.files) : undefined,
      slackID: event.user
    };
    console.log(textArray);
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
      return userInfo.user.profile.real_name_normalized;
    }
    catch (err) {
      console.error(err);
    }
  }
};

module.exports = utils;
