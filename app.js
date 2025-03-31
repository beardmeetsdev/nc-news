const express = require("express");
const app = express();
const cors = require("cors");

const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
  postArticleComment,
  patchArticleById,
  removeCommentById,
  getUsers,
} = require("./controllers/news_controllers");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postArticleComment);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", removeCommentById);
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: "Violation of constraint: body cannot be NULL" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ msg: "Table column does not exist" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "42601") {
    res.status(400).send({ msg: "Bad 'sort' arguement" });
  } else next(err);
});

module.exports = app;
