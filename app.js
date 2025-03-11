const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getApi, getTopics } = require("./controllers/news_controllers");

app.get("/api", getApi);
app.get("/api/topics", getTopics);

module.exports = app;
