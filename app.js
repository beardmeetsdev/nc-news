const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getApi } = require("./controllers/news_controllers");

app.get("/api", getApi);

module.exports = app;
