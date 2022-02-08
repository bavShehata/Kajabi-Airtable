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
  var member = {
    info: [],
    earnings: [],
    payments: [],
  };
  const email = req.query.email;
  console.log("EMAIL: ", email);
  if (!email) return res.send({ error: 1, message: "You are not logged in" });
  // Get member's info
  try {
    await new Promise((resolve, reject) => {
      base("Members")
        .select({
          view: "Grid view",
          filterByFormula: `{Email} = "${email}"`,
          fields: ["Name", "Email", "Balance", "Updated"],
        })
        .firstPage(function (err, records) {
          if (err || records.length == 0) {
            console.error(err);
            return reject({});
          }
          records.forEach(function (record) {
            console.log("Retrieved", record.get("Name"));
            // Add the record to an array
            member.info.push(record.fields);
          });
          resolve();
        });
    });
  } catch (e) {
    console.log("Couldn't find member record", e);
    return res.send({ error: 1, message: "Couldn't find member record" });
  }
  // Get member's earnings
  try {
    await new Promise((resolve, reject) => {
      base("Earnings")
        .select({
          view: "Grid view",
          filterByFormula: `{Email (from Member)} = "${email}"`,
          fields: ["Program", "Earnings", "Created"],
        })
        .firstPage(function (err, records) {
          if (err) {
            console.error(err);
            return reject({});
          }
          records.forEach(function (record) {
            console.log("Retrieved", record.get("Program"));
            // Add the record to an array
            member.earnings.push(record.fields);
          });
          resolve();
        });
    });
  } catch (e) {
    console.log("Couldn't find earnings record", e);
    return res.send({ error: 1, message: "Couldn't find earnings record" });
  }

  // Get member's payments
  try {
    await new Promise((resolve, reject) => {
      base("Payments")
        .select({
          view: "Grid view",
          filterByFormula: `{Email (from Member)} = "${email}"`,
          fields: ["Product", "Amount", "Created"],
        })
        .firstPage(function (err, records) {
          if (err) {
            console.error(err);
            return reject({});
          }
          records.forEach(function (record) {
            console.log("Retrieved", record.get("Name"));
            // Add the record to an array
            member.payments.push(record.fields);
          });
          resolve();
        });
    });
  } catch (e) {
    console.log("Couldn't find payment record", e);
    return res.send({ error: 1, message: "Couldn't find payment record" });
  }
  return res.send(member);
});
