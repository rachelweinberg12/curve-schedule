const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
console.log(process.env.AIRTABLE_API_KEY);
export const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
