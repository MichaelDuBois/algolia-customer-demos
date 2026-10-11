const path = require("path");
const fs = require("fs");
const util = require("util");
const express = require("express");
const algoliasearch = require("algoliasearch");
const user = require("./user");

const app = express();
const readFileAsync = util.promisify(fs.readFile);

const APP_ID = "U34K6693NA";
const API_KEY = "43d12776e325f6347604637011a645cc";

const client = algoliasearch(APP_ID, API_KEY);

/**
 * Availability|Programs ==> ${user.province}.${user.facility}.is_${user.programs} = 1
 * DATE                  ==> ${user.province}.start_date >= ${user.calendarDate.getTime()} AND ( ${user.province}.end_date <= ${user.calendarDate.getTime()} OR ${user.province}.end_date = 0 )
 */
let getAllFilters = (extraFilter = []) => {
  const time = user.calendarDate.getTime() / 1000;

  let filters = [
    // Availability
    `${user.province}.${user.facility}.is_${user.programs} = 1`,

    // Start Date
    `${user.province}.start_date <= ${time}`,

    // End Date
    `( ${user.province}.end_date >= ${time} OR ${user.province}.end_date = 0 )`
  ];

  if (user.isTwoDayDeliveryUser) {
    filters.push(`is_one_day_delivery = 1`);
  }

  return [...filters, ...extraFilter].join(" AND ");
};

/**
 * Get the right list of attributes
 */
let getAttributes = () => {
  return [
    "name",
    "subtitle",
    "description",
    "slug",
    "categories",
    "allergens",
    "image",
    "is_promo",
    `${user.province}.plan_prices.${user.price_set}`,
    `${user.province}.${user.facility}.price.transit_days_${user.transitDays}`,
    `${user.province}.${user.facility}.price_msrp`
  ];
};

let sendParametersToFrontend = (API_KEY, index) => {
  const locale = user.locale.toUpperCase();

  let indexWithServerData = index.replace(
    "__SERVER_DATA__",
    JSON.stringify({
      ALGOLIA_API_KEY: API_KEY
    })
  );

  indexWithServerData = indexWithServerData.replace(
    "__INDEX__",
    `GOODFOOD_NS_${locale}`
  );

  return indexWithServerData.replace("__USER__", JSON.stringify(user));
};

app.use(
  express.static(path.join(), {
    index: false
  })
);

app.get("/", async (_, res) => {
  const index = await readFileAsync(path.join("index.html"), "utf-8");

  const securedApiKeywest = client.generateSecuredApiKey(API_KEY, {
    filters: getAllFilters(),
    attributesToRetrieve: getAttributes()
  });

  res.send(sendParametersToFrontend(securedApiKeywest, index));
});

app.get("/:categoryCode", async (req, res) => {
  const categoryCode = req.params.categoryCode;
  const index = await readFileAsync(path.join("index.html"), "utf-8");

  const securedApiKeywest = client.generateSecuredApiKey(API_KEY, {
    filters: getAllFilters([`categories:${categoryCode}`]),
    attributesToRetrieve: getAttributes()
  });

  res.send(sendParametersToFrontend(securedApiKeywest, index));
});

console.log("Server listening at http://localhost:8888");
app.listen(8888);
