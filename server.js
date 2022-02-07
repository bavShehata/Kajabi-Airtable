//Environment variables
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT ?? 8001;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(express.json());

// Enabling CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: "key36w3SLu6gshyxr",
});
var base = Airtable.base("apppMCZ2SaWlLJvYq");

app.get("/airtable", async (req, res) => {
  base("Members")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 4,
      view: "Grid view",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record) {
          console.log("Retrieved", record.get("Name"));
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  try {
  } catch (e) {}
});
