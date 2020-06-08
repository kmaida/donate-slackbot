const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AIRTABLE_DONATIONS;
const tableID = process.env.AIRTABLE_DONATIONS_ID;
const viewID = process.env.AIRTABLE_DONATIONS_VIEW_ID;

/*------------------
      AIRTABLE
------------------*/

const sendErr = (err) => {
  console.error(err);
  return new Error(err);
};

const at = {
  /*----
    Save a new donation
  ----*/
  async saveDonation(app, data) {
    base(table).create([
      {
        "fields": {
          "Name": data.name,
          "Submission Date": data.date,
          "Organization": data.organization,
          "Amount": data.amount,
          "Receipt": data.receipt,
          "Notes": data.notes,
          "Slack ID": data.slackID
        }
      }
    ], (err, records) => {
      if (err) {
        sendErr(err);
      }
      const saved = records[0];
      const savedID = saved.getId();
      const savedObj = {
        id: savedID,
        link: `https://airtable.com/${tableID}/${viewID}/${savedID}`
      };
      console.log('Saved new donation:', saved, savedObj);
      // Update home view (?)
      // Send Slack message
      return savedObj;
    });
  }
};

module.exports = at;