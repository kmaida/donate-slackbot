/*------------------
       UTILS
------------------*/

const utils = {
  /*---
    Parse bot DM event payload
    @Param: event (event object)
    @Return: parsed donation payload
  ---*/
  parseBotDM(event) {
    const payload = {
      name: undefined,
      date: utils.parseSlackTs(event.ts),
      organization: undefined,
      amount: undefined,
      notes: undefined,
      receipt: utils.getAttachments(event.files),
      slackID: event.user
    };
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
  }
};

module.exports = utils;
