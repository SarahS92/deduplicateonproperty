// src/action.js
var hubspot = require("@hubspot/api-client");
exports.main = async (event, callback) => {
  const ID = event["inputFields"]["id"];
  let hasDuplicate = false;
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.APIKEY
  });
  try {
    const apiResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [{
        "filters": [{
          "value": ID,
          "propertyName": "salesforceaccountid",
          "operator": "EQ"
        }]
      }]
    });
    console.log(JSON.stringify(apiResponse, null, 2));
    const totalResults = apiResponse.total;
    if (totalResults > 1) {
      console.log("Found duplicate!");
      hasDuplicate = true;
    }
  } catch (e) {
    e.message === "HTTP request failed" ? console.error(JSON.stringify(e.response, null, 2)) : console.error(e);
  }
  callback({
    outputFields: { has_duplicate: hasDuplicate }
  });
};
