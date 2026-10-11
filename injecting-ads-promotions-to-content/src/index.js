import "./reset.css";
import "./styles.css";
import algoliasearch from "algoliasearch";
import search from "./search";

let client;
let query;
let filterForAds = "";
let adPositions = [];
let appID;
let apiKey;
let indexName;

function bindEvents() {
  document.getElementById("appID").addEventListener("keyup", (event) => {
    appID = event.target.value;
    client = algoliasearch(appID, apiKey);
    search(query, filterForAds, adPositions, client, indexName);
  });
  document.getElementById("apiKey").addEventListener("keyup", (event) => {
    apiKey = event.target.value;
    client = algoliasearch(appID, apiKey);
    search(query, filterForAds, adPositions, client, indexName);
  });
  document.getElementById("indexName").addEventListener("keyup", (event) => {
    indexName = event.target.value;
    search(query, filterForAds, adPositions, client, indexName);
  });
  document.getElementById("searchBar").addEventListener("keyup", (event) => {
    query = event.target.value;
    search(query, filterForAds, adPositions, client, indexName);
  });
  document.getElementById("filter").addEventListener("keyup", (event) => {
    filterForAds = event.target.value;
    search(query, filterForAds, adPositions, client, indexName);
  });
  document.getElementById("adPositions").addEventListener("keyup", (event) => {
    adPositions = event.target.value.split(",").map((pos) => pos - 1);
    search(query, filterForAds, adPositions, client, indexName);
  });
}

function init() {
  appID = document.getElementById("appID").value;
  apiKey = document.getElementById("apiKey").value;

  filterForAds = document.getElementById("filter").value;
  adPositions = document
    .getElementById("adPositions")
    .value.split(",")
    .map((pos) => pos - 1);
  client = algoliasearch(appID, apiKey);
  query = document.getElementById("searchBar").value;
  indexName = document.getElementById("indexName").value;
}

init();
bindEvents();

search(query, filterForAds, adPositions, client, indexName);
