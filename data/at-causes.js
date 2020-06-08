const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);
const table = process.env.AIRTABLE_CAUSES;
const tableID = process.env.AIRTABLE_CAUSES_ID;
const viewID = process.env.AIRTABLE_CAUSES_VIEW_ID;

/*------------------
  AIRTABLE: CAUSES
------------------*/

const sendErr = (err) => {
  console.error(err);
  return new Error(err);
};

const atCauses = {
  /*----
    Save a new cause
  ----*/
  async saveCause(app, data) {
    base(table).create([
      {
        "fields": {
          "Organization": data.organization,
          "URL": data.url,
          "Description": data.description
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
      console.log('Saved new cause:', saved, savedObj);
      // Update home view (?)
      // Send Slack message
      return savedObj;
    });
  }
};

module.exports = atCauses;