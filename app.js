const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
} = require("./controllers/news_controllers");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

module.exports = app;
